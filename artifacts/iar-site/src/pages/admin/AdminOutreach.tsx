import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { CONTENT_DEFAULTS } from '@/lib/cmsDefaults';

export function AdminOutreach() {
  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <h1 className="text-xl font-semibold text-white mb-1">Contact Info</h1>
        <p className="text-slate-400 text-sm mb-6">
          Edits the "Get in Touch" section shown on the News page (and the contact details used in the footer).
          For the public Outreach page (Public Engagement & Science Writing), use the "Outreach" admin page instead.
        </p>
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
            defaults={CONTENT_DEFAULTS.outreach}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
