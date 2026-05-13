import React, { useRef, useState } from 'react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Video, Music, Link, Upload, X } from 'lucide-react';

let _adminSupabase: SupabaseClient | null = null;
function getAdminSupabase(): SupabaseClient {
  if (!_adminSupabase) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string;
    if (!supabaseUrl || !supabaseServiceKey) throw new Error('Supabase credentials are not configured.');
    _adminSupabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
  }
  return _adminSupabase;
}

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

interface MediaPickerProps {
  type: 'video' | 'audio';
  value: string;
  onChange: (url: string) => void;
}

export function MediaPicker({ type, value, onChange }: MediaPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState('');

  const isVideo = type === 'video';
  const accept = isVideo ? 'video/mp4,video/webm,video/ogg,video/mov,video/quicktime' : 'audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/flac,audio/aac';
  const label = isVideo ? 'video' : 'audio';
  const Icon = isVideo ? Video : Music;

  const isYouTubeOrVimeo = /youtube\.com|youtu\.be|vimeo\.com/i.test(value);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    if (file.size > MAX_BYTES) {
      setError(`File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed is 15 MB.`);
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const ext = file.name.split('.').pop() ?? (isVideo ? 'mp4' : 'mp3');
      const path = `uploads/${type}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const client = getAdminSupabase();
      const { error: uploadError } = await client.storage
        .from('cms-media')
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      const { data } = client.storage.from('cms-media').getPublicUrl(path);
      onChange(data.publicUrl);
      setProgress(100);
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
      {error && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          <span className="text-red-400 text-sm leading-none mt-0.5">✕</span>
          <p className="text-red-300 text-xs">{error}</p>
        </div>
      )}

      {value && !urlMode && (
        <div className="relative rounded-lg border border-slate-700 bg-slate-900/70 overflow-hidden">
          {isVideo && isYouTubeOrVimeo ? (
            <div className="flex items-center gap-2 px-3 py-2">
              <Icon className="w-4 h-4 text-primary/60 shrink-0" />
              <span className="text-xs text-slate-400 truncate flex-1">{value}</span>
              <button type="button" onClick={() => onChange('')} className="text-slate-500 hover:text-red-400 transition-colors"><X className="w-3.5 h-3.5" /></button>
            </div>
          ) : isVideo ? (
            <div className="space-y-1">
              <video src={value} controls className="w-full rounded-lg max-h-40 bg-black" preload="metadata" />
              <div className="flex items-center justify-between px-2 pb-1">
                <span className="text-xs text-slate-500 truncate">{value.replace(/^https?:\/\/[^/]+\//, '…/')}</span>
                <button type="button" onClick={() => onChange('')} className="text-slate-500 hover:text-red-400 transition-colors shrink-0 ml-2"><X className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-3 py-2">
              <Icon className="w-4 h-4 text-primary/60 shrink-0" />
              <audio src={value} controls className="flex-1 h-8" preload="metadata" />
              <button type="button" onClick={() => onChange('')} className="text-slate-500 hover:text-red-400 transition-colors shrink-0"><X className="w-3.5 h-3.5" /></button>
            </div>
          )}
        </div>
      )}

      {urlMode ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
            placeholder={isVideo ? 'https://youtube.com/watch?v=… or direct file URL' : 'https://xeno-canto.org/sounds/…/XC12345.mp3'}
            autoFocus
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button type="button" onClick={handleUrlSubmit} className="bg-primary hover:bg-primary/90 text-white text-xs px-3 py-2 rounded-lg transition-colors">Use</button>
          <button type="button" onClick={() => { setUrlMode(false); setUrlInput(''); }} className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-2 rounded-lg transition-colors">Cancel</button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={handleUpload} />
          <button
            type="button"
            onClick={() => { setError(''); fileRef.current?.click(); }}
            disabled={uploading}
            className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            {uploading ? `Uploading…` : `Upload ${label} (max 15 MB)`}
          </button>
          <button
            type="button"
            onClick={() => { setError(''); setUrlMode(true); }}
            className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <Link className="w-3.5 h-3.5" />
            Enter URL
          </button>
        </div>
      )}

      {uploading && (
        <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-pulse rounded-full w-full" />
        </div>
      )}
    </div>
  );
}
