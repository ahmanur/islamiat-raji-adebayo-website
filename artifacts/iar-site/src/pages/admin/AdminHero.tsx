import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';

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
              { key: 'badge', label: 'Badge Text', placeholder: 'Cornell Lab of Ornithology · Rose Postdoctoral Fellow' },
              { key: 'headline', label: 'Headline', placeholder: 'Listening to the' },
              { key: 'headline_accent', label: 'Headline Accent (italic)', placeholder: 'urban forest.' },
              { key: 'tagline', label: 'Tagline / Subtitle', type: 'textarea', placeholder: 'Advancing conservation through bioacoustics…' },
              { key: 'btn_primary', label: 'Primary Button Text', placeholder: 'Explore Research' },
              { key: 'btn_secondary', label: 'Secondary Button Text', placeholder: 'Get in Touch' },
              { key: 'institution', label: 'Institution Line', placeholder: 'K. Lisa Yang Center for Conservation Bioacoustics, Cornell Lab of Ornithology' },
            ]}
            defaults={{
              badge: 'Cornell Lab of Ornithology · Rose Postdoctoral Fellow',
              headline: 'Listening to the',
              headline_accent: 'urban forest.',
              tagline: 'Advancing conservation through bioacoustics and urban ecology. Studying how urbanization shapes bird communities and the relationship between people and nature.',
              btn_primary: 'Explore Research',
              btn_secondary: 'Get in Touch',
              institution: 'K. Lisa Yang Center for Conservation Bioacoustics, Cornell Lab of Ornithology',
            }}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
