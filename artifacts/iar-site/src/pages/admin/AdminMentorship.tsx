import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { ListEditor } from '@/components/admin/ListEditor';

export function AdminMentorship() {
  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">Mentorship Section</h1>
          <p className="text-slate-400 text-sm">Edit mentorship text and opportunity listings.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-4">Section Text</h2>
          <ContentEditor
            section="mentorship"
            fields={[
              { key: 'intro', label: 'Introduction', type: 'textarea', placeholder: 'Describe your mentorship approach…' },
              { key: 'application', label: 'How to Apply / Contact', type: 'textarea', placeholder: 'Please reach out via email…' },
            ]}
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-4">Mentorship Roles / Opportunities</h2>
          <ListEditor
            listKey="mentorship_roles"
            itemLabel="Role"
            fields={[
              { key: 'title', label: 'Role Title', placeholder: 'Graduate Students' },
              { key: 'description', label: 'Description', type: 'textarea', placeholder: 'What you offer or seek…' },
            ]}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
