import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Camera, 
  MessageSquareQuote, 
  History, 
  ShieldAlert, 
  CheckCircle2, 
  AlertOctagon, 
  UserCheck, 
  Network, 
  Play, 
  RotateCcw,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LiveDemoWalkthroughProps {
  onInspectStore: (storeNumber: number) => void;
  onNavigateTab: (tab: any) => void;
}

export const LiveDemoWalkthrough: React.FC<LiveDemoWalkthroughProps> = ({
  onInspectStore,
  onNavigateTab,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isApproved, setIsApproved] = useState<boolean>(false);

  const steps = [
    {
      step: 1,
      title: 'Multimodal Photo Stream Ingestion',
      subtitle: 'Computer Vision Agent flags floor grease and uniform lapse',
      icon: Camera,
    },
    {
      step: 2,
      title: 'Customer Review NLP Sentiment Stream',
      subtitle: 'NLP Agent extracts recurring cleanliness and service complaints',
      icon: MessageSquareQuote,
    },
    {
      step: 3,
      title: 'Historical Audit Recurrence Correlation',
      subtitle: 'Correlates failure logs from Jan, Mar, and May 2026',
      icon: History,
    },
    {
      step: 4,
      title: 'Composite Risk Calculation (91/100)',
      subtitle: 'Mathematical weight distribution across 5 risk dimensions',
      icon: ShieldAlert,
    },
    {
      step: 5,
      title: 'AI Synthesis & Audit Recommendation',
      subtitle: 'Synthesizes executive explanation and audit directive',
      icon: Sparkles,
    },
    {
      step: 6,
      title: 'Human-in-the-Loop Approval',
      subtitle: 'Franchise Manager executes legal inspection directive',
      icon: UserCheck,
    },
    {
      step: 7,
      title: 'Cross-Location Systemic Discovery',
      subtitle: 'AI identifies supplier defect across 14 other locations',
      icon: Network,
    },
  ];

  const handleApproveInDemo = () => {
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
    });
    setIsApproved(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
              INTERACTIVE SCENARIO
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Live Walkthrough: Store #247 (FreshBite Downtown Metro)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Experience the complete end-to-end FranchiseGuard AI workflow — from initial photo ingestion to cross-location fleet pattern detection.
          </p>
        </div>

        <button
          onClick={() => {
            setCurrentStep(1);
            setIsApproved(false);
          }}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 transition-colors shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart Walkthrough</span>
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = currentStep === s.step;
          const isPassed = currentStep > s.step;
          return (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                  : isPassed
                  ? 'bg-indigo-50/60 border-indigo-200 text-slate-700'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[10px] font-extrabold uppercase">Step {s.step}</span>
                {isPassed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                )}
              </div>
              <span className="text-xs font-bold line-clamp-1">{s.title.split(' ')[0]} {s.title.split(' ')[1]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage for Current Step */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl min-h-[420px] flex flex-col justify-between space-y-6 shadow-sm">
        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase text-indigo-700">Step 1 of 7</span>
                <h2 className="text-lg font-bold text-slate-900">Multimodal Computer Vision Analysis</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Store #247 uploaded a routine closing photo via mobile auditor app.
                </p>
              </div>
              <span className="text-xs font-bold bg-red-50 text-red-700 px-2.5 py-1 rounded border border-red-200">
                2 Violations Detected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[4/3] shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
                  alt="Kitchen audit"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Bounding boxes */}
                <div className="absolute top-[48%] left-[22%] w-[45%] h-[32%] border-2 border-red-500 bg-red-500/20 rounded p-1">
                  <span className="bg-red-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow-sm">
                    Tile Floor Grease Buildup (94.2%)
                  </span>
                </div>
                <div className="absolute top-[18%] left-[62%] w-[26%] h-[24%] border-2 border-red-500 bg-red-500/20 rounded p-1">
                  <span className="bg-red-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow-sm">
                    Missing Hairnet (91.8%)
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs shadow-xs">
                  <span className="font-bold text-red-700">🚨 Severe Tile Floor Grease Buildup (94.2% confidence)</span>
                  <p className="text-slate-600 text-[11px]">Infraction of SOP Standard Clause 101.4: Kitchen slip hazards.</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs shadow-xs">
                  <span className="font-bold text-red-700">🚨 Line Staff Missing Hair Restraint (91.8% confidence)</span>
                  <p className="text-slate-600 text-[11px]">Infraction of SOP Standard Clause 401.1: Hygiene & Grooming.</p>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 font-medium">
                  ⚡ <strong>Score Impact:</strong> +20 points added to Location Risk Index.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <span className="text-xs font-extrabold uppercase text-indigo-700">Step 2 of 7</span>
              <h2 className="text-lg font-bold text-slate-900">NLP Review Intelligence Stream Correlated</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Public customer complaints matched against visual kitchen findings in real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs shadow-xs">
                <span className="text-amber-800 font-bold">Google Maps Review (1 Star) — 18 mins ago</span>
                <p className="text-slate-700 italic leading-relaxed">
                  "The food was good but the restaurant was very dirty. Tables had grease stains and the floor near the kitchen was slippery as ice."
                </p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-indigo-700 font-semibold">Category: Cleanliness & Slip Hazard</span>
                  <span className="text-red-700 font-bold">Sentiment: -0.92</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs shadow-xs">
                <span className="text-amber-800 font-bold">Yelp Review (2 Stars) — 3 days ago</span>
                <p className="text-slate-700 italic leading-relaxed">
                  "Took 25 minutes for mobile pickup. Prep staff was not wearing hairnets and counters looked sticky."
                </p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-indigo-700 font-semibold">Category: Hygiene & Staff Behavior</span>
                  <span className="text-red-700 font-bold">Sentiment: -0.85</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 font-medium">
              ⚡ <strong>Cross-Validation:</strong> AI verifies customer feedback directly matches visual camera findings. (+15 points risk weight).
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <span className="text-xs font-extrabold uppercase text-indigo-700">Step 3 of 7</span>
              <h2 className="text-lg font-bold text-slate-900">Historical Recurrence Engine Analysis</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Analyzing inspection audit archives to detect chronic compliance failure patterns.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 border border-red-200 rounded-xl flex items-center justify-between text-xs shadow-xs">
                <div>
                  <span className="font-bold text-slate-900">January 2026 Audit (Score: 68/100)</span>
                  <p className="text-slate-500 text-[11px]">Cited: Fryer floor grease buildup & storage obstructions.</p>
                </div>
                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold text-[10px]">FAILED</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-red-200 rounded-xl flex items-center justify-between text-xs shadow-xs">
                <div>
                  <span className="font-bold text-slate-900">March 2026 Audit (Score: 64/100)</span>
                  <p className="text-slate-500 text-[11px]">Cited: Recurring fryer grease & staff grooming non-compliance.</p>
                </div>
                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold text-[10px]">FAILED (2nd Time)</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-red-200 rounded-xl flex items-center justify-between text-xs shadow-xs">
                <div>
                  <span className="font-bold text-slate-900">May 2026 Audit (Score: 61/100)</span>
                  <p className="text-slate-500 text-[11px]">Cited: 3rd Consecutive Failure. Overdue corrective action plan (86 days).</p>
                </div>
                <span className="bg-red-600 text-white px-2 py-0.5 rounded font-bold text-[10px]">CRITICAL RECURRENCE</span>
              </div>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-medium">
              ⚡ <strong>Chronic Pattern Multiplier:</strong> +25 points for repeated unaddressed violations across 3 quarters.
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <span className="text-xs font-extrabold uppercase text-indigo-700">Step 4 of 7</span>
              <h2 className="text-lg font-bold text-slate-900">Risk Scoring Engine Synthesis: 91 / 100</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Transparent multi-factor scoring formula executed in 45 milliseconds.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between text-xs shadow-xs">
                <span className="text-slate-500 font-medium">Photo Violations</span>
                <span className="text-xl font-bold text-red-600">+20</span>
                <span className="text-[10px] text-slate-400">2 CV flags</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between text-xs shadow-xs">
                <span className="text-slate-500 font-medium">Customer Reviews</span>
                <span className="text-xl font-bold text-amber-600">+15</span>
                <span className="text-[10px] text-slate-400">7 complaints</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between text-xs shadow-xs">
                <span className="text-slate-500 font-medium">Repeat Failure</span>
                <span className="text-xl font-bold text-red-600">+25</span>
                <span className="text-[10px] text-slate-400">3 audits</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between text-xs shadow-xs">
                <span className="text-slate-500 font-medium">POS Sales Drop</span>
                <span className="text-xl font-bold text-amber-600">+10</span>
                <span className="text-[10px] text-slate-400">-18.2% trend</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between text-xs shadow-xs">
                <span className="text-slate-500 font-medium">Overdue Action</span>
                <span className="text-xl font-bold text-red-600">+20</span>
                <span className="text-[10px] text-slate-400">86 days overdue</span>
              </div>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs shadow-xs">
              <div>
                <span className="font-bold text-slate-900 text-sm">Total Composite Score: 91 / 100</span>
                <p className="text-red-800 text-[11px] mt-0.5 font-medium">Categorized as Tier 1 Critical Risk (Threshold &gt;= 90)</p>
              </div>
              <span className="bg-red-600 text-white font-extrabold px-3 py-1 rounded-lg text-sm shadow-xs">
                CRITICAL
              </span>
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <span className="text-xs font-extrabold uppercase text-indigo-700">Step 5 of 7</span>
              <h2 className="text-lg font-bold text-slate-900">AI Executive Explanation & Recommendation</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                AI synthesizes natural language rationale for executive franchise leadership.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs shadow-xs">
              <div className="flex items-center gap-2 text-indigo-700 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Executive Synthesis Rationale</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                "Store #247 presents critical brand compliance risk due to chronic grease build-up under primary fryer equipment and repeated staff hygiene lapses. These infractions correlate directly with 7 negative customer sentiment spikes in the last 30 days and 3 consecutive audit failures. An unresolved corrective action remains open for 86 days."
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs shadow-xs">
              <span className="font-bold text-amber-800 uppercase text-[10px]">AI Strategic Recommendation</span>
              <p className="text-slate-900 font-semibold text-sm">
                "Schedule an immediate unannounced physical inspection and issue a formal 14-day legal cure notice."
              </p>
            </div>
          </div>
        )}

        {/* STEP 6 */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <span className="text-xs font-extrabold uppercase text-indigo-700">Step 6 of 7</span>
              <h2 className="text-lg font-bold text-slate-900">Human-in-the-Loop Supervisory Governance</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                The AI does not unilaterally punish franchisees. A human Franchise Compliance Manager reviews and executes the decision.
              </p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
              <div className="space-y-1 text-xs">
                <h3 className="font-bold text-slate-900 text-sm">Store #247 Immediate Inspection Order</h3>
                <p className="text-slate-500">Dispatch regional compliance auditor Marcus Vance for 24-hour on-site inspection.</p>
              </div>

              {isApproved ? (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-xs font-bold shadow-xs">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Approved & Dispatched by Human Manager</span>
                </div>
              ) : (
                <button
                  id="btn-demo-approve-action"
                  onClick={handleApproveInDemo}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Click to Approve Physical Inspection</span>
                </button>
              )}
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center justify-between shadow-xs">
              <span>Audit Log Record: <strong className="text-slate-800">EVT-9042</strong></span>
              <span className="text-emerald-700 font-bold">Cryptographically Recorded in Fleet Ledger</span>
            </div>
          </div>
        )}

        {/* STEP 7 */}
        {currentStep === 7 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <span className="text-xs font-extrabold uppercase text-amber-800">Bonus Step 7</span>
              <h2 className="text-lg font-bold text-slate-900">Cross-Location Fleet Anomaly Discovery</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                FranchiseGuard AI compares Store #247 with 500 locations and identifies a nationwide supplier defect.
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3 text-xs shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 text-sm">
                  Systemic Equipment Defect Detected across 14 Stores
                </span>
                <span className="bg-amber-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                  PAT-001
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                "Store #247's cooler failure is NOT an isolated employee mistake. 14 franchise stores equipped with TrueCold X-400 refrigeration units installed in Q1 2026 exhibit the exact same magnetic door gasket leak."
              </p>
              <div className="pt-2 border-t border-amber-200 flex items-center justify-between text-[11px] text-amber-900 font-medium">
                <span>Estimated Fleet Food Loss Prevented: <strong>$180,000</strong></span>
                <span>Root Cause: ArcticSupply OEM Manufacturer Batch #992</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigateTab('cross_location')}
                className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <span>Open Cross-Location Anomaly Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onInspectStore(247)}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
              >
                <span>Inspect Store #247 Modal</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs text-slate-500 font-medium">
            Step {currentStep} of {steps.length}
          </span>

          <button
            onClick={() => setCurrentStep((s) => Math.min(steps.length, s + 1))}
            disabled={currentStep === steps.length}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold disabled:opacity-30 transition-colors cursor-pointer shadow-xs"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
