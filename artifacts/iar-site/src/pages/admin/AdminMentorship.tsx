import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { ListEditor } from '@/components/admin/ListEditor';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';

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
              { key: 'intro', label: 'Introduction (displayed as pull quote)', type: 'textarea' },
              { key: 'para2', label: 'Second Paragraph', type: 'textarea' },
              { key: 'quote', label: 'Featured Quote (shown on image card)', type: 'textarea' },
              { key: 'application', label: 'How to Apply / Contact', type: 'textarea' },
            ]}
            defaults={CONTENT_DEFAULTS.mentorship}
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-4">Mentorship Roles / Opportunity Cards</h2>
          <ListEditor
            listKey="mentorship_roles"
            itemLabel="Role"
            fields={[
              { key: 'title', label: 'Role Title', placeholder: 'Graduate Students' },
              { key: 'description', label: 'Description', type: 'textarea' },
            ]}
            defaultItems={LIST_DEFAULTS.mentorship_roles}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
