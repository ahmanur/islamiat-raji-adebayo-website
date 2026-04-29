import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { ListEditor } from '@/components/admin/ListEditor';

export function AdminOpportunities() {
  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">Opportunities</h1>
          <p className="text-slate-400 text-sm">Edit the opportunities page content and listings.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-4">Page Introduction</h2>
          <ContentEditor
            section="opportunities"
            fields={[
              { key: 'intro', label: 'Introduction', type: 'textarea' },
              { key: 'contact_cta', label: 'Contact Call-to-Action', type: 'textarea' },
            ]}
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-4">Open Positions / Listings</h2>
          <ListEditor
            listKey="opportunities_list"
            itemLabel="Opportunity"
            fields={[
              { key: 'title', label: 'Position Title', placeholder: 'MSc / PhD Opportunity' },
              { key: 'type', label: 'Type', placeholder: 'Graduate / Postdoc / Volunteer' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'deadline', label: 'Deadline', placeholder: 'Rolling / December 2025' },
              { key: 'url', label: 'Application URL (optional)', type: 'url' },
            ]}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
