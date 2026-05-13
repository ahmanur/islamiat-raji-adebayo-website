import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { ImagePicker } from '@/components/admin/ImagePicker';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';
import {
  getList,
  upsertListItem,
  deleteListItem,
  type ListRecord,
} from '@/lib/cms';

type Photo = { image: string; caption: string };
type MediaItem = { url: string; label: string };
type FieldworkEntry = { region: string; caption: string; photos: Photo[]; videos: MediaItem[]; audios: MediaItem[] };

const LIST_KEY = 'field_work_entries' as const;

const EMPTY_ENTRY: FieldworkEntry = { region: '', caption: '', photos: [], videos: [], audios: [] };

function normalize(record: ListRecord): FieldworkEntry {
  const data = record.data ?? {};
  // Migrate legacy single video_url / audio_url fields to arrays
  const videos: MediaItem[] = Array.isArray(data.videos)
    ? (data.videos as MediaItem[])
    : (data.video_url as string) ? [{ url: data.video_url as string, label: '' }] : [];
  const audios: MediaItem[] = Array.isArray(data.audios)
    ? (data.audios as MediaItem[])
    : (data.audio_url as string) ? [{ url: data.audio_url as string, label: '' }] : [];
  return {
    region: (data.region as string) ?? '',
    caption: (data.caption as string) ?? '',
    photos: Array.isArray(data.photos) ? (data.photos as Photo[]) : [],
    videos,
    audios,
  };
}

interface EntryFormProps {
  initial: FieldworkEntry;
  saving: boolean;
  onSave: (data: FieldworkEntry) => Promise<void> | void;
  onCancel: () => void;
  saveLabel: string;
}

function EntryForm({ initial, saving, onSave, onCancel, saveLabel }: EntryFormProps) {
  const [data, setData] = useState<FieldworkEntry>(initial);

  const updatePhoto = (i: number, patch: Partial<Photo>) => {
    setData(d => ({ ...d, photos: d.photos.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) }));
  };
  const addPhoto = () => setData(d => ({ ...d, photos: [...d.photos, { image: '', caption: '' }] }));
  const removePhoto = (i: number) => {
    if (!confirm('Remove this photo?')) return;
    setData(d => ({ ...d, photos: d.photos.filter((_, idx) => idx !== i) }));
  };
  const movePhoto = (i: number, dir: -1 | 1) => {
    setData(d => {
      const next = [...d.photos];
      const j = i + dir;
      if (j < 0 || j >= next.length) return d;
      [next[i], next[j]] = [next[j], next[i]];
      return { ...d, photos: next };
    });
  };

  const updateVideo = (i: number, patch: Partial<MediaItem>) =>
    setData(d => ({ ...d, videos: d.videos.map((v, idx) => (idx === i ? { ...v, ...patch } : v)) }));
  const addVideo = () => setData(d => ({ ...d, videos: [...d.videos, { url: '', label: '' }] }));
  const removeVideo = (i: number) => setData(d => ({ ...d, videos: d.videos.filter((_, idx) => idx !== i) }));

  const updateAudio = (i: number, patch: Partial<MediaItem>) =>
    setData(d => ({ ...d, audios: d.audios.map((a, idx) => (idx === i ? { ...a, ...patch } : a)) }));
  const addAudio = () => setData(d => ({ ...d, audios: [...d.audios, { url: '', label: '' }] }));
  const removeAudio = (i: number) => setData(d => ({ ...d, audios: d.audios.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Region</label>
        <input
          type="text"
          value={data.region}
          onChange={e => setData(d => ({ ...d, region: e.target.value }))}
          placeholder="e.g. Southern Africa — KwaZulu-Natal"
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Caption</label>
        <p className="text-xs text-slate-500 mb-2">
          Short paragraph describing this fieldwork — appears under the region heading.
        </p>
        <textarea
          rows={3}
          value={data.caption}
          onChange={e => setData(d => ({ ...d, caption: e.target.value }))}
          placeholder="What you were doing, where, and why."
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
        />
      </div>

      {/* Videos */}
      <div>
        <div className="text-xs font-medium text-slate-300 mb-1">Videos</div>
        <p className="text-xs text-slate-500 mb-2">Paste YouTube or Vimeo links — each embeds as a player. Add as many as you like.</p>
        <div className="space-y-2">
          {data.videos.length === 0 && <div className="text-xs text-slate-500 italic px-1">No videos yet.</div>}
          {data.videos.map((v, i) => (
            <div key={i} className="bg-slate-900/70 border border-slate-700 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400 font-medium">Video {i + 1}</div>
                <button type="button" onClick={() => removeVideo(i)}
                  className="text-xs text-red-400 hover:text-red-300 bg-slate-800 hover:bg-red-900/30 px-2 py-1 rounded">Remove</button>
              </div>
              <input type="url" value={v.url} onChange={e => updateVideo(i, { url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=… or https://vimeo.com/…"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <input type="text" value={v.label} onChange={e => updateVideo(i, { label: e.target.value })}
                placeholder="Label (optional, e.g. 'Dawn chorus recording')"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          ))}
          <button type="button" onClick={addVideo}
            className="w-full border-2 border-dashed border-slate-700 hover:border-slate-600 rounded-lg py-2 text-slate-500 hover:text-slate-300 text-xs transition-colors">
            + Add Video
          </button>
        </div>
      </div>

      {/* Audios */}
      <div>
        <div className="text-xs font-medium text-slate-300 mb-1">Audio Recordings</div>
        <p className="text-xs text-slate-500 mb-2">
          Paste direct links to audio files (MP3, WAV, OGG) — e.g. from <a href="https://xeno-canto.org" target="_blank" rel="noopener noreferrer" className="text-primary underline">xeno-canto.org</a>. YouTube links don't work here — add those above as videos.
        </p>
        <div className="space-y-2">
          {data.audios.length === 0 && <div className="text-xs text-slate-500 italic px-1">No audio recordings yet.</div>}
          {data.audios.map((a, i) => (
            <div key={i} className="bg-slate-900/70 border border-slate-700 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400 font-medium">Recording {i + 1}</div>
                <button type="button" onClick={() => removeAudio(i)}
                  className="text-xs text-red-400 hover:text-red-300 bg-slate-800 hover:bg-red-900/30 px-2 py-1 rounded">Remove</button>
              </div>
              <input type="url" value={a.url} onChange={e => updateAudio(i, { url: e.target.value })}
                placeholder="https://xeno-canto.org/sounds/…/XC12345.mp3"
                className={`w-full bg-slate-900 border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${/youtube\.com|youtu\.be|vimeo\.com/i.test(a.url) ? 'border-amber-500' : 'border-slate-600'}`} />
              {/youtube\.com|youtu\.be|vimeo\.com/i.test(a.url) && (
                <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
                  <span className="text-amber-400 text-base leading-none mt-0.5">⚠</span>
                  <p className="text-amber-300 text-xs">YouTube/Vimeo links can't be used as audio — add them to Videos above.</p>
                </div>
              )}
              <input type="text" value={a.label} onChange={e => updateAudio(i, { label: e.target.value })}
                placeholder="Label (optional, e.g. 'Common Bulbul — Durban')"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          ))}
          <button type="button" onClick={addAudio}
            className="w-full border-2 border-dashed border-slate-700 hover:border-slate-600 rounded-lg py-2 text-slate-500 hover:text-slate-300 text-xs transition-colors">
            + Add Audio Recording
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-xs font-medium text-slate-300">Photos</div>
            <div className="text-xs text-slate-500">
              Upload one or more photos. Each can have its own caption shown beneath it.
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {data.photos.length === 0 && (
            <div className="text-xs text-slate-500 italic px-1">No photos yet.</div>
          )}
          {data.photos.map((photo, i) => (
            <div key={i} className="bg-slate-900/70 border border-slate-700 rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400 font-medium">Photo {i + 1}</div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => movePhoto(i, -1)}
                    disabled={i === 0}
                    className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-30 px-2 py-1 rounded"
                    title="Move up"
                  >↑</button>
                  <button
                    type="button"
                    onClick={() => movePhoto(i, 1)}
                    disabled={i === data.photos.length - 1}
                    className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-30 px-2 py-1 rounded"
                    title="Move down"
                  >↓</button>
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="text-xs text-red-400 hover:text-red-300 bg-slate-800 hover:bg-red-900/30 px-2 py-1 rounded"
                    title="Remove photo"
                  >Remove</button>
                </div>
              </div>
              <ImagePicker
                label="Photo"
                value={photo.image}
                onChange={v => updatePhoto(i, { image: v })}
                hint="Upload a field photo. Any orientation works."
              />
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Caption (optional)</label>
                <textarea
                  rows={2}
                  value={photo.caption}
                  onChange={e => updatePhoto(i, { caption: e.target.value })}
                  placeholder="Short description of this specific photo."
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addPhoto}
            className="w-full border-2 border-dashed border-slate-700 hover:border-slate-600 rounded-lg py-2.5 text-slate-500 hover:text-slate-300 text-xs transition-colors"
          >
            + Add Photo
          </button>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => onSave(data)}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : saveLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function FieldworkEntriesEditor() {
  const [items, setItems] = useState<ListRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const load = async () => {
    const data = await getList(LIST_KEY);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const saveEntry = async (id: string, sortOrder: number, data: FieldworkEntry) => {
    setSaving(true);
    await upsertListItem(LIST_KEY, { id, sort_order: sortOrder, data });
    await load();
    setEditingId(null);
    setAdding(false);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this fieldwork entry and all its photos?')) return;
    await deleteListItem(id);
    await load();
  };

  const handleSeedDefaults = async () => {
    const defaults = LIST_DEFAULTS.field_work_entries ?? [];
    if (defaults.length === 0) return;
    if (!confirm(`This will populate ${defaults.length} default fieldwork entries. Continue?`)) return;
    setSeeding(true);
    for (let i = 0; i < defaults.length; i++) {
      await upsertListItem(LIST_KEY, {
        id: crypto.randomUUID(),
        sort_order: items.length + i,
        data: defaults[i] as FieldworkEntry,
      });
    }
    await load();
    setSeeding(false);
  };

  if (loading) return <div className="text-slate-400 text-sm">Loading…</div>;

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="text-amber-300 text-sm">No fieldwork entries yet. Load the default content to get started.</div>
          <button
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="shrink-0 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {seeding ? 'Loading…' : 'Load Defaults'}
          </button>
        </div>
      )}

      {items.map(item => {
        const data = normalize(item);
        const isEditing = editingId === item.id;
        return (
          <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            {isEditing ? (
              <EntryForm
                initial={data}
                saving={saving}
                saveLabel="Save Fieldwork"
                onSave={d => saveEntry(item.id, item.sort_order, d)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3 min-w-0 flex-1">
                  {data.photos[0]?.image && (
                    <img
                      src={data.photos[0].image}
                      alt=""
                      className="w-14 h-10 rounded-lg object-cover flex-shrink-0 border border-slate-700"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="text-white text-sm font-medium truncate">
                      {data.region || '(no region)'}
                    </div>
                    <div className="text-slate-400 text-xs mt-0.5 line-clamp-1">
                      {data.photos.length} photo{data.photos.length === 1 ? '' : 's'}
                      {data.caption ? ` · ${data.caption}` : ''}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => { setAdding(false); setEditingId(item.id); }}
                    className="text-xs text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs text-red-400 hover:text-red-300 bg-slate-700 hover:bg-red-900/30 px-3 py-1 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {adding ? (
        <div className="bg-slate-800 border border-primary/30 rounded-xl p-4">
          <div className="text-sm font-medium text-white mb-3">New Fieldwork</div>
          <EntryForm
            initial={{ ...EMPTY_ENTRY }}
            saving={saving}
            saveLabel="Add Fieldwork"
            onSave={d => saveEntry(crypto.randomUUID(), items.length, d)}
            onCancel={() => setAdding(false)}
          />
        </div>
      ) : (
        <button
          onClick={() => { setEditingId(null); setAdding(true); }}
          className="w-full border-2 border-dashed border-slate-700 hover:border-slate-600 rounded-xl py-3 text-slate-500 hover:text-slate-400 text-sm transition-colors"
        >
          + Add Fieldwork
        </button>
      )}
    </div>
  );
}

export function AdminFieldWork() {
  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">Field Work</h1>
          <p className="text-slate-400 text-sm mb-6">
            Each "Fieldwork" has a region, a short caption, and a set of photos. Add as many
            fieldworks as you like — each appears as its own section on the public Field Work page.
          </p>
        </div>

        {/* Header / hero */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">Page Header</h2>
          <p className="text-slate-500 text-xs mb-3">
            Optional background image and the intro paragraph shown at the top of the page.
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <ContentEditor
              section="field_work_page"
              fields={[
                {
                  key: 'bg_image',
                  label: 'Header Background Image (optional)',
                  type: 'image',
                  imageHint: 'Optional wide landscape photo shown behind the title. Leave empty for the plain text-only header style.',
                },
                {
                  key: 'intro',
                  label: 'Intro Paragraph',
                  type: 'textarea',
                  placeholder: 'Short paragraph introducing your fieldwork.',
                },
              ]}
              defaults={CONTENT_DEFAULTS.field_work_page}
            />
          </div>
        </div>

        {/* Fieldworks */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">Fieldworks</h2>
          <p className="text-slate-500 text-xs mb-3">
            Add a fieldwork, give it a region and a caption, then upload as many photos as you
            need. Each photo can have its own caption.
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <FieldworkEntriesEditor />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
