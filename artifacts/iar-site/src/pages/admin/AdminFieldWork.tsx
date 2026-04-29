import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ListEditor } from '@/components/admin/ListEditor';
import { LIST_DEFAULTS } from '@/lib/cmsDefaults';

export function AdminFieldWork() {
  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <h1 className="text-xl font-semibold text-white mb-1">Field Work</h1>
        <p className="text-slate-400 text-sm mb-6">
          Manage field work projects shown on the Field Work page. These share the same data as Research Projects — editing here updates both pages.
        </p>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-1">Field Work Projects</h2>
          <p className="text-slate-500 text-xs mb-4">Upload a unique photo for each project to appear on the Field Work page.</p>
          <ListEditor
            listKey="research_projects"
            itemLabel="Project"
            fields={[
              {
                key: 'image',
                label: 'Project Image',
                type: 'image',
                imageFallback: '/images/spectrogram-art.png',
                imageHint: 'Field photo for this project. Ideally 4:3 landscape orientation.',
              },
              { key: 'status', label: 'Status', placeholder: 'Current Project / Past Project' },
              { key: 'title', label: 'Project Title', placeholder: 'Urban Campus Soundscape Project' },
              { key: 'location', label: 'Location / Institution', placeholder: 'Cornell University, Ithaca NY' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'methods', label: 'Methods (comma-separated)', placeholder: 'Autonomous acoustic recorders, Community science' },
            ]}
            defaultItems={LIST_DEFAULTS.research_projects}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
