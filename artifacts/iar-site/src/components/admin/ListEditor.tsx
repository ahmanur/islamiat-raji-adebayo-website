import React, { useEffect, useState } from 'react';
import { getList, upsertListItem, deleteListItem, type ListKey, type ListRecord } from '@/lib/cms';
import { ImagePicker } from './ImagePicker';

interface FieldDef {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'url' | 'image';
  placeholder?: string;
  imageFallback?: string;
  imageHint?: string;
}

interface ListEditorProps {
  listKey: ListKey;
  fields: FieldDef[];
  itemLabel: string;
  defaultItem?: Record<string, string>;
  defaultItems?: Array<Record<string, string>>;
}

function FieldInput({ field, value, onChange }: { field: FieldDef; value: string; onChange: (v: string) => void }) {
  if (field.type === 'image') {
    return (
      <ImagePicker
        label={field.label}
        value={value}
        fallback={field.imageFallback}
        onChange={onChange}
        hint={field.imageHint}
      />
    );
  }
  if (field.type === 'textarea') {
    return (
      <textarea
        rows={3}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
      />
    );
  }
  return (
    <input
      type={field.type === 'url' ? 'url' : 'text'}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={field.placeholder}
      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
    />
  );
}

export function ListEditor({ listKey, fields, itemLabel, defaultItem = {}, defaultItems }: ListEditorProps) {
  const [items, setItems] = useState<ListRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newValues, setNewValues] = useState<Record<string, string>>(defaultItem);
  const [seeding, setSeeding] = useState(false);

  const load = async () => {
    const data = await getList(listKey);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [listKey]);

  const startEdit = (item: ListRecord) => {
    setEditingId(item.id);
    setEditValues(item.data);
  };

  const saveEdit = async (item: ListRecord) => {
    setSaving(true);
    await upsertListItem(listKey, { id: item.id, sort_order: item.sort_order, data: editValues });
    await load();
    setEditingId(null);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    await deleteListItem(id);
    await load();
  };

  const handleAdd = async () => {
    setSaving(true);
    await upsertListItem(listKey, {
      id: crypto.randomUUID(),
      sort_order: items.length,
      data: newValues,
    });
    setNewValues(defaultItem);
    setAdding(false);
    await load();
    setSaving(false);
  };

  const handleSeedDefaults = async () => {
    if (!defaultItems || defaultItems.length === 0) return;
    if (!confirm(`This will populate ${defaultItems.length} default items. Continue?`)) return;
    setSeeding(true);
    for (let i = 0; i < defaultItems.length; i++) {
      await upsertListItem(listKey, {
        id: crypto.randomUUID(),
        sort_order: items.length + i,
        data: defaultItems[i],
      });
    }
    await load();
    setSeeding(false);
  };

  if (loading) return <div className="text-slate-400 text-sm">Loading…</div>;

  return (
    <div className="space-y-4">
      {items.length === 0 && defaultItems && defaultItems.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="text-amber-300 text-sm">No entries yet. Load the default content to get started.</div>
          <button
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="shrink-0 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {seeding ? 'Loading…' : 'Load Defaults'}
          </button>
        </div>
      )}

      {items.map(item => (
        <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          {editingId === item.id ? (
            <div className="space-y-4">
              {fields.map(f => (
                <div key={f.key}>
                  {f.type !== 'image' && (
                    <label className="block text-xs font-medium text-slate-400 mb-1">{f.label}</label>
                  )}
                  <FieldInput
                    field={f}
                    value={editValues[f.key] ?? ''}
                    onChange={v => setEditValues(prev => ({ ...prev, [f.key]: v }))}
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <button onClick={() => saveEdit(item)} disabled={saving}
                  className="bg-primary hover:bg-primary/90 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button onClick={() => setEditingId(null)}
                  className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3 min-w-0 flex-1">
                {(() => {
                  const imgField = fields.find(f => f.type === 'image');
                  const imgSrc = imgField ? (item.data[imgField.key] || imgField.imageFallback) : null;
                  return imgSrc ? (
                    <img src={imgSrc} alt="" className="w-14 h-10 rounded-lg object-cover flex-shrink-0 border border-slate-700" />
                  ) : null;
                })()}
                <div className="min-w-0">
                  <div className="text-white text-sm font-medium truncate">
                    {item.data[fields.find(f => f.type !== 'image')?.key ?? fields[0].key] || '(empty)'}
                  </div>
                  {(() => {
                    const second = fields.filter(f => f.type !== 'image')[1];
                    return second ? (
                      <div className="text-slate-400 text-xs mt-0.5 line-clamp-1">{item.data[second.key]}</div>
                    ) : null;
                  })()}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(item)}
                  className="text-xs text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg transition-colors">
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)}
                  className="text-xs text-red-400 hover:text-red-300 bg-slate-700 hover:bg-red-900/30 px-3 py-1 rounded-lg transition-colors">
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {adding ? (
        <div className="bg-slate-800 border border-primary/30 rounded-xl p-4 space-y-4">
          <div className="text-sm font-medium text-white">New {itemLabel}</div>
          {fields.map(f => (
            <div key={f.key}>
              {f.type !== 'image' && (
                <label className="block text-xs font-medium text-slate-400 mb-1">{f.label}</label>
              )}
              <FieldInput
                field={f}
                value={newValues[f.key] ?? ''}
                onChange={v => setNewValues(prev => ({ ...prev, [f.key]: v }))}
              />
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <button onClick={handleAdd} disabled={saving}
              className="bg-primary hover:bg-primary/90 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50">
              {saving ? 'Adding…' : `Add ${itemLabel}`}
            </button>
            <button onClick={() => { setAdding(false); setNewValues(defaultItem); }}
              className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)}
          className="w-full border-2 border-dashed border-slate-700 hover:border-slate-600 rounded-xl py-3 text-slate-500 hover:text-slate-400 text-sm transition-colors">
          + Add {itemLabel}
        </button>
      )}
    </div>
  );
}
