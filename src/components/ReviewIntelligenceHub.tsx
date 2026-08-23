import React, { useState } from 'react';
import { 
  MessageSquareQuote, 
  Sparkles, 
  Send, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  ThumbsDown, 
  ThumbsUp, 
  Filter, 
  Search, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { analyzeCustomerReview, ReviewAnalysisResult } from '../services/apiClient';

const SAMPLE_REVIEWS = [
  'The food was good but the restaurant was very dirty. Tables had grease stains and the floor was slippery.',
  'Waited 25 minutes for two burgers. The cashier was unhelpful and staff were not wearing hairnets.',
  'Second time this month the restroom had no hand soap and trash was overflowing into the hallway.',
  'Great crispy chicken wrap and fast service! Super clean dining area and friendly manager.',
  'The salad seemed warm and the soda dispenser smelled like stale mildew. Wont be coming back.',
];

export const ReviewIntelligenceHub: React.FC = () => {
  const [inputText, setInputText] = useState<string>(SAMPLE_REVIEWS[0]);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ReviewAnalysisResult | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');

  React.useEffect(() => {
    handleAnalyze();
  }, []);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setAnalyzing(true);
    try {
      const res = await analyzeCustomerReview({
        reviewText: inputText,
        storeNumber: 247,
        source: 'Interactive Review Tester',
      });
      setAnalysisResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const feedReviews = [
    {
      id: 'r-101',
      storeNumber: 247,
      storeName: 'Downtown Metro #247',
      source: 'Google Reviews',
      rating: 1,
      text: 'The food was decent but the entire restaurant was shockingly dirty. Sticky tables, grease all over the floor near pickup.',
      category: 'Cleanliness',
      severity: 'critical',
      sentimentScore: -0.92,
      isRecurring: true,
      time: '18 mins ago',
    },
    {
      id: 'r-102',
      storeNumber: 12,
      storeName: 'Northbrook Commons #12',
      source: 'Yelp',
      rating: 2,
      text: 'Yogurt parfaits were completely warm and melted. Freezer seems broken. Staff ignored complaints.',
      category: 'Equipment / Facilities',
      severity: 'high',
      sentimentScore: -0.78,
      isRecurring: true,
      time: '1 hour ago',
    },
    {
      id: 'r-103',
      storeNumber: 155,
      storeName: 'Indianapolis Central #155',
      source: 'App Feedback',
      rating: 2,
      text: 'Line cooks were preparing sandwiches with bare hands and no headwear. Hygiene standards have gone down.',
      category: 'Staff Behavior',
      severity: 'high',
      sentimentScore: -0.85,
      isRecurring: true,
      time: '2 hours ago',
    },
    {
      id: 'r-104',
      storeNumber: 312,
      storeName: 'Columbus Easton #312',
      source: 'Google Reviews',
      rating: 2,
      text: 'Sign was turned off at 8 PM. Looked closed. Took 15 minutes to take order.',
      category: 'Speed & Service',
      severity: 'medium',
      sentimentScore: -0.62,
      isRecurring: false,
      time: '3 hours ago',
    },
    {
      id: 'r-105',
      storeNumber: 52,
      storeName: 'Evanston Central #52',
      source: 'Google Reviews',
      rating: 5,
      text: 'Immaculate cleanliness, fast mobile pickup, and staff was super friendly. Best location in Illinois!',
      category: 'Food Quality',
      severity: 'low',
      sentimentScore: +0.94,
      isRecurring: false,
      time: '4 hours ago',
    },
  ];

  const filteredFeed = feedReviews
    .filter((r) => selectedCategoryFilter === 'All' || r.category === selectedCategoryFilter)
    .filter((r) => r.text.toLowerCase().includes(searchFilter.toLowerCase()) || r.storeName.toLowerCase().includes(searchFilter.toLowerCase()));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Review Intelligence & NLP Agent</h1>
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
              NLP Entity & Sentiment Extraction
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Continuous natural language parsing of Google Maps, Yelp, and customer care tickets to identify recurring operational infractions.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span><strong>71%</strong> Cleanliness-related complaints</span>
          </div>
        </div>
      </div>

      {/* Interactive NLP Testing Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Tester */}
        <div className="lg:col-span-6 bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Live NLP Review Analyzer</h2>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">NLP Intelligence Engine</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-700 font-semibold">Test Any Review or Customer Complaint:</label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or type a customer review here to analyze sentiment and categories..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white leading-relaxed"
            />
          </div>

          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-500 font-medium">Or pick a sample customer complaint:</span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_REVIEWS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(sample)}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] px-2.5 py-1 rounded-lg transition-colors text-left truncate max-w-[280px] cursor-pointer"
                >
                  "{sample.substring(0, 32)}..."
                </button>
              ))}
            </div>
          </div>

          <button
            id="btn-run-review-nlp"
            onClick={handleAnalyze}
            disabled={analyzing || !inputText.trim()}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Extracting NLP Entities...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Run NLP Classification Agent</span>
              </>
            )}
          </button>
        </div>

        {/* Right: NLP Output Card */}
        <div className="lg:col-span-6 bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">NLP Extraction Results</h3>
              {analysisResult && (
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    analysisResult.sentiment === 'negative'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  Sentiment: {analysisResult.sentiment.toUpperCase()} ({analysisResult.sentimentScore})
                </span>
              )}
            </div>

            {analysisResult ? (
              <div className="mt-3 space-y-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Extracted Category:</span>
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {analysisResult.extractedCategory}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Violation Severity:</span>
                    <span className={`font-bold uppercase ${
                      analysisResult.severity === 'critical' ? 'text-red-700' : 'text-amber-800'
                    }`}>
                      {analysisResult.severity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Recurring Issue Flag:</span>
                    <span className="font-bold text-red-700">
                      {analysisResult.isRecurringIssue ? '🚨 YES — Correlates with historical pattern' : 'No prior recurrence'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold uppercase text-slate-500">AI Risk Synthesis</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{analysisResult.summary}</p>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs mt-6">
                Click "Run NLP Classification Agent" to parse input text.
              </div>
            )}
          </div>

          <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center justify-between text-xs">
            <span className="text-indigo-950 font-medium">Integrated into Store Risk Score weight (+15 pts)</span>
            <span className="font-bold text-indigo-700">Real-time Hook</span>
          </div>
        </div>
      </div>

      {/* Fleet-wide Review Stream */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquareQuote className="w-4 h-4 text-indigo-600" />
              <span>Fleet Customer Review Intelligence Stream</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time incoming reviews aggregated across 500 franchise points of presence.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-indigo-500 focus:bg-white w-44"
              />
            </div>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 focus:bg-white"
            >
              <option value="All">All Categories</option>
              <option value="Cleanliness">Cleanliness</option>
              <option value="Staff Behavior">Staff Behavior</option>
              <option value="Equipment / Facilities">Equipment</option>
              <option value="Speed & Service">Speed & Service</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredFeed.map((rev) => (
            <div key={rev.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between space-y-3 text-xs shadow-xs hover:border-slate-300 transition-colors">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span className="font-bold text-indigo-700">{rev.storeName}</span>
                  <span>{rev.time}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-amber-500 text-xs">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{rev.source}</span>
                </div>
                <p className="text-slate-700 italic line-clamp-3">"{rev.text}"</p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="bg-white border border-slate-200 text-indigo-700 px-2 py-0.5 rounded font-semibold">
                  {rev.category}
                </span>
                <span className={`font-bold ${rev.severity === 'critical' ? 'text-red-700' : 'text-amber-800'}`}>
                  {rev.severity.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
