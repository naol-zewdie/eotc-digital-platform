'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, KeyRound, Mail, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@eotc-platform.org');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    {
      role: 'Super Administrator',
      email: 'admin@eotc-platform.org',
      pass: 'Admin@123456',
      badge: 'Unrestricted / 2FA',
    },
    {
      role: 'Church Representative (Debre Libanos)',
      email: 'rep.debrelibanos@eotc-platform.org',
      pass: 'ChurchRep@2026',
      badge: 'Scoped to Debre Libanos',
    },
    {
      role: 'Editor',
      email: 'editor@eotc-platform.org',
      pass: 'Editor@2026',
      badge: 'Library & Articles Drafts',
    },
    {
      role: 'Moderator / Reviewer',
      email: 'reviewer@eotc-platform.org',
      pass: 'Reviewer@2026',
      badge: 'Approval & Publication Gate',
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In browser, save active role for frontend state & call API
      const res = await fetch('http://localhost:4000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        // Even if local standalone mode, allow preset logins
        const matchingDemo = demoAccounts.find((d) => d.email === email);
        if (matchingDemo) {
          localStorage.setItem('eotc_admin_user', JSON.stringify({
            email: matchingDemo.email,
            displayName: matchingDemo.role,
            role: matchingDemo.role.includes('Super')
              ? 'SUPER_ADMINISTRATOR'
              : matchingDemo.role.includes('Representative')
              ? 'CHURCH_REPRESENTATIVE'
              : matchingDemo.role.includes('Moderator')
              ? 'MODERATOR'
              : 'EDITOR',
            churchMemberships: matchingDemo.role.includes('Representative')
              ? [{ churchId: 'debre-libanos', churchSlug: 'debre-libanos', status: 'ACTIVE' }]
              : [],
          }));
          router.push('/admin');
          return;
        }
        throw new Error(errorData.error?.message || 'Authentication failed');
      }

      const data = await res.json();
      localStorage.setItem('eotc_admin_user', JSON.stringify(data.user));
      router.push('/admin');
    } catch (err) {
      // Fallback for offline API demonstration
      const matchingDemo = demoAccounts.find((d) => d.email === email);
      if (matchingDemo) {
        localStorage.setItem('eotc_admin_user', JSON.stringify({
          email: matchingDemo.email,
          displayName: matchingDemo.role,
          role: matchingDemo.role.includes('Super')
            ? 'SUPER_ADMINISTRATOR'
            : matchingDemo.role.includes('Representative')
            ? 'CHURCH_REPRESENTATIVE'
            : matchingDemo.role.includes('Moderator')
            ? 'MODERATOR'
            : 'EDITOR',
          churchMemberships: matchingDemo.role.includes('Representative')
            ? [{ churchId: 'debre-libanos', churchSlug: 'debre-libanos', status: 'ACTIVE' }]
            : [],
        }));
        router.push('/admin');
      } else {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  const selectDemo = (demo: typeof demoAccounts[0]) => {
    setEmail(demo.email);
    setPassword(demo.pass);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/am" className="inline-flex items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-eotc-crimson border border-eotc-gold/40 flex items-center justify-center text-eotc-gold text-2xl shadow-lg">
            ✝
          </div>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white heading-font">
          EOTC Administrative Console
        </h2>
        <p className="text-xs text-neutral-400">
          Role-Based Access Control & Church Scoped Authorization
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-neutral-900/90 border border-neutral-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-xs text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                Ecclesiastical Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm focus:outline-none focus:border-eotc-gold text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm focus:outline-none focus:border-eotc-gold text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-eotc-crimson hover:bg-eotc-crimson-light text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Console'}</span>
            </button>
          </form>

          {/* Quick Demo Role Presets */}
          <div className="pt-4 border-t border-neutral-800 space-y-3">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Quick Role Switcher (Preset Test Accounts):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {demoAccounts.map((d, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectDemo(d)}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                    email === d.email
                      ? 'border-eotc-gold bg-eotc-gold/10 text-white'
                      : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="font-semibold text-neutral-200">{d.role}</div>
                  <div className="text-[10px] text-eotc-gold mt-0.5">{d.badge}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
