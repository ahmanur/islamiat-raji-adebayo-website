import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { ListEditor } from '@/components/admin/ListEditor';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';

export function AdminOpportunities() {
  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">Opportunities</h1>
          <p className="text-slate-400 text-sm">Edit the opportunities page content, listings, and the Resources directory.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-4">Page Introduction</h2>
          <ContentEditor
            section="opportunities"
            fields={[
              { key: 'intro', label: 'Introduction', type: 'textarea' },
              { key: 'contact_cta', label: 'Contact Call-to-Action', type: 'textarea' },
            ]}
            defaults={CONTENT_DEFAULTS.opportunities}
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-4">Open Positions / Listings</h2>
          <ListEditor
            listKey="opportunities_list"
            itemLabel="Opportunity"
            fields={[
              { key: 'title', label: 'Position Title', placeholder: 'MSc / PhD Opportunity' },
              { key: 'type', label: 'Type', placeholder: 'Graduate / Postdoc / Volunteer' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'deadline', label: 'Deadline', placeholder: 'Rolling / December 2025' },
              { key: 'url', label: 'Application URL (optional)', type: 'url' },
            ]}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-1">Resources Section</h2>
          <p className="text-slate-500 text-xs mb-3">
            A directory of scholarships, internships, fellowships, research grants and recruitment
            opportunities for undergraduates, graduate students, postdocs and collaborators. Visitors
            can filter by audience.
          </p>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h3 className="text-white font-medium text-sm mb-3">Section Header</h3>
              <ContentEditor
                section={'resources_section' as any}
                fields={[
                  { key: 'title', label: 'Section Title', placeholder: 'Resources' },
                  { key: 'intro', label: 'Section Intro', type: 'textarea' },
                ]}
                defaults={CONTENT_DEFAULTS.resources_section}
              />
            </div>

            <div>
              <h3 className="text-white font-medium text-sm mb-3">Resource Entries</h3>
              <ListEditor
                listKey="resources"
                itemLabel="Resource"
                defaultItems={LIST_DEFAULTS.resources as Array<Record<string, string>>}
                fields={[
                  {
                    key: 'audience',
                    label: 'Audience',
                    type: 'select',
                    options: ['Undergraduate', 'Graduate', 'Postgraduate', 'Collaborators'],
                  },
                  {
                    key: 'category',
                    label: 'Category',
                    type: 'select',
                    options: ['Scholarship', 'Fellowship', 'Internship', 'Research Grant', 'Recruitment', 'Other'],
                  },
                  { key: 'title', label: 'Title', placeholder: 'NSF Graduate Research Fellowship Program' },
                  { key: 'organization', label: 'Organisation / Provider', placeholder: 'U.S. National Science Foundation' },
                  { key: 'description', label: 'Description', type: 'textarea' },
                  { key: 'deadline', label: 'Deadline', placeholder: 'October (annual) / Rolling' },
                  { key: 'url', label: 'Resource URL', type: 'url', placeholder: 'https://…' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
