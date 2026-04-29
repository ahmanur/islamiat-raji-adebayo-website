import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { useAdminAuth } from '@/lib/adminAuth';

export function AdminSettings() {
  const { user } = useAdminAuth();
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(''); setError('');
    if (newPw !== confirmPw) { setError('Passwords do not match.'); return; }
    if (newPw.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setSaving(false);
    if (error) setError(error.message);
    else { setMsg('Password updated successfully.'); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }
  };

  return (
    <AdminLayout>
      <div className="max-w-lg">
        <h1 className="text-xl font-semibold text-white mb-1">Settings</h1>
        <p className="text-slate-400 text-sm mb-6">Manage your admin account.</p>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Logged in as</div>
            <div className="text-white text-sm">{user?.email}</div>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <h2 className="text-white font-medium text-sm mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}
              {msg && <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-green-400 text-sm">{msg}</div>}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
                <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required minLength={8}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm New Password</label>
                <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <button type="submit" disabled={saving}
                className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
                {saving ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <h2 className="text-white font-medium text-sm mb-3">Supabase Setup</h2>
            <p className="text-slate-400 text-sm">To create additional admin users, go to your <strong className="text-slate-300">Supabase Dashboard → Authentication → Users</strong> and invite a new user by email.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
