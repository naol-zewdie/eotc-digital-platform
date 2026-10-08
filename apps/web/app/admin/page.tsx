'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Church,
  BookOpen,
  Layers,
  History,
  CheckCircle2,
  XCircle,
  Activity,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>({
    role: 'SUPER_ADMINISTRATOR',
    displayName: 'Patriarchate Administrator',
    email: 'admin@eotc-platform.org',
    churchMemberships: [{ churchSlug: 'debre-libanos', status: 'ACTIVE' }],
  });

  const [testChurchSlug, setTestChurchSlug] = useState('debre-libanos');
  const [scopeTestResult, setScopeTestResult] = useState<{
    allowed: boolean;
    reason: string;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('eotc_admin_user');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Run church scope test based on active user
  const runScopeTest = (targetChurch: string) => {
    if (
      currentUser.role === 'SUPER_ADMINISTRATOR' ||
      currentUser.role === 'ADMINISTRATOR'
    ) {
      setScopeTestResult({
        allowed: true,
        reason: `ALLOW: User is '${currentUser.role}' with global parish administrative jurisdiction.`,
      });
      return;
    }

    if (currentUser.role === 'CHURCH_REPRESENTATIVE') {
      const isAssigned = (currentUser.churchMemberships || []).some(
        (m: any) => m.churchSlug === targetChurch && m.status === 'ACTIVE',
      );
      if (isAssigned) {
        setScopeTestResult({
          allowed: true,
          reason: `ALLOW: User has an active verified representative assignment for church '${targetChurch}'.`,
        });
      } else {
        setScopeTestResult({
          allowed: false,
          reason: `DENIED (SCOPE_UNAUTHORIZED): User is CHURCH_REPRESENTATIVE, but NOT assigned to church '${targetChurch}'. Write operations blocked per Section 3.`,
        });
      }
      return;
    }

    setScopeTestResult({
      allowed: false,
      reason: `DENIED (FORBIDDEN): Role '${currentUser.role}' cannot perform church-scoped modifications.`,
    });
  };

  useEffect(() => {
    runScopeTest(testChurchSlug);
  }, [currentUser, testChurchSlug]);

  return (
    <div className="p-6 md:p-10 space-y-8 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-eotc-gold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Identity, Sessions & RBAC Console (Sprint 2)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white heading-font">
            Content Governance & Access Control
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Active session: <span className="text-white font-semibold">{currentUser.displayName}</span> ({currentUser.email})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/audit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-white border border-neutral-800 transition-colors"
          >
            <History className="w-4 h-4 text-eotc-gold" />
            <span>Audit Trail</span>
          </Link>
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-neutral-900 border border-neutral-800 text-eotc-gold">
            Role: {currentUser.role}
          </span>
        </div>
      </div>

      {/* Interactive Church Scope Validation Tester (Section 3 Requirement) */}
      <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Church className="w-5 h-5 text-emerald-400" />
              <span>Church Representative Scope Verification Tester</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Testing requirement from Section 3: "A CHURCH_REPRESENTATIVE role alone is insufficient: every write request must verify that the user is assigned to the target church."
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Select Target Church to Test Write Request:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTestChurchSlug('debre-libanos')}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition-colors ${
                  testChurchSlug === 'debre-libanos'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                }`}
              >
                <div>ደብረ ሊባኖስ ገዳም</div>
                <div className="text-[10px] text-neutral-500">debre-libanos</div>
              </button>
              <button
                onClick={() => setTestChurchSlug('axum-tsion')}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition-colors ${
                  testChurchSlug === 'axum-tsion'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                }`}
              >
                <div>አክሱም ጽዮን ማርያም</div>
                <div className="text-[10px] text-neutral-500">axum-tsion</div>
              </button>
            </div>
            <div className="text-[11px] text-neutral-500">
              Tip: Switch current role to <strong>Church Rep (Debre Libanos)</strong> in the left sidebar to test scope isolation.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Scope Verification Engine Output:
            </div>
            {scopeTestResult && (
              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  scopeTestResult.allowed
                    ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300'
                    : 'bg-red-950/30 border-red-800/80 text-red-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {scopeTestResult.allowed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                  <span>{scopeTestResult.allowed ? 'AUTHORIZATION GRANTED' : 'AUTHORIZATION REJECTED'}</span>
                </div>
                <div className="text-xs font-mono leading-relaxed">
                  {scopeTestResult.reason}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Role Hierarchy Matrix */}
      <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-eotc-gold flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>RBAC Stakeholders & Capabilities Matrix (Section 3)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="font-bold text-white flex items-center justify-between">
              <span>Super Administrator</span>
              <span className="text-[10px] text-amber-400 font-mono">2FA Required</span>
            </div>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              Restricted emergency & global authority. Complete rights across all domains, system configurations, and user assignments.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="font-bold text-white flex items-center justify-between">
              <span>Moderator / Reviewer</span>
              <span className="text-[10px] text-purple-400 font-mono">Editorial Gate</span>
            </div>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              Review submissions, rights and provenance issues, doctrinal reports, and execute publication readiness approvals.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="font-bold text-white flex items-center justify-between">
              <span>Church Representative</span>
              <span className="text-[10px] text-emerald-400 font-mono">Scoped Write</span>
            </div>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              Manage only assigned church profile, local parish events, media and announcements. Strictly scoped by church ID.
            </p>
          </div>
        </div>
      </div>

      {/* Observability & Health Indicator */}
      <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-xs font-bold text-white">NestJS API & Identity Micro-service</div>
            <div className="text-[11px] text-neutral-400">
              Authentication endpoints active under <code className="text-eotc-gold">/api/v1/auth</code>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href="http://localhost:4000/api/v1/health"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white border border-neutral-700 transition-colors"
          >
            Check API Health
          </a>
          <Link
            href="/admin/login"
            className="px-3 py-1.5 rounded-xl bg-eotc-crimson hover:bg-eotc-crimson-light text-xs font-semibold text-white transition-colors"
          >
            Login View
          </Link>
        </div>
      </div>
    </div>
  );
}
