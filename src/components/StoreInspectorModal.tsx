import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon, 
  Camera, 
  MessageSquareQuote, 
  History, 
  Activity, 
  FileText, 
  Check, 
  XCircle, 
  Search, 
  Send, 
  TrendingDown, 
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { FranchiseStore, VisualViolationDetection } from '../types/franchise';
import { generateRiskExplanation, generateCureNoticeText } from '../services/apiClient';
import confetti from 'canvas-confetti';

interface StoreInspectorModalProps {
  store: FranchiseStore | null;
  onClose: () => void;
  onApproveAction: (storeNumber: number, actionType: string, note?: string) => void;
  onRejectAction: (storeNumber: number, note?: string) => void;
  onInvestigateAction: (storeNumber: number, note?: string) => void;
}

export const StoreInspectorModal: React.FC<StoreInspectorModalProps> = ({
  store,
  onClose,
  onApproveAction,
  onRejectAction,
  onInvestigateAction,
}) => {
  if (!store) return null;

  const [activeTab, setActiveTab] = useState<'evidence' | 'reviews' | 'history' | 'pos' | 'cure_notice'>('evidence');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isGeneratingNotice, setIsGeneratingNotice] = useState<boolean>(false);
  const [cureNoticeContent, setCureNoticeContent] = useState<string>('');
  const [managerNote, setManagerNote] = useState<string>('');
  const [actionConfirmedMessage, setActionConfirmedMessage] = useState<string | null>(null);

  const isCrit = store.riskLevel === 'critical';
  const isHigh = store.riskLevel === 'high';

  const currentPhoto = store.photos[selectedPhotoIndex] || store.photos[0];

  const handleGenerateNotice = async () => {
    setIsGeneratingNotice(true);
    try {
      const res = await generateCureNoticeText({
        store,
        violations: store.photos.flatMap((p) => p.detectedViolations.map((v) => `${v.category}: ${v.label}`)),
      });
      setCureNoticeContent(res.noticeText);
      setActiveTab('cure_notice');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingNotice(false);
    }
  };

  const handleApprove = (type: string) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    setActionConfirmedMessage(`Decision Logged: Physical Inspection Approved for Store #${store.storeNumber}. Auditor dispatched.`);
    onApproveAction(store.storeNumber, type, managerNote);
    setTimeout(() => {
      setActionConfirmedMessage(null);
    }, 4000);
  };

  const handleReject = () => {
    setActionConfirmedMessage(`Decision Logged: AI Flag Dismissed by Franchise Manager.`);
    onRejectAction(store.storeNumber, managerNote);
    setTimeout(() => {
      setActionConfirmedMessage(null);
    }, 4000);
  };

  const handleInvestigate = () => {
    setActionConfirmedMessage(`Investigation Flagged: Field Operations requested additional photo & POS logs.`);
    onInvestigateAction(store.storeNumber, managerNote);
    setTimeout(() => {
      setActionConfirmedMessage(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-white px-6 py-5 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold shrink-0 ${
                isCrit
                  ? 'bg-red-100 text-red-700'
                  : isHigh
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              <span className="text-base font-extrabold leading-none">{store.riskScore}</span>
              <span className="text-[9px] uppercase font-bold text-slate-500">/100</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">{store.name}</h2>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    isCrit
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : isHigh
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {store.riskLevel} Risk
                </span>
                {store.humanReviewStatus && (
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200">
                    Status: {store.humanReviewStatus}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-indigo-600" />
                  {store.address}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {store.operatorPhone}
                </span>
                <span>•</span>
                <span>Operator: <strong className="text-slate-700">{store.operatorName}</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Confirmation Banner */}
        {actionConfirmedMessage && (
          <div className="bg-emerald-50 text-emerald-800 px-6 py-2.5 text-xs font-semibold flex items-center justify-between border-b border-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionConfirmedMessage}</span>
            </div>
          </div>
        )}

        {/* AI Explanation & Multi-Signal Synthesis Bar */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                  AI Explanation Engine Rationale
                </span>
                <span className="text-[11px] text-slate-500">
                  (Multi-Stream Synthesis: Vision + NLP + Historical Recurrence + POS)
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{store.aiExplanation}</p>
            </div>
          </div>

          {/* Risk Scoring Formula Weights */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 pt-3 border-t border-slate-200 text-[11px]">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex flex-col shadow-xs">
              <span className="text-slate-500">Photo Violations</span>
              <span className="font-bold text-red-600">+{store.riskBreakdown.photoViolationsWeight} pts</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex flex-col shadow-xs">
              <span className="text-slate-500">Customer Reviews</span>
              <span className="font-bold text-amber-600">+{store.riskBreakdown.customerComplaintsWeight} pts</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex flex-col shadow-xs">
              <span className="text-slate-500">Audit Recurrence</span>
              <span className="font-bold text-red-600">+{store.riskBreakdown.repeatViolationsWeight} pts</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex flex-col shadow-xs">
              <span className="text-slate-500">POS Revenue Drop</span>
              <span className="font-bold text-amber-600">+{store.riskBreakdown.businessAnomaliesWeight} pts</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex flex-col shadow-xs">
              <span className="text-slate-500">Unresolved Actions</span>
              <span className="font-bold text-red-600">+{store.riskBreakdown.unresolvedActionsWeight} pts</span>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-white px-6 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'evidence'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Evidence ({store.photos.length} Photos)</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Review Intelligence ({store.reviews.length} Complaints)</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'history'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit History & Recurrence ({store.inspections.length} Audits)</span>
          </button>

          <button
            onClick={() => setActiveTab('pos')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'pos'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>POS & Business Signals</span>
          </button>

          <button
            onClick={handleGenerateNotice}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'cure_notice'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-red-600 hover:text-red-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Formal 14-Day Cure Notice</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-white">
          {/* TAB 1: VISUAL EVIDENCE & COMPUTER VISION */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              {store.photos.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-700 text-sm font-medium">No photo streams uploaded for this location yet.</p>
                  <p className="text-slate-500 text-xs mt-1">Use the Computer Vision Lab tab to upload an audit photo.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left: Image with Bounding Box overlays */}
                  <div className="lg:col-span-7 space-y-2">
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[4/3] group shadow-sm">
                      <img
                        src={currentPhoto?.imageUrl}
                        alt={currentPhoto?.caption}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />

                      {/* Bounding Box Highlights */}
                      {currentPhoto?.detectedViolations.map((v, i) => {
                        if (!v.boundingBox) return null;
                        return (
                          <div
                            key={v.id || i}
                            style={{
                              left: `${v.boundingBox.x}%`,
                              top: `${v.boundingBox.y}%`,
                              width: `${v.boundingBox.width}%`,
                              height: `${v.boundingBox.height}%`,
                            }}
                            className="absolute border-2 border-red-500 bg-red-500/20 rounded pointer-events-none transition-all flex flex-col justify-between p-1"
                          >
                            <span className="bg-red-600 text-white font-bold text-[9px] px-1 py-0.2 rounded w-max shadow">
                              {v.label} ({v.confidence}%)
                            </span>
                          </div>
                        );
                      })}

                      <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs text-slate-800 shadow-sm">
                        <span>Zone: <strong className="text-slate-900">{currentPhoto?.zone}</strong></span>
                        <span>Score: <strong className="text-red-600">{currentPhoto?.overallCleanlinessScore}/100</strong></span>
                        <span className="text-slate-500">{currentPhoto?.timestamp}</span>
                      </div>
                    </div>

                    {/* Thumbnail selector */}
                    {store.photos.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {store.photos.map((p, idx) => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedPhotoIndex(idx)}
                            className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                              selectedPhotoIndex === idx ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={p.imageUrl} alt={p.caption} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[8px] text-center text-white truncate px-1 font-medium">
                              {p.zone.split('/')[0]}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Detected Violations & Standard References */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        AI Computer Vision Detections ({currentPhoto?.detectedViolations.length || 0})
                      </h3>
                      <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold border border-red-200">
                        {currentPhoto?.aiStatus === 'flagged' ? 'Infractions Flagged' : 'Passed'}
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                      {currentPhoto?.detectedViolations.map((v) => (
                        <div key={v.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs shadow-xs">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-red-700">{v.label}</span>
                            <span className="bg-white text-indigo-700 font-mono text-[10px] px-1.5 py-0.5 rounded shrink-0 border border-slate-200 font-bold">
                              {v.confidence}% conf
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{v.evidenceDescription}</p>
                          <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[10px]">
                            <span className="text-amber-800 font-bold">{v.standardClause}</span>
                            <span className="uppercase font-extrabold text-red-600">{v.severity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REVIEW INTELLIGENCE (NLP) */}
          {activeTab === 'reviews' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Customer Sentiment Stream ({store.reviews.length} Reviews Analyzed)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    NLP entity extraction categorizes complaints and tags recurring patterns across public review channels.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-red-600">71% Negative Sentiment</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {store.reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{rev.source}</span>
                        <span className="text-amber-500">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                        {rev.isRecurringIssue && (
                          <span className="bg-red-100 text-red-700 border border-red-200 text-[10px] font-bold px-1.5 py-0.2 rounded">
                            Recurring Pattern
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 text-[11px]">{rev.timestamp}</span>
                    </div>

                    <p className="text-slate-700 italic">"{rev.text}"</p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-200 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Category: <strong className="text-indigo-700">{rev.extractedCategory}</strong></span>
                        <span>•</span>
                        <span className="text-slate-500">Sentiment: <strong className="text-red-600">Negative ({rev.sentimentScore})</strong></span>
                      </div>
                      <span className="uppercase font-bold text-red-600">Severity: {rev.severity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT HISTORY & RECURRING VIOLATIONS */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Historical Physical Audits & Recurring Failure Timeline
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Inspection Intelligence Agent correlates historical failure logs across Jan, Mar, and May 2026.
                  </p>
                </div>
                <span className="bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-2.5 py-1 rounded-lg">
                  3rd Consecutive Failure
                </span>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-200 space-y-5 my-3">
                {store.inspections.map((insp) => (
                  <div key={insp.id} className="relative">
                    <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-red-500 ring-4 ring-white"></span>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{insp.date} Audit</span>
                          <span className="text-slate-500">Auditor: {insp.auditorName}</span>
                        </div>
                        <span className="font-bold text-red-600 text-sm">Score: {insp.score}/100 (Failed)</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 my-1">
                        {insp.violationsFound.map((v, i) => (
                          <span key={i} className="bg-red-50 border border-red-200 text-red-700 text-[11px] px-2 py-0.5 rounded font-semibold">
                            🚨 {v}
                          </span>
                        ))}
                      </div>

                      <p className="text-slate-600 text-[11px]">{insp.notes}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Corrective Actions Status */}
              <div className="pt-3 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Tracked Corrective Action Plans</h4>
                <div className="space-y-2">
                  {store.correctiveActions.map((ca) => (
                    <div key={ca.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{ca.title}</span>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Assigned: {ca.assignedTo} • Due: {ca.dueDate}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        ca.status === 'Overdue' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ca.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: POS & BUSINESS METRICS */}
          {activeTab === 'pos' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Point-of-Sale Anomaly Detection & Financial Health
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Business signals correlate operational degradation with customer retention and revenue loss.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-slate-500 text-xs font-medium">Weekly Revenue</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">${store.posMetrics.weeklyRevenue.toLocaleString()}</div>
                  <div className="text-xs text-red-600 flex items-center gap-1 mt-1 font-bold">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>{store.posMetrics.revenueChangePct}% vs Prior 4-Wk Avg</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-slate-500 text-xs font-medium">Avg Ticket Prep Time</span>
                  <div className="text-xl font-bold text-amber-700 mt-1">{store.posMetrics.avgTicketTimeSec} sec</div>
                  <div className="text-xs text-slate-400 mt-1">Target: &lt;180 sec</div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-slate-500 text-xs font-medium">Quarterly Staff Turnover</span>
                  <div className="text-xl font-bold text-red-600 mt-1">{store.posMetrics.staffTurnoverRate}%</div>
                  <div className="text-xs text-slate-400 mt-1">Industry benchmark: 22%</div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-slate-500 text-xs font-medium">Food Waste Ratio</span>
                  <div className="text-xl font-bold text-amber-700 mt-1">{store.posMetrics.wastePercentage}%</div>
                  <div className="text-xs text-slate-400 mt-1">Allowable target: &lt;3.5%</div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-xs">
                  <span className="text-slate-500 text-xs font-medium">CSAT Score</span>
                  <div className="text-xl font-bold text-red-600 mt-1">{store.posMetrics.customerSatisfactionScore}/100</div>
                  <div className="text-xs text-red-600 mt-1 font-semibold">Critical threshold breach</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CURE NOTICE PREVIEW */}
          {activeTab === 'cure_notice' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-red-600">
                    Formal Legal 14-Day Cure Notice (AI Generated Document)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ready for Human Franchise Manager signature and certified electronic dispatch.
                  </p>
                </div>
                <button
                  onClick={handleGenerateNotice}
                  disabled={isGeneratingNotice}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-indigo-700 font-bold px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
                >
                  {isGeneratingNotice ? 'Regenerating...' : 'Regenerate Notice'}
                </button>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[360px] overflow-y-auto shadow-inner">
                {cureNoticeContent || 'Click "Formal 14-Day Cure Notice" tab to generate official legal document...'}
              </div>
            </div>
          )}
        </div>

        {/* HUMAN-IN-THE-LOOP DECISION BAR (FOOTER) */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 shrink-0 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <span className="font-bold text-slate-900 uppercase text-[11px] bg-slate-200 px-2 py-0.5 rounded">
                AI Recommendation:
              </span>
              <span className="font-bold text-amber-800">{store.aiRecommendation}</span>
            </div>

            {/* Manager Note Input */}
            <input
              type="text"
              placeholder="Optional manager note / audit directive..."
              value={managerNote}
              onChange={(e) => setManagerNote(e.target.value)}
              className="bg-white border border-slate-200 text-xs text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 w-full sm:w-72"
            />
          </div>

          {/* Action Decision Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
            <button
              id="btn-reject-action"
              onClick={handleReject}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors border border-slate-200 shadow-xs"
            >
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Dismiss Flag</span>
            </button>

            <button
              id="btn-investigate-action"
              onClick={handleInvestigate}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-amber-700" />
              <span>Request More Evidence</span>
            </button>

            <button
              id="btn-approve-inspection"
              onClick={() => handleApprove('physical_inspection')}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Check className="w-4 h-4 text-white" />
              <span>Approve Immediate Physical Audit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
