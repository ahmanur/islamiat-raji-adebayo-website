import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ListEditor } from '@/components/admin/ListEditor';

export function AdminResearch() {
  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <h1 className="text-xl font-semibold text-white mb-1">Research Projects</h1>
        <p className="text-slate-400 text-sm mb-6">Add, edit, or remove research projects. First item appears as the current project.</p>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <ListEditor
            listKey="research_projects"
            itemLabel="Project"
            fields={[
              { key: 'status', label: 'Status', placeholder: 'Current Project / Past Project / Doctoral Research' },
              { key: 'title', label: 'Project Title', placeholder: 'Urban Campus Soundscape Project' },
              { key: 'location', label: 'Location / Institution', placeholder: 'Cornell University, Ithaca NY' },
              { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the project…' },
              { key: 'methods', label: 'Methods (comma-separated)', placeholder: 'Autonomous acoustic recorders, Community science' },
            ]}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
