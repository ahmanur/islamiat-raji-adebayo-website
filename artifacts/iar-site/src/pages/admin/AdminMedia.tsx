import React, { useEffect, useRef, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';

interface MediaItem {
  name: string;
  url: string;
  size: number;
  created_at: string;
}

export function AdminMedia() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data, error } = await supabase.storage.from('cms-media').list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
    if (!error && data) {
      const enriched = await Promise.all(
        data.filter(f => f.name !== '.emptyFolderPlaceholder').map(async f => {
          const { data: urlData } = supabase.storage.from('cms-media').getPublicUrl(f.name);
          return { name: f.name, url: urlData.publicUrl, size: f.metadata?.size ?? 0, created_at: f.created_at ?? '' };
        })
      );
      setItems(enriched);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error } = await supabase.storage.from('cms-media').upload(path, file, { upsert: true });
    if (!error) await load();
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await supabase.storage.from('cms-media').remove([name]);
    await load();
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Media Manager</h1>
            <p className="text-slate-400 text-sm">Upload and manage images for the website.</p>
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {uploading ? 'Uploading…' : '+ Upload Image'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-slate-400 text-sm">Loading media…</div>
        ) : items.length === 0 ? (
          <div className="bg-slate-900 border border-dashed border-slate-700 rounded-xl p-12 text-center">
            <div className="text-3xl mb-3">🖼</div>
            <div className="text-slate-400 text-sm">No media uploaded yet. Click Upload Image to get started.</div>
            <div className="text-slate-600 text-xs mt-2">Note: You need a "cms-media" storage bucket in Supabase with public access.</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => (
              <div key={item.name} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group">
                <div className="aspect-square bg-slate-800">
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <div className="text-xs text-slate-400 truncate mb-2">{item.name}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(item.url)}
                      className="flex-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded-lg transition-colors"
                    >
                      {copied === item.url ? '✓ Copied' : 'Copy URL'}
                    </button>
                    <button
                      onClick={() => handleDelete(item.name)}
                      className="text-xs bg-slate-800 hover:bg-red-900/40 text-red-400 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
