import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  BookOpen,
  Church,
  Music,
  FileCheck,
  Users,
  Activity,
  ArrowLeft,
  CheckCircle,
  Clock,
  Layers,
} from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-10 space-y-8 font-sans">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/am"
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl text-eotc-gold">✝</span>
              <h1 className="text-2xl font-bold tracking-tight text-white">EOTC Content & Governance Console</h1>
            </div>
            <p className="text-xs text-neutral-400">
              Modular Monolith Administration • Granular RBAC + Church Scoped Permissions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>API Gateway Online (Port 4000)</span>
          </span>
        </div>
      </div>

      {/* Workflow State Machine Visualization (Section 14) */}
      <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-eotc-gold flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>Editorial Workflow State Pipeline (Section 14)</span>
          </h2>
          <span className="text-xs text-neutral-500">Separation of Duties Enforced</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2 text-center text-xs">
          <div className="p-3 rounded-xl bg-neutral-800/80 border border-neutral-700">
            <div className="font-bold text-neutral-300">1. DRAFT</div>
            <div className="text-[10px] text-neutral-500 mt-0.5">Author/Editor entry</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/50">
            <div className="font-bold text-amber-400">2. IN_REVIEW</div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Reviewer queue</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50">
            <div className="font-bold text-emerald-400">3. APPROVED</div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Rights & Doctrinal pass</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/50">
            <div className="font-bold text-blue-400">4. PUBLISHED</div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Publicly accessible</div>
          </div>
          <div className="p-3 rounded-xl bg-neutral-800/40 border border-neutral-800 text-neutral-500">
            <div className="font-bold">5. ARCHIVED</div>
            <div className="text-[10px] mt-0.5">Deprecations & versions</div>
          </div>
        </div>
      </div>

      {/* Core Admin Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>Library Management</span>
            </h3>
            <span className="text-xs text-neutral-500">Drafts: 3</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Manage manuscripts, validate PDF upload metadata, configure download permissions, and edit Amharic/Ge'ez translations.
          </p>
          <div className="pt-2">
            <button className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold transition-colors">
              Open Library Module
            </button>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Church className="w-4 h-4 text-emerald-500" />
              <span>Churches & Dioceses</span>
            </h3>
            <span className="text-xs text-neutral-500">Parishes: 28</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Verify representative assignments, approve claims, validate geolocation metadata, and audit parish content updates.
          </p>
          <div className="pt-2">
            <button className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold transition-colors">
              Manage Church Scopes
            </button>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-purple-500" />
              <span>Rights & Provenance</span>
            </h3>
            <span className="text-xs text-neutral-500">Active: 42</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Audit RightsRecords, enforce copyright/permission policies, verify attribution sources, and manage permission evidence.
          </p>
          <div className="pt-2">
            <button className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold transition-colors">
              Inspect Rights Records
            </button>
          </div>
        </div>
      </div>

      {/* Role & Audit Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <h3 className="font-bold text-sm text-neutral-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-neutral-400" />
            <span>Role-Based Access Control Hierarchy (Section 3)</span>
          </h3>
          <div className="space-y-2 text-xs text-neutral-400">
            <div className="flex justify-between p-2 rounded-lg bg-neutral-950">
              <span className="font-semibold text-white">Super Administrator</span>
              <span>2FA Enforced • Global Emergency Scope</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-neutral-950">
              <span className="font-semibold text-white">Administrator</span>
              <span>Manage content, roles, users & site configs</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-neutral-950">
              <span className="font-semibold text-white">Moderator / Reviewer</span>
              <span>Review submissions, rights checks, publish queue</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-neutral-950">
              <span className="font-semibold text-white">Editor</span>
              <span>Draft & update library, mezmur, articles & events</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-neutral-950">
              <span className="font-semibold text-white">Church Representative</span>
              <span>Scoped exclusively to assigned church id</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <h3 className="font-bold text-sm text-neutral-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Live Audit & Health Telemetry (Section 27)</span>
          </h3>
          <div className="p-4 rounded-xl bg-neutral-950 font-mono text-[11px] text-neutral-300 space-y-1.5 border border-neutral-800">
            <div>[STATUS] API Endpoint: http://localhost:4000/api/v1/health</div>
            <div>[LOG] Format: Structured JSON with RequestId & Duration</div>
            <div>[DATABASE] PostgreSQL 16 (Port 5432)</div>
            <div>[STORAGE] S3-compatible MinIO (Port 9000)</div>
            <div>[AUDIT] Actor, Action, EntityType, EntityId, IpHash, Timestamp</div>
          </div>
        </div>
      </div>
    </div>
  );
}
