import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { ListEditor } from '@/components/admin/ListEditor';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';

export function AdminFieldWork() {
  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">Field Work</h1>
          <p className="text-slate-400 text-sm mb-6">
            The Field Work page shows a hero image, then groups your photos by region.
            Add regions first, then add photos and tag each one with the region it belongs to.
          </p>
        </div>

        {/* Hero / page header */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">Page Header</h2>
          <p className="text-slate-500 text-xs mb-3">
            Background photo and optional intro text shown across the top of the page.
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <ContentEditor
              section="field_work_page"
              fields={[
                {
                  key: 'bg_image',
                  label: 'Header Background Image (optional)',
                  type: 'image',
                  imageHint: 'Optional wide landscape photo shown behind the title. Leave empty for the plain text-only header style.',
                },
                {
                  key: 'intro',
                  label: 'Intro Paragraph',
                  type: 'textarea',
                  placeholder: 'Short paragraph introducing your fieldwork.',
                },
              ]}
              defaults={CONTENT_DEFAULTS.field_work_page}
            />
          </div>
        </div>

        {/* Regions */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">Regions</h2>
          <p className="text-slate-500 text-xs mb-3">
            The Field Work page is organised into regions (e.g. "Southern Africa — KwaZulu-Natal").
            Each region appears with its title, a short description, and any photos tagged with it.
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <ListEditor
              listKey="field_work_regions"
              itemLabel="Region"
              fields={[
                { key: 'title', label: 'Region Title', placeholder: 'Southern Africa — KwaZulu-Natal' },
                { key: 'description', label: 'Region Description', type: 'textarea', placeholder: 'Short paragraph describing fieldwork in this region.' },
              ]}
              defaultItems={LIST_DEFAULTS.field_work_regions}
            />
          </div>
        </div>

        {/* Photos */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">Photos</h2>
          <p className="text-slate-500 text-xs mb-3">
            Upload photos and tag each one with a region. The "Region" must match a region
            title above exactly. Photos with no matching region appear under "More from the Field".
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <ListEditor
              listKey="field_work_gallery"
              itemLabel="Photo"
              fields={[
                {
                  key: 'region',
                  label: 'Region (must match a region title above)',
                  placeholder: 'Southern Africa — KwaZulu-Natal',
                },
                {
                  key: 'image',
                  label: 'Photo',
                  type: 'image',
                  imageHint: 'Upload a field photo. Any orientation works.',
                },
                {
                  key: 'caption',
                  label: 'Caption',
                  type: 'textarea',
                  placeholder: 'Short description of the photo.',
                },
              ]}
              defaultItems={LIST_DEFAULTS.field_work_gallery}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
