import React from 'react';
import { Link } from 'wouter';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminAuth } from '@/lib/adminAuth';

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

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="text-slate-400 text-sm mt-1">{user?.email} · Dr. Islamiat Raji-Adebayo Website CMS</p>
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

        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-white font-medium text-sm mb-3">Quick Setup</h2>
          <div className="text-slate-400 text-sm space-y-2">
            <p>To get started, run the following SQL in your <strong className="text-slate-300">Supabase SQL Editor</strong> to create the required tables:</p>
            <div className="bg-slate-950 rounded-lg p-4 text-xs font-mono text-green-400 overflow-x-auto mt-3">
              <pre>{`-- CMS content key-value store
CREATE TABLE IF NOT EXISTS cms_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  section text NOT NULL,
  key text NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section, key)
);

-- CMS list items (projects, publications, news, etc.)
CREATE TABLE IF NOT EXISTS cms_lists (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  list_key text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  data jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_lists ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access
CREATE POLICY "Auth full access content"
  ON cms_content FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Auth full access lists"
  ON cms_lists FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Allow public read access
CREATE POLICY "Public read content"
  ON cms_content FOR SELECT
  TO anon USING (true);

CREATE POLICY "Public read lists"
  ON cms_lists FOR SELECT
  TO anon USING (true);`}</pre>
            </div>
            <p className="mt-3 text-slate-500">After running the SQL, you can use all editors above. You also need to create an admin user in <strong className="text-slate-400">Supabase → Authentication → Users</strong>.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
