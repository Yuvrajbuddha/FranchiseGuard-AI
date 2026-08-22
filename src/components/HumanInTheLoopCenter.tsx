import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Search, 
  FileText, 
  History,
  Building2,
  Eye,
  Sparkles
} from 'lucide-react';
import { FranchiseStore, AuditLogEntry } from '../types/franchise';
import confetti from 'canvas-confetti';

interface HumanInTheLoopCenterProps {
  stores: FranchiseStore[];
  auditLogs: AuditLogEntry[];
  onInspectStore: (storeNumber: number) => void;
  onApproveAction: (storeNumber: number, actionType: string, note?: string) => void;
  onRejectAction: (storeNumber: number, note?: string) => void;
}

export const HumanInTheLoopCenter: React.FC<HumanInTheLoopCenterProps> = ({
  stores,
  auditLogs,
  onInspectStore,
  onApproveAction,
  onRejectAction,
}) => {
  const [selectedQueueFilter, setSelectedQueueFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const [managerNotes, setManagerNotes] = useState<Record<number, string>>({});
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const pendingStores = stores.filter((s) => s.riskScore >= 60 && s.humanReviewStatus === 'Pending Review');
  const approvedStores = stores.filter((s) => s.humanReviewStatus === 'Approved');

  const displayedStores = 
    selectedQueueFilter === 'pending' ? pendingStores :
    selectedQueueFilter === 'approved' ? approvedStores :
    stores.filter((s) => s.riskScore >= 50);

  const handleApprove = (store: FranchiseStore) => {
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
    });
    const note = managerNotes[store.storeNumber] || 'Approved by Franchise Compliance Manager';
    onApproveAction(store.storeNumber, store.recommendedActionType, note);
    setFeedbackToast(`Action approved for Store #${store.storeNumber}: ${store.aiRecommendation}`);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleReject = (store: FranchiseStore) => {
    const note = managerNotes[store.storeNumber] || 'Flag dismissed after supervisor review';
    onRejectAction(store.storeNumber, note);
    setFeedbackToast(`Flag dismissed for Store #${store.storeNumber}.`);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-10">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Compliance Action Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review and approve AI-generated violation flags, physical audits, and formal cure notices.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setSelectedQueueFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedQueueFilter === 'pending'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Pending ({pendingStores.length})
          </button>
          <button
            onClick={() => setSelectedQueueFilter('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedQueueFilter === 'approved'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Approved ({approvedStores.length})
          </button>
          <button
            onClick={() => setSelectedQueueFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedQueueFilter === 'all'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            All Actionable
          </button>
        </div>
      </div>

      {feedbackToast && (
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800 font-semibold flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Main Approval Queue */}
      <div className="space-y-3">
        {displayedStores.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900">Queue is Clear</h3>
            <p className="text-xs text-slate-500 mt-0.5">All actionable stores have been reviewed.</p>
          </div>
        ) : (
          displayedStores.map((store) => {
            const isCrit = store.riskLevel === 'critical';
            const isSpotlight = store.storeNumber === 247;
            return (
              <div
                key={store.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs ${
                  isSpotlight
                    ? 'bg-white border-teal-400 ring-1 ring-teal-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Store Header & Stats */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-bold shrink-0 ${
                      isCrit
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    <span className="text-sm font-black leading-none">{store.riskScore}</span>
                    <span className="text-[8px] uppercase font-bold">RISK</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{store.name}</h3>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                        {store.location.region} Region
                      </span>
                      {isSpotlight && (
                        <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          SPOTLIGHT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600">
                      <strong className="text-slate-800">Violation:</strong> {store.mainIssue}
                    </p>
                    <p className="text-xs text-teal-900 font-medium">
                      <strong className="text-slate-800">AI Action:</strong> {store.aiRecommendation}
                    </p>
                  </div>
                </div>

                {/* Manager Action Form */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                  <input
                    type="text"
                    placeholder="Add supervisor note..."
                    value={managerNotes[store.storeNumber] || ''}
                    onChange={(e) => setManagerNotes({ ...managerNotes, [store.storeNumber]: e.target.value })}
                    className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-teal-600 focus:bg-white w-full sm:w-48"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onInspectStore(store.storeNumber)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-700" />
                      <span>Inspect</span>
                    </button>

                    <button
                      onClick={() => handleReject(store)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Dismiss
                    </button>

                    <button
                      onClick={() => handleApprove(store)}
                      className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Audit Log */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-teal-700" />
            <h2 className="text-sm font-bold text-slate-900">Recent Supervisor Decisions</h2>
          </div>
          <span className="text-xs text-slate-400">{auditLogs.length} events logged</span>
        </div>

        <div className="space-y-2">
          {auditLogs.slice(0, 4).map((log) => (
            <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-teal-800">Store #{log.storeNumber}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-800 font-medium">{log.actionTaken}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{log.notes}</p>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400 shrink-0">
                <span>By: {log.actor}</span>
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
