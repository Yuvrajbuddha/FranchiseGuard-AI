import React, { useState } from 'react';
import { 
  Camera, 
  Video, 
  Film, 
  MessageSquareQuote, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  ArrowUpRight, 
  FileText, 
  ExternalLink,
  Eye,
  Check,
  XCircle,
  Clock,
  MapPin,
  TrendingDown
} from 'lucide-react';
import { FranchiseStore, CustomerReview, StorePhotoAudit } from '../types/franchise';

interface ManagerPortalProps {
  stores: FranchiseStore[];
  onSelectStore: (storeNumber: number) => void;
  onOpenMediaUpload: (storeNumber?: number) => void;
  onApproveAction: (storeNumber: number, actionType: string, note?: string) => void;
  onRejectAction: (storeNumber: number, note?: string) => void;
  onInvestigateAction: (storeNumber: number, note?: string) => void;
}

export const ManagerPortal: React.FC<ManagerPortalProps> = ({
  stores,
  onSelectStore,
  onOpenMediaUpload,
  onApproveAction,
  onRejectAction,
  onInvestigateAction,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'media_stream' | 'reviews_stream' | 'priority_queue'>('media_stream');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'negative' | 'hygiene' | 'critical'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Collect all photos and customer reviews across stores
  const allPhotosWithStore = stores.flatMap((s) => 
    s.photos.map((p) => ({ ...p, storeNumber: s.storeNumber, storeName: s.name, storeCity: s.location.city }))
  );

  const allReviewsWithStore = stores.flatMap((s) =>
    s.reviews.map((r) => ({ ...r, storeNumber: s.storeNumber, storeName: s.name, storeCity: s.location.city }))
  );

  // Filter reviews
  const filteredReviews = allReviewsWithStore.filter((r) => {
    if (reviewFilter === 'negative') return r.sentiment === 'negative' || r.rating <= 2;
    if (reviewFilter === 'hygiene') return r.extractedCategory === 'Cleanliness';
    if (reviewFilter === 'critical') return r.severity === 'critical';
    return true;
  });

  // Critical stores requiring manager review
  const pendingReviewStores = stores.filter((s) => s.riskLevel === 'critical' || s.humanReviewStatus === 'Pending Review');

  return (
    <div className="space-y-6">
      {/* Manager Action Bar */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
              Operations & Compliance Manager
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300">Field Inspections & Review Oversight</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Manager Evidence & Review Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Upload and review video footage, investigate customer photo submissions, audit negative reviews, and dispatch store remediation actions.
          </p>
        </div>

        {/* Primary Manager Actions: Video/Photo Upload */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={() => onOpenMediaUpload(247)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-lg shadow-teal-900/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Photo / Video</span>
          </button>

          <button
            onClick={() => onSelectStore(247)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-4 py-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-teal-400" />
            <span>Inspect Store #247</span>
          </button>
        </div>
      </div>

      {/* 3 Quick Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-1.5 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('media_stream')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl transition-all ${
            activeSubTab === 'media_stream'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Recorded Media & Video Streams ({allPhotosWithStore.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reviews_stream')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl transition-all ${
            activeSubTab === 'reviews_stream'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquareQuote className="w-4 h-4" />
          <span>Customer Reviews & Feedback ({allReviewsWithStore.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('priority_queue')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl transition-all ${
            activeSubTab === 'priority_queue'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Action Queue & Cure Notices ({pendingReviewStores.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: RECORDED VIDEOS & CUSTOMER PHOTOS */}
      {activeSubTab === 'media_stream' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recorded Media & Visual Evidence Streams</h3>
              <p className="text-xs text-slate-500">Customer uploads, kitchen CCTV video feeds, and inspector audits with AI bounding boxes</p>
            </div>

            <button
              onClick={() => onOpenMediaUpload(247)}
              className="flex items-center gap-1.5 bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-4 h-4 text-teal-700" />
              <span>+ Add New Store Media</span>
            </button>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPhotosWithStore.map((media, idx) => {
              const isVid = media.mediaType === 'video' || (media.videoUrl && media.videoUrl.endsWith('.mp4'));
              const hasFlags = media.detectedViolations.length > 0;
              return (
                <div
                  key={media.id || idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Thumbnail / Video Preview */}
                  <div 
                    onClick={() => onSelectStore(media.storeNumber)}
                    className="relative aspect-video bg-slate-950 flex items-center justify-center cursor-pointer group overflow-hidden"
                  >
                    <img
                      src={media.imageUrl}
                      alt={media.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    {/* Media Type Overlay */}
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/80 text-white text-[10px] font-bold flex items-center gap-1">
                      {isVid ? <Video className="w-3 h-3 text-teal-400" /> : <Camera className="w-3 h-3 text-white" />}
                      <span>{isVid ? 'Video Footage' : 'Photo'}</span>
                    </div>

                    {/* Infractions count */}
                    {hasFlags ? (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-extrabold">
                        {media.detectedViolations.length} AI Violations
                      </div>
                    ) : (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                        Cleanliness Passed
                      </div>
                    )}

                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2 text-xs text-white">
                      <span className="font-bold block truncate">Store #{media.storeNumber} - {media.zone}</span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Submitted by: <strong>{media.submittedBy || 'Auditor'}</strong></span>
                        <span className="font-mono text-[11px]">{media.timestamp}</span>
                      </div>

                      {media.customerComment && (
                        <p className="text-xs text-slate-700 italic mt-2 p-2 bg-amber-50 rounded-xl border border-amber-200">
                          "{media.customerComment}"
                        </p>
                      )}

                      {/* Violations Chips */}
                      {media.detectedViolations.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {media.detectedViolations.map((v, i) => (
                            <span key={i} className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                              {v.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">
                        Score: <strong className={media.overallCleanlinessScore < 60 ? 'text-rose-600' : 'text-emerald-600'}>{media.overallCleanlinessScore}/100</strong>
                      </span>
                      <button
                        onClick={() => onSelectStore(media.storeNumber)}
                        className="text-teal-700 hover:text-teal-800 text-xs font-bold flex items-center gap-1 hover:underline"
                      >
                        <span>Inspect in Video Player</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CUSTOMER REVIEWS & FEEDBACK STREAM */}
      {activeSubTab === 'reviews_stream' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Customer Dining Reviews & AI Sentiment</h3>
              <p className="text-xs text-slate-500">Continuous NLP categorization across Zomato, Swiggy, and Customer App tickets</p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setReviewFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${reviewFilter === 'all' ? 'bg-teal-700 text-white' : 'text-slate-600'}`}
              >
                All Reviews
              </button>
              <button
                onClick={() => setReviewFilter('negative')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${reviewFilter === 'negative' ? 'bg-teal-700 text-white' : 'text-slate-600'}`}
              >
                1-2 Stars Only
              </button>
              <button
                onClick={() => setReviewFilter('hygiene')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${reviewFilter === 'hygiene' ? 'bg-teal-700 text-white' : 'text-slate-600'}`}
              >
                Cleanliness Flags
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredReviews.map((rev) => {
              const isNegative = rev.sentiment === 'negative' || rev.rating <= 2;
              return (
                <div
                  key={rev.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isNegative ? 'bg-rose-50/30 border-rose-200' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          Store #{rev.storeNumber} ({rev.storeCity})
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">{rev.source}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-[11px] text-slate-400 font-mono">{rev.timestamp}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          Category: {rev.extractedCategory}
                        </span>
                        {rev.isRecurringIssue && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">
                            Recurring Anomaly
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectStore(rev.storeNumber)}
                      className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 hover:underline shrink-0"
                    >
                      <span>Inspect Store</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 mt-2 leading-relaxed italic bg-white/70 p-3 rounded-xl border border-slate-200">
                    "{rev.text}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PRIORITY ACTION QUEUE & 14-DAY CURE NOTICES */}
      {activeSubTab === 'priority_queue' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">High-Priority Store Remediation & Cure Notices</h3>
            <p className="text-xs text-slate-500">Approve AI recommendations, dispatch immediate physical audits, or issue formal cure notices</p>
          </div>

          <div className="space-y-3">
            {pendingReviewStores.map((store) => (
              <div
                key={store.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">Store #{store.storeNumber}</span>
                      <h4 className="text-sm font-bold text-slate-900">{store.name}</h4>
                      <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-rose-200">
                        {store.riskScore}/100 Critical
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Operator: <strong>{store.operatorName}</strong> • Phone: {store.operatorPhone} • City: {store.location.city}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectStore(store.storeNumber)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                    >
                      View Evidence
                    </button>
                    <button
                      onClick={() => onApproveAction(store.storeNumber, 'physical_inspection')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Dispatch Audit</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-teal-800 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Root-Cause Diagnosis:</span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {store.aiExplanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
