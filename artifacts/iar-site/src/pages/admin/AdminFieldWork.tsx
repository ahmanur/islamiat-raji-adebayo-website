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
          Manage field work projects shown on the Field Work page. These are independent from the Research Projects — changes here only affect the Field Work page.
        </p>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-1">Field Work Projects</h2>
          <p className="text-slate-500 text-xs mb-4">Upload a photo for each project. Ideally 4:3 landscape orientation.</p>
          <ListEditor
            listKey="field_work_projects"
            itemLabel="Project"
            fields={[
              {
                key: 'image',
                label: 'Project Image',
                type: 'image',
                imageFallback: '/images/field-fruit.png',
                imageHint: 'Field photo for this project. Ideally 4:3 landscape orientation.',
              },
              { key: 'status', label: 'Status', placeholder: 'Active Fieldwork / Past Fieldwork / Doctoral Fieldwork' },
              { key: 'title', label: 'Project Title', placeholder: 'Frugivore & Fig Tree Surveys — KwaZulu-Natal' },
              { key: 'location', label: 'Location', placeholder: 'Durban, South Africa' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'methods', label: 'Methods (comma-separated)', placeholder: 'Focal-tree watches, Transect surveys' },
              {
                key: 'gallery',
                label: 'Additional Photos',
                type: 'gallery',
                imageHint: 'Upload extra field photos shown in the gallery on the detail page.',
              },
              {
                key: 'map_image',
                label: 'Map / Site Photo',
                type: 'image',
                imageHint: 'A map, satellite image, or field site overview photo.',
              },
              { key: 'map_link', label: 'Google Maps Link (optional)', type: 'url', placeholder: 'https://maps.google.com/…' },
              { key: 'collaborators', label: 'Collaborators (one per line)', type: 'textarea', placeholder: 'Dr. Jane Smith — Cornell University\nProf. Kwame Osei — University of Ghana' },
            ]}
            defaultItems={LIST_DEFAULTS.field_work_projects}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
