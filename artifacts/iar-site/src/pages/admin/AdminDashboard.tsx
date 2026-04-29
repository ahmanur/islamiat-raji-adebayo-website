import React, { useState } from 'react';
import { Link } from 'wouter';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminAuth } from '@/lib/adminAuth';
import { seedAllDefaults } from '@/lib/cms';

const sections = [
  { href: '/admin/hero', label: 'Hero Section', desc: 'Edit headline, tagline, background, portrait', icon: '🏠' },
  { href: '/admin/about', label: 'About', desc: 'Bio, education, awards, affiliations', icon: '👤' },
  { href: '/admin/research', label: 'Research', desc: 'Research projects and descriptions', icon: '🔬' },
  { href: '/admin/publications', label: 'Publications', desc: 'Add and edit publications', icon: '📄' },
  { href: '/admin/news', label: 'News & Updates', desc: 'Timeline of news and milestones', icon: '📰' },
  { href: '/admin/mentorship', label: 'Mentorship', desc: 'Mentorship description and roles', icon: '🎓' },
  { href: '/admin/outreach', label: 'Outreach / Contact', desc: 'Contact info and outreach text', icon: '🌍' },
  { href: '/admin/opportunities', label: 'Opportunities', desc: 'Open positions and application info', icon: '✨' },
  { href: '/admin/media', label: 'Media Manager', desc: 'Upload and manage images', icon: '🖼' },
  { href: '/admin/settings', label: 'Settings', desc: 'Account and site settings', icon: '⚙' },
];

export function AdminDashboard() {
  const { user } = useAdminAuth();
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);
  const [seedError, setSeedError] = useState('');

  const handleSeed = async () => {
    if (!confirm('This will populate all CMS fields with the existing website content. List items (education, publications, etc.) are only seeded if they are currently empty. Content fields will be overwritten with defaults. Continue?')) return;
    setSeeding(true);
    setSeedError('');
    try {
      await seedAllDefaults();
      setSeedDone(true);
      setTimeout(() => setSeedDone(false), 4000);
    } catch (e: unknown) {
      setSeedError(e instanceof Error ? e.message : 'Unknown error');
    }
    setSeeding(false);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="text-slate-400 text-sm mt-1">{user?.email} · Dr. Islamiat Raji-Adebayo Website CMS</p>
        </div>

        <div className="bg-slate-900 border border-primary/20 rounded-xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-white font-medium text-sm mb-1">Load Default Content</div>
            <div className="text-slate-400 text-xs leading-relaxed max-w-md">
              Populate all CMS fields with the existing website content so you can start editing immediately. List items are only seeded if the list is currently empty.
            </div>
            {seedError && <div className="text-red-400 text-xs mt-2">{seedError}</div>}
          </div>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="shrink-0 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            {seeding ? 'Loading…' : seedDone ? '✓ Done!' : 'Seed Default Content'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map(s => (
            <Link key={s.href} href={s.href}>
              <a className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 hover:bg-slate-800/50 transition-all group block">
                <div className="text-2xl mb-3">{s.icon}</div>
                <div className="text-white font-medium text-sm group-hover:text-primary transition-colors">{s.label}</div>
                <div className="text-slate-500 text-xs mt-1">{s.desc}</div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
