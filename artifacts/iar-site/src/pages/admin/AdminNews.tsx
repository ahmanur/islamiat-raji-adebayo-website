import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ListEditor } from '@/components/admin/ListEditor';

export function AdminNews() {
  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <h1 className="text-xl font-semibold text-white mb-1">News & Updates</h1>
        <p className="text-slate-400 text-sm mb-6">Manage timeline entries on the homepage. Most recent first.</p>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <ListEditor
            listKey="news_items"
            itemLabel="News Entry"
            fields={[
              { key: 'date', label: 'Date', placeholder: 'January 2025' },
              { key: 'title', label: 'Title', placeholder: 'News headline' },
              { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description…' },
            ]}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
