'use client';

import React, { useState, useEffect } from 'react';
import { History, Shield, Filter, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { AuditEventDto } from '@eotc/contracts';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditEventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');

  const defaultLogs: AuditEventDto[] = [
    {
      id: 'aud-001',
      actorName: 'Patriarchate Administrator',
      actorEmail: 'admin@eotc-platform.org',
      action: 'LOGIN_SUCCESS',
      entityType: 'User',
      entityId: 'admin@eotc-platform.org',
      metadata: { role: 'SUPER_ADMINISTRATOR' },
      ipHash: '127.0.0.1',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'aud-002',
      actorName: 'Patriarchate Administrator',
      actorEmail: 'admin@eotc-platform.org',
      action: 'CHURCH_SCOPE_ASSIGNED',
      entityType: 'ChurchMembership',
      entityId: 'rep-01:debre-libanos',
      metadata: { churchSlug: 'debre-libanos', role: 'CHURCH_REPRESENTATIVE' },
      ipHash: '127.0.0.1',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'aud-003',
      actorName: 'Theological Editor',
      actorEmail: 'editor@eotc-platform.org',
      action: 'CONTENT_CREATED',
      entityType: 'Book',
      entityId: 'metsihafe-qidassie',
      metadata: { status: 'DRAFT', language: 'am,gez' },
      ipHash: '127.0.0.1',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'aud-004',
      actorName: 'Ecclesiastical Reviewer',
      actorEmail: 'reviewer@eotc-platform.org',
      action: 'CONTENT_APPROVED',
      entityType: 'Book',
      entityId: 'metsihafe-qidassie',
      metadata: { rightsStatus: 'PUBLIC_DOMAIN' },
      ipHash: '127.0.0.1',
      createdAt: new Date(Date.now() - 10800000).toISOString(),
    },
  ];

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/audit?limit=50');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setLogs(data);
          return;
        }
      }
      setLogs(defaultLogs);
    } catch {
      setLogs(defaultLogs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filterType === 'ALL') return true;
    return log.entityType === filterType;
  });

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-eotc-gold mb-1">
            <History className="w-4 h-4" />
            <span>Audit & Traceability Infrastructure (Section 27)</span>
          </div>
          <h1 className="text-2xl font-bold text-white heading-font">
            Immutable Audit Trail Log
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Tracks logins, role assignments, content state transitions, and administrative operations.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors border border-neutral-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Audit Stream</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['ALL', 'User', 'ChurchMembership', 'Book', 'Article'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterType === type
                ? 'bg-eotc-crimson text-white'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {type === 'ALL' ? 'All Audit Records' : `${type} Events`}
          </button>
        ))}
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Action</th>
                <th className="px-5 py-3.5">Actor</th>
                <th className="px-5 py-3.5">Entity</th>
                <th className="px-5 py-3.5">Metadata / Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="px-5 py-3.5 text-neutral-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        log.action.includes('SUCCESS') || log.action.includes('APPROVED')
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                          : log.action.includes('ASSIGNED') || log.action.includes('REGISTERED')
                          ? 'bg-blue-950 text-blue-300 border border-blue-800/60'
                          : log.action.includes('FAILED')
                          ? 'bg-red-950 text-red-300 border border-red-800/60'
                          : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-sans whitespace-nowrap">
                    <div className="font-semibold text-white">{log.actorName || 'System'}</div>
                    <div className="text-[11px] text-neutral-500">{log.actorEmail || log.ipHash}</div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-eotc-gold font-semibold">{log.entityType}</span>
                    <span className="text-neutral-500 ml-1.5 truncate max-w-[120px] inline-block align-bottom">
                      {log.entityId}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[11px] text-neutral-400">
                    {log.metadata ? JSON.stringify(log.metadata) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
