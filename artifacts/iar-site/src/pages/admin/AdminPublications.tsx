import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ListEditor } from '@/components/admin/ListEditor';

export function AdminPublications() {
  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <h1 className="text-xl font-semibold text-white mb-1">Publications</h1>
        <p className="text-slate-400 text-sm mb-6">Manage your list of publications. Add DOI or URL to link to full text.</p>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
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
          />
        </div>
      </div>
    </AdminLayout>
  );
}
