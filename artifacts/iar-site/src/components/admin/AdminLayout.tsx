import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAdminAuth } from '@/lib/adminAuth';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '⊞' },
  { href: '/admin/hero', label: 'Hero', icon: '🏠' },
  { href: '/admin/about', label: 'About', icon: '👤' },
  { href: '/admin/research', label: 'Research', icon: '🔬' },
  { href: '/admin/publications', label: 'Publications', icon: '📄' },
  { href: '/admin/fieldwork', label: 'Field Work', icon: '🌿' },
  { href: '/admin/news', label: 'News', icon: '📰' },
  { href: '/admin/mentorship', label: 'People', icon: '🎓' },
  { href: '/admin/teaching', label: 'Teaching', icon: '📚' },
  { href: '/admin/contact-info', label: 'Contact Info', icon: '✉️' },
  { href: '/admin/outreach', label: 'Outreach', icon: '📣' },
  { href: '/admin/opportunities', label: 'Opportunities', icon: '✨' },
  { href: '/admin/media', label: 'Media', icon: '🖼' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙' },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, signOut } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-14'} transition-all duration-200 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col`}>
        <div className="h-14 flex items-center px-4 border-b border-slate-800 gap-3">
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {sidebarOpen && <span className="text-white font-semibold text-sm truncate">CMS Admin</span>}
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map(item => {
            const active = item.href === '/admin' ? location === '/admin' : location.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <a className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors ${active ? 'bg-primary/20 text-primary' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          {sidebarOpen && (
            <div className="text-xs text-slate-500 truncate mb-2 px-2">{user?.email}</div>
          )}
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
          <div className="text-white font-medium text-sm">
            {navItems.find(n => n.href === '/admin' ? location === '/admin' : location.startsWith(n.href))?.label ?? 'Admin'}
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Site
          </a>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
