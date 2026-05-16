import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { ListEditor } from '@/components/admin/ListEditor';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';

export function AdminOutreachEngagement() {
  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">Outreach</h1>
          <p className="text-slate-400 text-sm mb-6">
            Public engagement activities and science writing.
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <ContentEditor
              section="outreach_page"
              fields={[
                {
                key: 'bg_image',
                label: 'Section Background Image',
                type: 'image',
                imageHint: 'Optional full-width photo shown behind the Outreach header.',
              },
              { key: 'intro', label: 'Page Intro', type: 'textarea' },
                { key: 'subintro', label: 'Secondary Intro (optional)', type: 'textarea' },
                { key: 'engagement_text', label: 'Public Engagement Description', type: 'textarea' },
                { key: 'writing_text', label: 'Science Writing Description', type: 'textarea' },
              ]}
              defaults={CONTENT_DEFAULTS.outreach_page}
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-1">Public Engagement</h2>
          <p className="text-slate-400 text-sm mb-4">
            Talks, workshops, community events and citizen-science activities.
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <ListEditor
              listKey="outreach_engagement"
              itemLabel="Engagement Item"
              fields={[
                { key: 'title', label: 'Title', placeholder: 'Talk / event title' },
                { key: 'date', label: 'Date', placeholder: 'March 2025' },
                { key: 'venue', label: 'Venue / Location', placeholder: 'Cornell Lab of Ornithology' },
                { key: 'description', label: 'Description', type: 'textarea' },
                { key: 'url', label: 'Link (optional)', type: 'url', placeholder: 'https://…' },
                { key: 'image', label: 'Image (optional)', type: 'image', imageHint: 'Upload a related photo.' },
              ]}
              defaultItems={LIST_DEFAULTS.outreach_engagement}
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-1">Science Writing</h2>
          <p className="text-slate-400 text-sm mb-4">
            Articles, blog posts, op-eds and other published writing.
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <ListEditor
              listKey="science_writing"
              itemLabel="Writing Item"
              fields={[
                { key: 'title', label: 'Title', placeholder: 'Article title' },
                { key: 'publication', label: 'Publication', placeholder: 'The Conversation' },
                { key: 'date', label: 'Date', placeholder: '2024' },
                { key: 'description', label: 'Description / Excerpt', type: 'textarea' },
                { key: 'url', label: 'Link', type: 'url', placeholder: 'https://…' },
                { key: 'image', label: 'Featured Image (optional)', type: 'image', imageHint: 'Upload a cover photo for this article.' },
              ]}
              defaultItems={LIST_DEFAULTS.science_writing}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
