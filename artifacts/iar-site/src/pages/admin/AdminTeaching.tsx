import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { ListEditor } from '@/components/admin/ListEditor';
import { LIST_DEFAULTS } from '@/lib/cmsDefaults';

export function AdminTeaching() {
  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">Teaching</h1>
          <p className="text-slate-400 text-sm">Manage current and past courses. Each course shows on the public Teaching page with a photo, role, description, and optional syllabus link.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-4">Page Introduction</h2>
          <ContentEditor
            section="teaching"
            fields={[
              { key: 'intro', label: 'Intro Paragraph', type: 'textarea', placeholder: 'Describe your teaching philosophy…' },
            ]}
            defaults={{ intro: '' }}
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-1">Courses</h2>
          <p className="text-slate-500 text-xs mb-4">
            Set <strong className="text-slate-300">Status</strong> to <em>Current</em> or <em>Past</em> — they will automatically group on the public page.
          </p>
          <ListEditor
            listKey="teaching_courses"
            itemLabel="Course"
            addAtTop
            fields={[
              {
                key: 'image',
                label: 'Course Photo',
                type: 'image',
                imageFallback: '/images/spectrogram-art.png',
                imageHint: 'A representative photo for this course.',
              },
              {
                key: 'status',
                label: 'Status',
                type: 'select',
                options: ['Current', 'Past'],
              },
              { key: 'title', label: 'Course Title', placeholder: 'Urban Ecology and Biodiversity' },
              { key: 'code', label: 'Course Code (optional)', placeholder: 'NTRES 4850' },
              { key: 'institution', label: 'Institution', placeholder: 'Cornell University' },
              { key: 'semester', label: 'Semester / Year', placeholder: 'Spring 2025' },
              { key: 'role', label: 'Your Role', placeholder: 'Instructor of Record' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'syllabus_url', label: 'Syllabus URL (optional)', type: 'url', placeholder: 'https://…' },
            ]}
            defaultItems={LIST_DEFAULTS.teaching_courses}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
