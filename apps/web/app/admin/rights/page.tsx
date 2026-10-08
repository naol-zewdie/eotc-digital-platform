'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  FileText,
  Plus,
  CheckCircle2,
  Lock,
  Download,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { RightsStatus, RightsRecordDto } from '@eotc/contracts';

export default function AdminRightsPage() {
  const [records, setRecords] = useState<RightsRecordDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New Rights Record form state
  const [status, setStatus] = useState<RightsStatus>(RightsStatus.PUBLIC_DOMAIN);
  const [rightsHolder, setRightsHolder] = useState('Ethiopian Orthodox Tewahedo Church');
  const [source, setSource] = useState('Monastic Manuscript Archive');
  const [permissionReference, setPermissionReference] = useState('Historic Canon & Tradition');
  const [downloadAllowed, setDownloadAllowed] = useState(true);
  const [notes, setNotes] = useState('Preserved sacred religious heritage for free public study.');

  const sampleRecords: RightsRecordDto[] = [
    {
      id: 'rights-pub-001',
      status: RightsStatus.PUBLIC_DOMAIN,
      rightsHolder: 'EOTC Patriarchate Tradition',
      source: 'Ancient Liturgical Manuscripts (Axum & Lalibela)',
      permissionReference: 'Canon Law of the Apostles',
      downloadAllowed: true,
      notes: 'Ancient manuscripts older than copyright term. Freely viewable and downloadable.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rights-ch-002',
      status: RightsStatus.CHURCH_OWNED,
      rightsHolder: 'Debre Libanos Monastery',
      source: 'Debre Libanos Monastic Library',
      permissionReference: 'Abbot Archival Approval Ref #144-2024',
      downloadAllowed: false,
      notes: 'Browser viewing permitted only. Controlled download restricted per monastic decree.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rights-perm-003',
      status: RightsStatus.PERMISSION_GRANTED,
      rightsHolder: 'Mahibere Kidusan Audio Archive',
      source: 'Licensed Hymnody Collection',
      permissionReference: 'Formal License Agreement 2026-MK-09',
      downloadAllowed: true,
      notes: 'Licensed for non-commercial educational distribution.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/rights');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setRecords(data);
          return;
        }
      }
      setRecords(sampleRecords);
    } catch {
      setRecords(sampleRecords);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: RightsRecordDto = {
      id: `rights-${Date.now()}`,
      status,
      rightsHolder,
      source,
      permissionReference,
      downloadAllowed,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await fetch('http://localhost:4000/api/v1/rights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      });
    } catch {}

    setRecords([newRecord, ...records]);
    setShowModal(false);
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-eotc-gold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Rights & Provenance Records (Section 14 & 34)</span>
          </div>
          <h1 className="text-2xl font-bold text-white heading-font">
            Copyright, Source Provenance & Download Governance
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Mandatory provenance metadata for all manuscripts, mezmur audio, and ecclesiastical media.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-eotc-crimson hover:bg-eotc-crimson-light text-xs font-bold text-white transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Rights Record</span>
        </button>
      </div>

      {/* Rights Records Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
              <tr>
                <th className="px-5 py-3.5">Rights Status</th>
                <th className="px-5 py-3.5">Rights Holder</th>
                <th className="px-5 py-3.5">Source / Archive</th>
                <th className="px-5 py-3.5">Permission Evidence</th>
                <th className="px-5 py-3.5">Download Policy</th>
                <th className="px-5 py-3.5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-sans">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        r.status === RightsStatus.PUBLIC_DOMAIN
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                          : r.status === RightsStatus.CHURCH_OWNED
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                          : r.status === RightsStatus.PERMISSION_GRANTED
                          ? 'bg-blue-950 text-blue-300 border border-blue-800/60'
                          : 'bg-red-950 text-red-300 border border-red-800/60'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-white whitespace-nowrap">
                    {r.rightsHolder || '—'}
                  </td>
                  <td className="px-5 py-3.5 text-neutral-400">{r.source || '—'}</td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-eotc-gold">
                    {r.permissionReference || '—'}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {r.downloadAllowed ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                        <Download className="w-3.5 h-3.5" />
                        <span>Allowed</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-400 text-[11px] font-semibold">
                        <Lock className="w-3.5 h-3.5" />
                        <span>View Only</span>
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-neutral-400 max-w-xs truncate">{r.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for creating RightsRecord */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-white">Create Rights & Provenance Record</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-500 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Rights Status:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as RightsStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                >
                  <option value={RightsStatus.PUBLIC_DOMAIN}>PUBLIC_DOMAIN (Unrestricted)</option>
                  <option value={RightsStatus.CHURCH_OWNED}>CHURCH_OWNED (Monastery/Parish)</option>
                  <option value={RightsStatus.PERMISSION_GRANTED}>PERMISSION_GRANTED (Licensed)</option>
                  <option value={RightsStatus.RESTRICTED}>RESTRICTED (Internal Archive)</option>
                  <option value={RightsStatus.UNKNOWN}>UNKNOWN (Blocked from Publication)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Rights Holder:</label>
                <input
                  type="text"
                  required
                  value={rightsHolder}
                  onChange={(e) => setRightsHolder(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Source / Monastery / Archive:</label>
                <input
                  type="text"
                  required
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Permission Evidence Reference:</label>
                <input
                  type="text"
                  value={permissionReference}
                  onChange={(e) => setPermissionReference(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="dlAllowed"
                  checked={downloadAllowed}
                  onChange={(e) => setDownloadAllowed(e.target.checked)}
                  className="rounded border-neutral-700"
                />
                <label htmlFor="dlAllowed" className="text-neutral-300 font-semibold cursor-pointer">
                  Allow Controlled User Download (uncheck for View-Only)
                </label>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Provenance Notes:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-eotc-crimson text-white font-bold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
