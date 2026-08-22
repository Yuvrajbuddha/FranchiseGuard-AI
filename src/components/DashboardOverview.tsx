import React from 'react';
import { 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw,
  Search,
  Eye,
  MapPin,
  Sparkles,
  Camera,
  Video,
  Plus
} from 'lucide-react';
import { FranchiseStore, SystemicPattern, FranchiseBrand } from '../types/franchise';

interface DashboardOverviewProps {
  stores: FranchiseStore[];
  systemicPatterns: SystemicPattern[];
  auditLogs?: any[];
  brand: FranchiseBrand;
  onSelectStore: (storeNumber: number) => void;
  onNavigateTab: (tab: any) => void;
  onTriggerFleetScan: () => void;
  isScanning: boolean;
  onOpenCustomerUpload?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stores,
  brand,
  onSelectStore,
  onNavigateTab,
  onTriggerFleetScan,
  isScanning,
  onOpenCustomerUpload,
}) => {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [filterType, setFilterType] = React.useState<'all' | 'critical'>('all');

  const totalStores = stores.length;
  const criticalStores = stores.filter((s) => s.riskLevel === 'critical' || s.riskLevel === 'high');
  const lowRiskStores = stores.filter((s) => s.riskLevel === 'low');
  const complianceRate = Math.round((lowRiskStores.length / totalStores) * 100);

  // Top attention stores
  const priorityStores = stores
    .filter((s) => (filterType === 'critical' ? s.riskScore >= 75 : s.riskScore >= 60))
    .filter((s) => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.storeNumber.toString().includes(searchQuery) ||
      s.location.city.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Clean Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white p-6 sm:p-7 rounded-2xl shadow-sm border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-800/60 border border-emerald-600/40 text-emerald-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{brand.name} • {brand.headquarters}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Franchise Compliance Overview
            </h1>
            <p className="text-emerald-100/80 text-sm mt-1 max-w-lg">
              Continuous AI monitoring for store cleanliness, brand standards, customer photos, and video audits across all locations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenCustomerUpload && (
              <button
                id="btn-dashboard-customer-upload"
                onClick={onOpenCustomerUpload}
                className="flex items-center gap-2 bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-400/40 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Camera className="w-4 h-4 text-teal-300" />
                <span>+ Add Photo / Video</span>
              </button>
            )}

            <button
              id="btn-trigger-fleet-scan"
              onClick={onTriggerFleetScan}
              disabled={isScanning}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isScanning
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50 cursor-not-allowed'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 hover:shadow-md'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning Stores...' : 'Scan Fleet'}</span>
            </button>

            <button
              id="btn-goto-store247-demo"
              onClick={() => onSelectStore(247)}
              className="flex items-center gap-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors"
            >
              <span>Spotlight Store #247</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 High-Signal Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Stores */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Total Stores</span>
            <span className="text-3xl font-bold text-slate-900 mt-1 block">{totalStores}</span>
            <span className="text-xs text-teal-700 font-medium mt-1 inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Lucknow & UP Regions</span>
            </span>
          </div>
          <div className="p-3 bg-teal-50 text-teal-700 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Fleet Compliance */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Compliance Rate</span>
            <span className="text-3xl font-bold text-emerald-600 mt-1 block">{complianceRate}%</span>
            <span className="text-xs text-slate-500 mt-1 block">Brand Target: {brand.complianceTargetPct}%</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Needs Attention */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Needs Attention</span>
            <span className="text-3xl font-bold text-rose-600 mt-1 block">{criticalStores.length}</span>
            <span className="text-xs text-rose-600 font-semibold mt-1 block">Action required</span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Focus: Immediate Attention Store List */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Priority Stores Requiring Review</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Stores flagged by AI computer vision audits and customer complaints.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search store or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-teal-600 focus:bg-white w-44 transition-colors"
              />
            </div>

            <button
              onClick={() => onNavigateTab('stores')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200/60 px-3 py-1.5 rounded-xl transition-colors shrink-0"
            >
              View All Stores
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {priorityStores.map((store) => {
            const isCrit = store.riskLevel === 'critical';
            const isSpotlight = store.storeNumber === 247;
            return (
              <div
                key={store.id}
                id={`store-card-${store.storeNumber}`}
                onClick={() => onSelectStore(store.storeNumber)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSpotlight
                    ? 'bg-teal-50/60 border-teal-300 ring-1 ring-teal-200'
                    : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-bold shrink-0 text-xs ${
                      isCrit
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    <span className="text-sm font-black leading-none">{store.riskScore}</span>
                    <span className="text-[8px] uppercase font-bold tracking-tighter">RISK</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{store.name}</span>
                      {isSpotlight && (
                        <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          SPOTLIGHT
                        </span>
                      )}
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {store.location.city}, {store.location.region}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {store.mainIssue}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStore(store.storeNumber);
                    }}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-teal-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-teal-300" />
                    <span>Inspect Store</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Footer Links */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Click any store to open full inspection logs, AI vision photos, and formal cure notices.</span>
          <button
            onClick={() => onNavigateTab('human_loop')}
            className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 hover:underline"
          >
            <span>Open Action Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
