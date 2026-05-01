import React, { useRef, useState } from 'react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _adminSupabase: SupabaseClient | null = null;
function getAdminSupabase(): SupabaseClient {
  if (!_adminSupabase) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string;
    _adminSupabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
  }
  return _adminSupabase;
}

export interface GalleryEntry { url: string; caption: string }

export function parseGallery(raw: string): GalleryEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(item =>
      typeof item === 'string'
        ? { url: item, caption: '' }
        : { url: String(item.url ?? ''), caption: String(item.caption ?? '') }
    );
  } catch { return []; }
}

export function serializeGallery(entries: GalleryEntry[]): string {
  return JSON.stringify(entries);
}

interface GalleryPickerProps {
  label: string;
  value: string;
  onChange: (jsonValue: string) => void;
  hint?: string;
}

export function GalleryPicker({ label, value, onChange, hint }: GalleryPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const entries = parseGallery(value);

  const update = (next: GalleryEntry[]) => onChange(serializeGallery(next));

  const add = (url: string) => update([...entries, { url, caption: '' }]);

  const remove = (idx: number) => update(entries.filter((_, i) => i !== idx));

  const setCaption = (idx: number, caption: string) => {
    const next = entries.map((e, i) => i === idx ? { ...e, caption } : e);
    update(next);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `uploads/gallery-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const client = getAdminSupabase();
      const { error: uploadError } = await client.storage
        .from('cms-media')
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw new Error(uploadError.message);
      const { data } = client.storage.from('cms-media').getPublicUrl(path);
      add(data.publicUrl);
    } catch (err) {
      setError('Upload failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleUrlAdd = () => {
    if (urlInput.trim()) { add(urlInput.trim()); setUrlMode(false); setUrlInput(''); }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}

      {entries.length > 0 && (
        <div className="space-y-4">
          {entries.map((entry, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
              <div className="relative group aspect-[4/3]">
                <img src={entry.url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => remove(idx)}
                  title="Remove photo"
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  ✕
                </button>
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                  Photo {idx + 1}
                </div>
              </div>
              <div className="p-3">
                <label className="block text-[10px] font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                  Caption (optional)
                </label>
                <input
                  type="text"
                  value={entry.caption}
                  onChange={e => setCaption(idx, e.target.value)}
                  placeholder="Describe what's shown in this photo…"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-slate-600"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <div className="text-red-400 text-xs">{error}</div>}

      {urlMode ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUrlAdd()}
            placeholder="https://…"
            autoFocus
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button onClick={handleUrlAdd} className="bg-primary hover:bg-primary/90 text-white text-xs px-3 py-2 rounded-lg transition-colors">
            Add
          </button>
          <button onClick={() => { setUrlMode(false); setUrlInput(''); }} className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-2 rounded-lg transition-colors">
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 items-center">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          >
            {uploading ? '⏳ Uploading…' : '⬆ Upload photo'}
          </button>
          <button
            onClick={() => setUrlMode(true)}
            className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          >
            🔗 Add by URL
          </button>
          {entries.length > 0 && (
            <span className="text-slate-500 text-xs">{entries.length} photo{entries.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      )}
    </div>
  );
}
