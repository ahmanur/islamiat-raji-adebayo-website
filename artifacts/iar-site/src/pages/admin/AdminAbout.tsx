import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { ListEditor } from '@/components/admin/ListEditor';

export function AdminAbout() {
  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">About Section</h1>
          <p className="text-slate-400 text-sm">Edit biography text and sidebar entries.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-4">Biography</h2>
          <ContentEditor
            section="about"
            fields={[
              { key: 'tagline', label: 'Opening Tagline', type: 'textarea', placeholder: 'My research spans landscape and urban ecology…' },
              { key: 'para1', label: 'Paragraph 1', type: 'textarea' },
              { key: 'para2', label: 'Paragraph 2 (Cornell)', type: 'textarea' },
              { key: 'para3', label: 'Paragraph 3 (Queen\'s / KZN)', type: 'textarea' },
              { key: 'para4', label: 'Paragraph 4 (Mentorship / values)', type: 'textarea' },
            ]}
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-4">Education</h2>
          <ListEditor
            listKey="education"
            itemLabel="Degree"
            fields={[
              { key: 'degree', label: 'Degree', placeholder: 'PhD Ecological Sciences' },
              { key: 'institution', label: 'Institution & Year', placeholder: 'University of KwaZulu-Natal, 2021' },
            ]}
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-4">Awards & Honours</h2>
          <ListEditor
            listKey="awards"
            itemLabel="Award"
            fields={[
              { key: 'title', label: 'Award Title', placeholder: 'Falling Walls Female Science Talent' },
              { key: 'year', label: 'Year', placeholder: '2024' },
            ]}
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-4">Affiliations & Memberships</h2>
          <ListEditor
            listKey="affiliations"
            itemLabel="Affiliation"
            fields={[
              { key: 'name', label: 'Organization Name', placeholder: 'British Ecological Society' },
            ]}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
