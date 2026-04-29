import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { CONTENT_DEFAULTS } from '@/lib/cmsDefaults';

export function AdminHero() {
  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <h1 className="text-xl font-semibold text-white mb-1">Hero Section</h1>
        <p className="text-slate-400 text-sm mb-6">Edit the homepage hero text, institution, and button labels.</p>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <ContentEditor
            section="hero"
            fields={[
              { key: 'badge', label: 'Badge Text' },
              { key: 'headline', label: 'Headline' },
              { key: 'headline_accent', label: 'Headline Accent (italic)' },
              { key: 'tagline', label: 'Tagline / Subtitle', type: 'textarea' },
              { key: 'btn_primary', label: 'Primary Button Text' },
              { key: 'btn_secondary', label: 'Secondary Button Text' },
              { key: 'institution', label: 'Institution Line' },
            ]}
            defaults={CONTENT_DEFAULTS.hero}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
