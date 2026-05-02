import React from 'react';
import { Link } from 'wouter';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminAuth } from '@/lib/adminAuth';

const sections = [
  { href: '/admin/hero', label: 'Hero Section', desc: 'Edit headline, tagline, background, portrait', icon: '🏠' },
  { href: '/admin/about', label: 'About', desc: 'Bio, education, awards, affiliations', icon: '👤' },
  { href: '/admin/research', label: 'Research', desc: 'Research projects and descriptions', icon: '🔬' },
  { href: '/admin/publications', label: 'Publications', desc: 'Add and edit publications', icon: '📄' },
  { href: '/admin/news', label: 'News & Updates', desc: 'Timeline of news entries shown on the News page', icon: '📰' },
  { href: '/admin/mentorship', label: 'People', desc: 'Mentorship description and roles', icon: '🎓' },
  { href: '/admin/contact-info', label: 'Contact Info', desc: 'Get in Touch section shown on the News page', icon: '✉️' },
  { href: '/admin/outreach', label: 'Outreach', desc: 'Public engagement and science writing on the Outreach page', icon: '📣' },
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
      </div>
    </AdminLayout>
  );
}
