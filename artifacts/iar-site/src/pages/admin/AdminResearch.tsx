import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { ListEditor } from '@/components/admin/ListEditor';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';

export function AdminResearch() {
  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">Research</h1>
          <p className="text-slate-400 text-sm">Edit the research intro, themes, and projects.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-4">Section Introduction</h2>
          <ContentEditor
            section="research"
            fields={[
              { key: 'intro', label: 'Introduction Paragraph', type: 'textarea' },
              { key: 'theme1_title', label: 'Theme 1 Title', placeholder: 'Bioacoustics' },
              { key: 'theme1_desc', label: 'Theme 1 Description', type: 'textarea' },
              { key: 'theme2_title', label: 'Theme 2 Title', placeholder: 'Urban Ecology' },
              { key: 'theme2_desc', label: 'Theme 2 Description', type: 'textarea' },
              { key: 'theme3_title', label: 'Theme 3 Title', placeholder: 'Human-Nature Dynamics' },
              { key: 'theme3_desc', label: 'Theme 3 Description', type: 'textarea' },
            ]}
            defaults={CONTENT_DEFAULTS.research}
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-4">Research Projects</h2>
          <p className="text-slate-500 text-xs mb-4">First item appears as the current project.</p>
          <ListEditor
            listKey="research_projects"
            itemLabel="Project"
            fields={[
              { key: 'status', label: 'Status', placeholder: 'Current Project / Past Project / Doctoral Research' },
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
