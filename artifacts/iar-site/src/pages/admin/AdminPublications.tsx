import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ListEditor } from '@/components/admin/ListEditor';
import { ImagePicker } from '@/components/admin/ImagePicker';
import { LIST_DEFAULTS } from '@/lib/cmsDefaults';
import { getContent, setContentBulk } from '@/lib/cms';

export function AdminPublications() {
  const [bannerUrl, setBannerUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getContent('publications').then(data => {
      setBannerUrl(data.banner_image ?? '');
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await setContentBulk('publications', { banner_image: bannerUrl });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">Publications</h1>
          <p className="text-slate-400 text-sm">Manage publications list and optional page banner image.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-4">Page Banner Image (optional)</h2>
          {loading ? (
            <div className="text-slate-400 text-sm">Loading…</div>
          ) : (
            <div className="space-y-4">
              <ImagePicker
                label="Banner / Header Image"
                value={bannerUrl}
                fallback=""
                onChange={setBannerUrl}
                hint="Optional banner shown at the top of the Publications page. Leave empty to hide."
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-medium rounded-lg px-5 py-2.5 text-sm transition-colors"
              >
                {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Image'}
              </button>
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-4">Publications List</h2>
          <ListEditor
            listKey="publications"
            itemLabel="Publication"
            fields={[
              { key: 'title', label: 'Title', placeholder: 'Paper title' },
              { key: 'authors', label: 'Authors', placeholder: 'Raji-Adebayo, I., et al.' },
              { key: 'journal', label: 'Journal / Conference', placeholder: 'Landscape and Urban Planning' },
              { key: 'year', label: 'Year', placeholder: '2024' },
              { key: 'category', label: 'Category', placeholder: 'Journal Article / Book Chapter / Conference Paper' },
              { key: 'url', label: 'DOI / URL', type: 'url', placeholder: 'https://doi.org/…' },
            ]}
            defaultItems={LIST_DEFAULTS.publications}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
