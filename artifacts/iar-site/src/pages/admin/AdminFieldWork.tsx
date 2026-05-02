import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ListEditor } from '@/components/admin/ListEditor';
import { LIST_DEFAULTS } from '@/lib/cmsDefaults';

export function AdminFieldWork() {
  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <h1 className="text-xl font-semibold text-white mb-1">Field Work Gallery</h1>
        <p className="text-slate-400 text-sm mb-6">
          Upload photos from the field. Each photo can have a short caption that appears
          beneath it on the public Field Work page. Click a photo on the public page opens
          it in a full-screen view.
        </p>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-1">Photos</h2>
          <p className="text-slate-500 text-xs mb-4">
            Add as many photos as you like. They appear on the page in the order shown here.
          </p>
          <ListEditor
            listKey="field_work_gallery"
            itemLabel="Photo"
            fields={[
              {
                key: 'image',
                label: 'Photo',
                type: 'image',
                imageHint: 'Upload a field photo. Any orientation works — the gallery adapts.',
              },
              {
                key: 'caption',
                label: 'Caption',
                type: 'textarea',
                placeholder: 'Short description of when, where, and what is happening in the photo.',
              },
            ]}
            defaultItems={LIST_DEFAULTS.field_work_gallery}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
