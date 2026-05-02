import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  getList,
  upsertListItem,
  deleteListItem,
  reorderList,
  type ListRecord,
} from '@/lib/cms';
import { LIST_DEFAULTS } from '@/lib/cmsDefaults';

type NavItemData = {
  name: string;
  href: string;
  accent: boolean;
};

function readItem(r: ListRecord): NavItemData {
  return {
    name: (r.data?.name as string) ?? '',
    href: (r.data?.href as string) ?? '/',
    accent: r.data?.accent === true || r.data?.accent === 'true',
  };
}

export function AdminNavigation() {
  const [rows, setRows] = useState<ListRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const data = await getList('nav_items');
    setRows(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function update(idx: number, patch: Partial<NavItemData>) {
    setRows(prev => {
      const next = [...prev];
      const cur = readItem(next[idx]);
      next[idx] = { ...next[idx], data: { ...cur, ...patch } };
      return next;
    });
  }

  async function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[idx], next[target]] = [next[target], next[idx]];
    setRows(next);
    setSaving(true);
    await reorderList('nav_items', next.map(r => r.id));
    setSaving(false);
  }

  async function addItem() {
    const id = crypto.randomUUID();
    const item: ListRecord = {
      id,
      list_key: 'nav_items',
      sort_order: rows.length,
      data: { name: 'New Link', href: '/', accent: false },
      updated_at: new Date().toISOString(),
    };
    await upsertListItem('nav_items', { id, sort_order: rows.length, data: item.data });
    setRows(prev => [...prev, item]);
  }

  async function removeItem(id: string) {
    if (!confirm('Remove this navigation link?')) return;
    await deleteListItem(id);
    setRows(prev => prev.filter(r => r.id !== id));
  }

  async function saveAll() {
    setSaving(true);
    setMessage(null);
    try {
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        await upsertListItem('nav_items', {
          id: r.id,
          sort_order: i,
          data: r.data,
        });
      }
      setMessage('Saved. Refresh the public site to see changes.');
    } catch (e) {
      setMessage('Save failed. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  }

  async function loadDefaults() {
    if (rows.length > 0 && !confirm('This will replace all current navigation links with the defaults. Continue?')) return;
    setSaving(true);
    for (const r of rows) {
      await deleteListItem(r.id);
    }
    const defaults = LIST_DEFAULTS.nav_items ?? [];
    const seeded: ListRecord[] = [];
    for (let i = 0; i < defaults.length; i++) {
      const id = crypto.randomUUID();
      const data = defaults[i];
      await upsertListItem('nav_items', { id, sort_order: i, data });
      seeded.push({
        id,
        list_key: 'nav_items',
        sort_order: i,
        data,
        updated_at: new Date().toISOString(),
      });
    }
    setRows(seeded);
    setSaving(false);
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">Navigation</h1>
            <p className="text-sm text-slate-400">Reorder, rename, and manage the links shown in the site header.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={loadDefaults}
              disabled={saving}
              className="px-3 py-2 rounded-md text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
            >
              Load defaults
            </button>
            <button
              onClick={saveAll}
              disabled={saving || loading}
              className="px-4 py-2 rounded-md text-sm bg-primary text-white hover:bg-primary/90 disabled:opacity-40"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>

        {message && (
          <div className="rounded-md border border-emerald-700/40 bg-emerald-900/20 text-emerald-200 text-sm px-4 py-2">
            {message}
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="hidden md:grid grid-cols-[64px_1fr_1fr_100px_140px] gap-3 px-4 py-3 border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
            <div>Order</div>
            <div>Label</div>
            <div>Path / URL</div>
            <div>Accent</div>
            <div className="text-right">Actions</div>
          </div>

          {loading && (
            <div className="p-6 text-sm text-slate-500">Loading…</div>
          )}

          {!loading && rows.length === 0 && (
            <div className="p-6 text-sm text-slate-500">
              No navigation links yet. Click <span className="text-slate-300">Load defaults</span> to start, or add one below.
            </div>
          )}

          {!loading && rows.map((r, idx) => {
            const item = readItem(r);
            return (
              <div
                key={r.id}
                className="grid md:grid-cols-[64px_1fr_1fr_100px_140px] grid-cols-1 gap-3 px-4 py-3 border-b border-slate-800/60 last:border-0 items-center"
              >
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0 || saving}
                    aria-label="Move up"
                    className="w-7 h-7 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => move(idx, 1)}
                    disabled={idx === rows.length - 1 || saving}
                    aria-label="Move down"
                    className="w-7 h-7 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    ↓
                  </button>
                </div>

                <div>
                  <label className="md:hidden block text-xs text-slate-500 mb-1">Label</label>
                  <input
                    value={item.name}
                    onChange={e => update(idx, { name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary"
                    placeholder="e.g. Research"
                  />
                </div>

                <div>
                  <label className="md:hidden block text-xs text-slate-500 mb-1">Path / URL</label>
                  <input
                    value={item.href}
                    onChange={e => update(idx, { href: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-primary"
                    placeholder="/research"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={item.accent}
                    onChange={e => update(idx, { accent: e.target.checked })}
                    className="rounded border-slate-600 bg-slate-950"
                  />
                  <span className="md:hidden">Accent (highlighted)</span>
                  <span className="hidden md:inline text-xs text-slate-500">Highlight</span>
                </label>

                <div className="flex justify-end">
                  <button
                    onClick={() => removeItem(r.id)}
                    className="px-3 py-1.5 rounded text-xs text-red-300 hover:text-red-200 hover:bg-red-900/30"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={addItem}
            disabled={saving}
            className="px-4 py-2 rounded-md text-sm bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40"
          >
            + Add link
          </button>
          <p className="text-xs text-slate-500">
            Tip: use the up/down arrows to reorder. The accent style is reserved for emphasised links (e.g. Opportunities).
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
