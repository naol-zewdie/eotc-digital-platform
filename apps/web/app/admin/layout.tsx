'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield,
  LayoutDashboard,
  BookOpen,
  Church,
  FileText,
  Music,
  Calendar,
  Activity,
  History,
  LogOut,
  ChevronRight,
  UserCheck,
  UploadCloud,
  Images,
  ShieldCheck,
  Heart,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<{
    displayName: string;
    email: string;
    role: string;
    churchMemberships?: Array<{ churchSlug: string; status: string }>;
  }>({
    displayName: 'EOTC Patriarchate Administrator',
    email: 'admin@eotc-platform.org',
    role: 'SUPER_ADMINISTRATOR',
    churchMemberships: [],
  });

  useEffect(() => {
    const saved = localStorage.getItem('eotc_admin_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const handleRoleSwitch = (newRole: string, churchSlug?: string) => {
    const updated = {
      displayName:
        newRole === 'SUPER_ADMINISTRATOR'
          ? 'Patriarchate Administrator'
          : newRole === 'CHURCH_REPRESENTATIVE'
          ? 'Debre Libanos Representative'
          : newRole === 'MODERATOR'
          ? 'Ecclesiastical Reviewer'
          : 'Theological Editor',
      email:
        newRole === 'SUPER_ADMINISTRATOR'
          ? 'admin@eotc-platform.org'
          : newRole === 'CHURCH_REPRESENTATIVE'
          ? 'rep.debrelibanos@eotc-platform.org'
          : newRole === 'MODERATOR'
          ? 'reviewer@eotc-platform.org'
          : 'editor@eotc-platform.org',
      role: newRole,
      churchMemberships:
        newRole === 'CHURCH_REPRESENTATIVE'
          ? [{ churchSlug: churchSlug || 'debre-libanos', status: 'ACTIVE' }]
          : [],
    };
    setUser(updated);
    localStorage.setItem('eotc_admin_user', JSON.stringify(updated));
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:4000/api/v1/auth/logout', { method: 'POST' });
    } catch {}
    localStorage.removeItem('eotc_admin_user');
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { href: '/admin', label: 'Console Overview', icon: LayoutDashboard },
    { href: '/admin/library', label: 'Library & Books', icon: BookOpen },
    { href: '/admin/churches', label: 'Churches & Monasteries', icon: Church },
    { href: '/admin/mezmur', label: 'Mezmur & Hymns', icon: Music },
    { href: '/admin/editorial', label: 'Editorial & News', icon: FileText },
    { href: '/admin/events', label: 'Calendar & Feasts', icon: Calendar },
    { href: '/admin/media', label: 'Media & Uploads', icon: UploadCloud },
    { href: '/admin/galleries', label: 'Sacred Galleries', icon: Images },
    { href: '/admin/rights', label: 'Rights & Provenance', icon: ShieldCheck },
    { href: '/admin/donations', label: 'Donations & Campaigns', icon: Heart },
    { href: '/admin/moderation', label: 'Diocesan Moderation Desk', icon: UserCheck },
    { href: '/admin/audit', label: 'Audit Trail (Section 27)', icon: History },
    { href: '/admin/operations', label: 'Operations & Telemetry', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-neutral-800 bg-neutral-900/50 flex flex-col justify-between p-4 shrink-0">
        <div className="space-y-6">
          <Link href="/am" className="flex items-center gap-3 px-2 py-2 group">
            <div className="w-9 h-9 rounded-lg bg-eotc-crimson border border-eotc-gold/40 flex items-center justify-center text-eotc-gold text-lg">
              ✝
            </div>
            <div>
              <div className="font-bold text-sm text-white">EOTC Platform</div>
              <div className="text-[10px] text-eotc-gold font-medium">Administration Shell</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-eotc-crimson text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Live RBAC Role Switcher */}
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
              <span>Simulate Role:</span>
              <UserCheck className="w-3.5 h-3.5 text-eotc-gold" />
            </div>
            <div className="grid grid-cols-1 gap-1.5 text-[11px]">
              <button
                onClick={() => handleRoleSwitch('SUPER_ADMINISTRATOR')}
                className={`px-2 py-1.5 rounded-lg text-left transition-colors ${
                  user.role === 'SUPER_ADMINISTRATOR'
                    ? 'bg-amber-950/80 text-amber-300 font-bold border border-amber-800/80'
                    : 'text-neutral-400 hover:bg-neutral-900'
                }`}
              >
                Super Admin (Global)
              </button>
              <button
                onClick={() => handleRoleSwitch('CHURCH_REPRESENTATIVE', 'debre-libanos')}
                className={`px-2 py-1.5 rounded-lg text-left transition-colors ${
                  user.role === 'CHURCH_REPRESENTATIVE'
                    ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-800/80'
                    : 'text-neutral-400 hover:bg-neutral-900'
                }`}
              >
                Church Rep (Debre Libanos)
              </button>
              <button
                onClick={() => handleRoleSwitch('EDITOR')}
                className={`px-2 py-1.5 rounded-lg text-left transition-colors ${
                  user.role === 'EDITOR'
                    ? 'bg-blue-950/80 text-blue-300 font-bold border border-blue-800/80'
                    : 'text-neutral-400 hover:bg-neutral-900'
                }`}
              >
                Editor (Draft Only)
              </button>
              <button
                onClick={() => handleRoleSwitch('MODERATOR')}
                className={`px-2 py-1.5 rounded-lg text-left transition-colors ${
                  user.role === 'MODERATOR'
                    ? 'bg-purple-950/80 text-purple-300 font-bold border border-purple-800/80'
                    : 'text-neutral-400 hover:bg-neutral-900'
                }`}
              >
                Moderator / Reviewer
              </button>
            </div>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-neutral-800 space-y-3">
          <div className="px-2">
            <div className="text-xs font-bold text-white truncate">{user.displayName}</div>
            <div className="text-[11px] text-neutral-400 truncate">{user.email}</div>
            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-eotc-gold border border-neutral-700">
                {user.role}
              </span>
              {user.churchMemberships && user.churchMemberships.length > 0 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {user.churchMemberships[0].churchSlug}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
