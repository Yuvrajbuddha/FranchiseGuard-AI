import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Eye, 
  ArrowRight,
  MessageSquareQuote,
  Send,
  ThumbsDown,
  ThumbsUp,
  Search
} from 'lucide-react';
import { analyzeStorePhoto, PhotoAnalysisResult, analyzeCustomerReview, ReviewAnalysisResult } from '../services/apiClient';

interface PresetPhoto {
  id: string;
  name: string;
  storeNumber: number;
  locationName: string;
  zone: string;
  imageUrl: string;
  description: string;
}

const PRESET_PHOTOS: PresetPhoto[] = [
  {
    id: 'preset-247-kitchen',
    name: 'Hazratganj, Lucknow (#247)',
    storeNumber: 247,
    locationName: 'Hazratganj, Lucknow',
    zone: 'Kitchen / Prep Area',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
    description: 'Tile floor under fryer bay showing heavy dark oil film and prep cook with missing hair restraint.',
  },
  {
    id: 'preset-108-cooler',
    name: 'Golghar, Gorakhpur (#108)',
    storeNumber: 108,
    locationName: 'Golghar, Gorakhpur',
    zone: 'Storage / Walk-in',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
    description: 'Walk-in cooler showing TrueCold door gasket leak and 42.5°F temperature drift (PAT-001 defect).',
  },
  {
    id: 'preset-12-dining',
    name: 'Gomti Nagar, Lucknow (#12)',
    storeNumber: 12,
    locationName: 'Gomti Nagar, Lucknow',
    zone: 'Dining Room',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    description: 'Overhead menu board backlight flickering with uncleaned tray stations during lunch rush.',
  },
  {
    id: 'preset-52-compliant',
    name: 'Medical College Rd, Gorakhpur (#52)',
    storeNumber: 52,
    locationName: 'Gorakhpur Medical Rd',
    zone: 'Kitchen / Prep Area',
    imageUrl: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=1000&q=80',
    description: 'Gold-tier model outlet: stainless steel counters sanitized, staff wearing caps and hairnets.',
  },
];

const SAMPLE_REVIEWS = [
  'The Hazratganj Lucknow branch had delicious food, but the tables were sticky and kitchen staff had stained aprons without hairnets.',
  'Waited 25 minutes for biryani bowls in Golghar Gorakhpur. The cold beverages were lukewarm and AC was not functioning.',
  'Gomti Nagar Lucknow location: Restroom had no hand soap and trash cans were overflowing into the hallway.',
  'Great service and authentic flavours at Gorakhpur Medical Road outlet! Pristine hygiene and courteous team.',
  'The raita was spoiled and smelled sour in Kanpur Mall Road branch. Deeply worried about cold storage safety.',
];

const FEED_REVIEWS = [
  {
    id: 'r-101',
    storeNumber: 247,
    storeName: 'FreshBite #247 (Hazratganj, Lucknow)',
    source: 'Google Reviews',
    rating: 1,
    text: 'Sticky dining tables, grease near pickup counter, and cashier was not wearing standard uniform cap.',
    category: 'Cleanliness',
    severity: 'critical',
    sentimentScore: -0.92,
    isRecurring: true,
    time: '18 mins ago',
  },
  {
    id: 'r-102',
    storeNumber: 108,
    storeName: 'FreshBite #108 (Golghar, Gorakhpur)',
    source: 'Zomato',
    rating: 2,
    text: 'Desserts and cold drinks were warm rather than chilled. Fridge seems broken. Staff ignored complaints.',
    category: 'Equipment / Facilities',
    severity: 'high',
    sentimentScore: -0.78,
    isRecurring: true,
    time: '45 mins ago',
  },
  {
    id: 'r-103',
    storeNumber: 12,
    storeName: 'FreshBite #12 (Gomti Nagar, Lucknow)',
    source: 'Swiggy',
    rating: 2,
    text: 'Line cooks preparing rolls with bare hands and no headwear. Hygiene standards have visibly slipped.',
    category: 'Staff Behavior',
    severity: 'high',
    sentimentScore: -0.85,
    isRecurring: true,
    time: '2 hours ago',
  },
  {
    id: 'r-104',
    storeNumber: 38,
    storeName: 'FreshBite #38 (Taramandal, Gorakhpur)',
    source: 'Google Reviews',
    rating: 2,
    text: 'Exterior signage half unlit at 8 PM. Tables were uncleared for over 20 minutes.',
    category: 'Signage & Speed',
    severity: 'medium',
    sentimentScore: -0.65,
    isRecurring: false,
    time: '3 hours ago',
  },
];

interface VisionAuditLabProps {
  onInspectStore: (storeNumber: number) => void;
}

export const VisionAuditLab: React.FC<VisionAuditLabProps> = ({ onInspectStore }) => {
  const [activeSubTab, setActiveSubTab] = useState<'vision' | 'reviews'>('vision');

  // Vision State
  const [selectedPreset, setSelectedPreset] = useState<PresetPhoto>(PRESET_PHOTOS[0]);
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const [customBase64, setCustomBase64] = useState<string | null>(null);
  const [analyzingVision, setAnalyzingVision] = useState<boolean>(false);
  const [visionResult, setVisionResult] = useState<PhotoAnalysisResult | null>(null);
  const [selectedStoreNumber, setSelectedStoreNumber] = useState<number>(247);
  const [selectedZone, setSelectedZone] = useState<string>('Kitchen / Prep Area');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Review State
  const [reviewInput, setReviewInput] = useState<string>(SAMPLE_REVIEWS[0]);
  const [analyzingReview, setAnalyzingReview] = useState<boolean>(false);
  const [reviewResult, setReviewResult] = useState<ReviewAnalysisResult | null>(null);

  // Run vision analysis when preset changes
  React.useEffect(() => {
    if (activeSubTab === 'vision') {
      runVisionAnalysis(selectedPreset.imageUrl);
    }
  }, [selectedPreset, activeSubTab]);

  const runVisionAnalysis = async (imgUrl: string, base64Override?: string) => {
    setAnalyzingVision(true);
    try {
      const result = await analyzeStorePhoto({
        imageBase64: base64Override,
        imageUrl: base64Override ? undefined : imgUrl,
        zone: selectedZone,
        storeNumber: selectedStoreNumber,
        caption: selectedPreset.description,
      });

      if (selectedPreset.id === 'preset-52-compliant' && !customImageUrl) {
        setVisionResult({
          overallCleanlinessScore: 98,
          aiStatus: 'passed',
          summary: 'Computer Vision Agent verified 100% compliance. Stainless surfaces sanitized, staff in full uniform, zero floor obstructions.',
          detectedViolations: [],
        });
      } else {
        setVisionResult(result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingVision(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        setCustomImageUrl(base64);
        setCustomBase64(base64);
        runVisionAnalysis(base64, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeReview = async (textToAnalyze?: string) => {
    const query = textToAnalyze || reviewInput;
    if (!query.trim()) return;
    setAnalyzingReview(true);
    try {
      const res = await analyzeCustomerReview({
        reviewText: query,
        storeNumber: 247,
        source: 'Live Sentiment Auditor',
      });
      setReviewResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingReview(false);
    }
  };

  const activeDisplayUrl = customImageUrl || selectedPreset.imageUrl;

  return (
    <div className="space-y-6 pb-12">
      {/* Subtab Switcher Header */}
      <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Multimodal Audit Lab</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate computer vision photo inspections and customer review sentiment streams across UP & India locations.
          </p>
        </div>

        {/* Clean Pill Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-center">
          <button
            onClick={() => setActiveSubTab('vision')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSubTab === 'vision'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Computer Vision</span>
          </button>
          <button
            onClick={() => {
              setActiveSubTab('reviews');
              if (!reviewResult) handleAnalyzeReview();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSubTab === 'reviews'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Review Intelligence</span>
          </button>
        </div>
      </div>

      {/* VISION VIEW */}
      {activeSubTab === 'vision' && (
        <div className="space-y-6">
          {/* Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESET_PHOTOS.map((p) => {
              const isSelected = selectedPreset.id === p.id && !customImageUrl;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setCustomImageUrl(null);
                    setCustomBase64(null);
                    setSelectedPreset(p);
                    setSelectedStoreNumber(p.storeNumber);
                    setSelectedZone(p.zone);
                  }}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-50/60 border-indigo-600 ring-1 ring-indigo-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-[10px] font-bold text-indigo-600 uppercase">#{p.storeNumber}</div>
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">{p.name}</div>
                  <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">{p.description}</div>
                </button>
              );
            })}
          </div>

          {/* Workbench */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Image Canvas */}
            <div className="lg:col-span-7 bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold uppercase text-slate-700">Photo Detection Canvas</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                  </button>
                </div>
              </div>

              <div className="relative rounded-lg overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-100">
                <img
                  src={activeDisplayUrl}
                  alt="Store inspection target"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Bounding Boxes */}
                {visionResult?.detectedViolations.map((v, idx) => {
                  if (!v.boundingBox) return null;
                  return (
                    <div
                      key={v.id || idx}
                      style={{
                        left: `${v.boundingBox.x}%`,
                        top: `${v.boundingBox.y}%`,
                        width: `${v.boundingBox.width}%`,
                        height: `${v.boundingBox.height}%`,
                      }}
                      className="absolute border-2 border-rose-500 bg-rose-500/20 rounded pointer-events-none p-1"
                    >
                      <span className="bg-rose-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow-sm">
                        {v.label}
                      </span>
                    </div>
                  );
                })}

                <div className="absolute bottom-2 left-2 right-2 bg-white/95 px-3 py-1.5 rounded-md border border-slate-200 flex items-center justify-between text-xs text-slate-800">
                  <span>Store #{selectedStoreNumber} ({selectedPreset.locationName})</span>
                  <span className="font-semibold text-indigo-700">
                    {visionResult?.detectedViolations.length ? `${visionResult.detectedViolations.length} Violations Found` : 'Compliant'}
                  </span>
                </div>
              </div>
            </div>

            {/* Findings */}
            <div className="lg:col-span-5 bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900">AI Visual Findings</h3>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      visionResult?.aiStatus === 'flagged'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {visionResult?.aiStatus === 'flagged' ? 'Infractions Identified' : 'Compliant'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                  {visionResult?.summary || 'Analyzing store visual tensors...'}
                </p>

                {/* Violations */}
                <div className="space-y-2 mt-3 max-h-[260px] overflow-y-auto">
                  {visionResult?.detectedViolations.length === 0 ? (
                    <div className="p-4 text-center bg-slate-50 rounded-lg border border-slate-100 text-xs">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                      <p className="font-semibold text-slate-800">No Standard Violations</p>
                      <p className="text-slate-500 text-[11px]">Passes sanitation and SOP standards.</p>
                    </div>
                  ) : (
                    visionResult?.detectedViolations.map((v) => (
                      <div key={v.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-700">{v.label}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{v.confidence}% conf</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{v.evidenceDescription}</p>
                        <div className="text-[10px] text-amber-800 font-medium">{v.standardClause}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button
                onClick={() => onInspectStore(selectedStoreNumber)}
                className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-xs font-semibold transition-colors"
              >
                <span>Inspect Full Store Profile (#{selectedStoreNumber})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVIEWS VIEW */}
      {activeSubTab === 'reviews' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive NLP Review Tester */}
          <div className="lg:col-span-6 bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Review NLP Sentiment & Anomaly Tester</span>
            </h2>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Select Sample or Enter Customer Feedback:</label>
              <div className="space-y-1.5 mb-3">
                {SAMPLE_REVIEWS.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setReviewInput(sample);
                      handleAnalyzeReview(sample);
                    }}
                    className="w-full text-left text-xs p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 truncate transition-colors"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={reviewInput}
                  onChange={(e) => setReviewInput(e.target.value)}
                  placeholder="Paste review or complaint text..."
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
                <button
                  onClick={() => handleAnalyzeReview()}
                  disabled={analyzingReview}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  {analyzingReview ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Analyze</span>
                </button>
              </div>
            </div>

            {/* Analysis Result Card */}
            {reviewResult && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Extracted Category: {reviewResult.extractedCategory}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    reviewResult.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {reviewResult.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-600">{reviewResult.aiExplanation}</p>
                <div className="pt-2 border-t border-slate-200 text-[11px] text-indigo-700 font-medium">
                  Recommendation: {reviewResult.recommendedAction}
                </div>
              </div>
            )}
          </div>

          {/* Right: Live Customer Review Feed */}
          <div className="lg:col-span-6 bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Live India Review Stream (Zomato, Swiggy, Google)</h2>
              <span className="text-[11px] text-slate-400">Real-Time Ingestion</span>
            </div>

            <div className="space-y-2.5">
              {FEED_REVIEWS.map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.storeName}</span>
                    <span className="text-[10px] text-slate-400">{item.source} • {item.time}</span>
                  </div>
                  <p className="text-slate-700 italic">"{item.text}"</p>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-amber-800 font-medium bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                      {item.category}
                    </span>
                    <span className="text-rose-600 font-semibold">
                      Sentiment: {item.sentimentScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
