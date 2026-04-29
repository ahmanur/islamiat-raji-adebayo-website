import React, { useRef, useState } from 'react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _adminSupabase: SupabaseClient | null = null;

function getAdminSupabase(): SupabaseClient {
  if (!_adminSupabase) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string;
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials are not configured.');
    }
    _adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });
  }
  return _adminSupabase;
}

interface ImagePickerProps {
  label: string;
  value: string;
  fallback?: string;
  onChange: (url: string) => void;
  hint?: string;
}

export function ImagePicker({ label, value, fallback, onChange, hint }: ImagePickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState('');

  const displaySrc = value || fallback || '';

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const client = getAdminSupabase();
      const { error: uploadError } = await client.storage
        .from('cms-media')
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      const { data } = client.storage.from('cms-media').getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err) {
      setError('Upload failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlMode(false);
      setUrlInput('');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}

      <div className="flex gap-4 items-start">
        <div className="w-32 h-24 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0 relative group">
          {displaySrc ? (
            <img src={displaySrc} alt={label} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-600 text-xs text-center px-2">No image</div>
          )}
          {value && value !== fallback && (
            <button
              onClick={() => onChange('')}
              title="Remove custom image (revert to default)"
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex-1 space-y-2">
          {error && <div className="text-red-400 text-xs">{error}</div>}

          {urlMode ? (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
                placeholder="https://…"
                autoFocus
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button onClick={handleUrlSubmit} className="bg-primary hover:bg-primary/90 text-white text-xs px-3 py-2 rounded-lg transition-colors">
                Use
              </button>
              <button onClick={() => { setUrlMode(false); setUrlInput(''); }} className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-2 rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
              >
                {uploading ? '⏳ Uploading…' : '⬆ Upload image'}
              </button>
              <button
                onClick={() => setUrlMode(true)}
                className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
              >
                🔗 Enter URL
              </button>
            </div>
          )}

          {value && (
            <div className="text-slate-600 text-xs truncate max-w-xs" title={value}>
              {value.startsWith('http') ? value.replace(/^https?:\/\//, '') : value}
            </div>
          )}
          {!value && fallback && (
            <div className="text-slate-600 text-xs">Using default: <span className="text-slate-500">{fallback}</span></div>
          )}
        </div>
      </div>
    </div>
  );
}
