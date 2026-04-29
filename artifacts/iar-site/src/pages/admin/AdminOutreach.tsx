import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';

export function AdminOutreach() {
  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <h1 className="text-xl font-semibold text-white mb-1">Outreach & Contact</h1>
        <p className="text-slate-400 text-sm mb-6">Edit contact details and outreach section text.</p>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <ContentEditor
            section="outreach"
            fields={[
              { key: 'email', label: 'Email Address', placeholder: 'iar32@cornell.edu' },
              { key: 'institution', label: 'Institution', placeholder: 'K. Lisa Yang Center…' },
              { key: 'location', label: 'Location', placeholder: 'Ithaca, NY, USA' },
              { key: 'intro', label: 'Outreach Intro Text', type: 'textarea' },
              { key: 'community_text', label: 'Community Science Text', type: 'textarea' },
              { key: 'linkedin', label: 'LinkedIn URL', type: 'url', placeholder: 'https://www.linkedin.com/in/…' },
              { key: 'researchgate', label: 'ResearchGate URL', type: 'url', placeholder: 'https://www.researchgate.net/…' },
              { key: 'google_scholar', label: 'Google Scholar URL', type: 'url', placeholder: 'https://scholar.google.com/…' },
            ]}
            defaults={{
              email: 'iar32@cornell.edu',
              institution: 'K. Lisa Yang Center for Conservation Bioacoustics, Cornell Lab of Ornithology',
              location: 'Ithaca, NY, USA',
              linkedin: 'https://www.linkedin.com/in/islamiat-raji-adebayo-ph-d-21931387/',
            }}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
