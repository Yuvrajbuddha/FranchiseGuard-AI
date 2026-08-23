import React, { useState } from 'react';
import { 
  Store, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Upload, 
  Camera, 
  Video, 
  Clock, 
  FileText, 
  Star, 
  MessageSquareQuote, 
  Sparkles, 
  Phone, 
  Mail, 
  ChevronRight, 
  HelpCircle,
  TrendingDown,
  Check
} from 'lucide-react';
import { FranchiseStore, StorePhotoAudit } from '../types/franchise';
import confetti from 'canvas-confetti';

interface FranchiseePortalProps {
  store: FranchiseStore;
  onOpenMediaUpload: (storeNumber: number) => void;
  onSelectStore: (storeNumber: number) => void;
}

export const FranchiseePortal: React.FC<FranchiseePortalProps> = ({
  store,
  onOpenMediaUpload,
  onSelectStore,
}) => {
  const [remediationSent, setRemediationSent] = useState<boolean>(false);
  const [fixNote, setFixNote] = useState<string>('');

  const handleSendProofOfFix = (e: React.FormEvent) => {
    e.preventDefault();
    setRemediationSent(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const isCritical = store.riskScore >= 75;

  return (
    <div className="space-y-6">
      {/* Store Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
              Franchisee Store Operator Portal
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300">Store #{store.storeNumber}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {store.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Operator: <strong>{store.operatorName}</strong> • {store.address}, {store.location.city}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenMediaUpload(store.storeNumber)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-lg shadow-teal-900/30 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Proof of Cleanliness</span>
          </button>
        </div>
      </div>

      {/* Top 3 Operator Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Store Hygiene & Compliance Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Store Compliance Status</span>
            <Store className="w-4 h-4 text-teal-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${isCritical ? 'text-rose-600' : 'text-emerald-600'}`}>
              {100 - store.riskScore}%
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${isCritical ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700'}`}>
              {isCritical ? 'Action Required' : 'Compliant'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Risk Score: {store.riskScore}/100 (Based on {store.recentViolationsCount} visual flags)
          </p>
        </div>

        {/* Card 2: 14-Day Cure Notice Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Corporate Notice</span>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">14-Day Cure Notice</span>
          </div>
          <p className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Remediation due within 5 business days</span>
          </p>
        </div>

        {/* Card 3: Customer Satisfaction */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Customer CSAT Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {store.posMetrics.customerSatisfactionScore}%
            </span>
            <span className="text-xs text-slate-400 font-medium">30-day index</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {store.negativeReviewsCount30d} negative reviews flagged this month
          </p>
        </div>
      </div>

      {/* Main Grid: Active Action Items & Remediation Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Active Infractions to Fix */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Flagged Infractions & Action Plan</h3>
              <p className="text-xs text-slate-500">Items flagged by AI audit requiring physical verification</p>
            </div>
            <button
              onClick={() => onSelectStore(store.storeNumber)}
              className="text-xs text-teal-700 hover:text-teal-800 font-bold underline"
            >
              Open Full Inspector →
            </button>
          </div>

          <div className="space-y-3">
            {store.photos.flatMap((p) => p.detectedViolations).map((violation, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-rose-100 text-rose-700 rounded border border-rose-200">
                      {violation.severity} • {violation.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{violation.label}</h4>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Clause: {violation.standardClause}</span>
                </div>

                <p className="text-xs text-slate-600">{violation.evidenceDescription}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-500">Confidence: {violation.confidence}%</span>
                  <button
                    onClick={() => onOpenMediaUpload(store.storeNumber)}
                    className="text-teal-700 font-bold hover:underline"
                  >
                    Upload Proof of Cleanliness →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Submit Proof of Fix / Remediation Form */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Submit Remediation & Proof</h3>
            <p className="text-xs text-slate-500">Upload clean kitchen photos to submit directly to the Operations Manager</p>
          </div>

          {remediationSent ? (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-emerald-900">Proof of Fix Submitted Successfully!</h4>
              <p className="text-xs text-emerald-700">
                Your photos and notes have been dispatched to Regional Manager Swapnil Tripathi for review. Your compliance score will update once approved.
              </p>
              <button
                onClick={() => setRemediationSent(false)}
                className="text-xs text-emerald-800 font-bold underline"
              >
                Submit another update
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendProofOfFix} className="space-y-4">
              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                <Camera className="w-6 h-6 text-teal-700 mx-auto" />
                <p className="text-xs font-bold text-slate-800">Attach Clean Store Photos / Video</p>
                <p className="text-[11px] text-slate-500">Capture the sanitized prep tables and repaired seal</p>
                <button
                  type="button"
                  onClick={() => onOpenMediaUpload(store.storeNumber)}
                  className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Open Camera / Upload
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Remediation Action Notes
                </label>
                <textarea
                  rows={3}
                  value={fixNote}
                  onChange={(e) => setFixNote(e.target.value)}
                  placeholder="e.g. Deep cleaning completed by shift crew at 4 PM. Replacement cooler gasket installed by technician."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Submit Proof to Compliance Manager</span>
              </button>
            </form>
          )}

          {/* Regional Manager Contact Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 mt-4">
            <span className="font-bold text-slate-900 block">Assigned Regional Manager</span>
            <div className="flex items-center justify-between text-slate-600">
              <span>Swapnil Tripathi (UP & North)</span>
              <span className="font-mono text-teal-700 font-bold">+91 98765 43210</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
