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
          <h1 className="text-xl font-semibold text-white mb-1">Teachings</h1>
          <p className="text-slate-400 text-sm">Edit the intro text, roles, and teaching/collaboration events with photos.</p>
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
          <h2 className="text-white font-medium text-sm mb-1">Roles / Opportunity Cards</h2>
          <p className="text-slate-500 text-xs mb-4">Shown as small cards on the Teachings page.</p>
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

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-1">Teaching & Collaboration Events</h2>
          <p className="text-slate-500 text-xs mb-4">
            Each event appears as a photo card on the public Teachings page. Upload a photo and add the event details.
          </p>
          <ListEditor
            listKey="teaching_events"
            itemLabel="Event"
            addAtTop
            fields={[
              {
                key: 'image',
                label: 'Event Photo',
                type: 'image',
                imageFallback: '/images/spectrogram-art.png',
                imageHint: 'Photo from the teaching or collaboration event.',
              },
              { key: 'title', label: 'Event Title', placeholder: 'Field Ornithology Workshop' },
              { key: 'date', label: 'Date / Year', placeholder: '2024' },
              { key: 'location', label: 'Location', placeholder: 'Ithaca, NY' },
              { key: 'description', label: 'Description', type: 'textarea' },
            ]}
            defaultItems={LIST_DEFAULTS.teaching_events}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
