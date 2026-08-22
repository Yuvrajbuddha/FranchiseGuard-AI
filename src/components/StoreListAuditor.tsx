import React, { useState } from 'react';
import { 
  Store, 
  Search, 
  ChevronRight, 
  ChevronLeft,
  MapPin,
  Eye,
  Sparkles
} from 'lucide-react';
import { FranchiseStore } from '../types/franchise';

interface StoreListAuditorProps {
  stores: FranchiseStore[];
  onSelectStore: (storeNumber: number) => void;
}

export const StoreListAuditor: React.FC<StoreListAuditorProps> = ({ stores, onSelectStore }) => {
  const [search, setSearch] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'risk_desc' | 'risk_asc' | 'store_num'>('risk_desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  const filteredStores = stores
    .filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.storeNumber.toString().includes(search) ||
        s.location.city.toLowerCase().includes(search.toLowerCase()) ||
        s.location.state.toLowerCase().includes(search.toLowerCase());
      const matchRegion = regionFilter === 'All' || s.location.region === regionFilter;
      const matchRisk = riskFilter === 'All' || s.riskLevel === riskFilter;
      return matchSearch && matchRegion && matchRisk;
    })
    .sort((a, b) => {
      if (sortBy === 'risk_desc') return b.riskScore - a.riskScore;
      if (sortBy === 'risk_asc') return a.riskScore - b.riskScore;
      return a.storeNumber - b.storeNumber;
    });

  const totalPages = Math.ceil(filteredStores.length / itemsPerPage);
  const currentStores = filteredStores.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-10">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Franchise Store Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse all 500 franchise locations across Lucknow, Gorakhpur, and other regions.
          </p>
        </div>

        <div className="text-xs font-semibold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-100 shrink-0 self-start sm:self-auto">
          {filteredStores.length} Stores Listed
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by store number, city, or name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={regionFilter}
            onChange={(e) => {
              setRegionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-lg px-2.5 py-2 focus:outline-none focus:border-teal-600 focus:bg-white"
          >
            <option value="All">All Regions</option>
            <option value="Central">Central (Lucknow)</option>
            <option value="East">East (Gorakhpur)</option>
            <option value="North">North</option>
            <option value="Metro">Metro</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-lg px-2.5 py-2 focus:outline-none focus:border-teal-600 focus:bg-white"
          >
            <option value="All">All Risk Levels</option>
            <option value="critical">Critical (90+)</option>
            <option value="high">High (60-89)</option>
            <option value="medium">Medium (30-59)</option>
            <option value="low">Compliant (0-29)</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium rounded-lg px-2.5 py-2 focus:outline-none focus:border-teal-600 focus:bg-white"
          >
            <option value="risk_desc">Highest Risk First</option>
            <option value="risk_asc">Lowest Risk First</option>
            <option value="store_num">Store Number</option>
          </select>
        </div>
      </div>

      {/* Clean Grid of Stores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentStores.map((store) => {
          const isCrit = store.riskLevel === 'critical';
          const isHigh = store.riskLevel === 'high';
          const isSpotlight = store.storeNumber === 247;
          return (
            <div
              key={store.id}
              onClick={() => onSelectStore(store.storeNumber)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 bg-white shadow-xs ${
                isSpotlight
                  ? 'border-teal-400 bg-teal-50/40 ring-1 ring-teal-200'
                  : 'border-slate-200 hover:border-teal-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900">{store.name}</h3>
                      {isSpotlight && (
                        <span className="bg-rose-100 text-rose-700 text-[9px] font-bold px-1.5 py-0.2 rounded">
                          SPOTLIGHT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {store.location.city}, {store.location.state}
                    </p>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-lg flex flex-col items-center justify-center font-bold shrink-0 ${
                      isCrit
                        ? 'bg-rose-100 text-rose-700'
                        : isHigh
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    <span className="text-xs font-bold leading-none">{store.riskScore}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                  {store.mainIssue}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  {store.recentViolationsCount} flags • {store.negativeReviewsCount30d} complaints
                </span>
                <span className="text-teal-700 font-bold flex items-center gap-1 hover:text-teal-800">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Clean Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white border border-slate-200 px-4 py-3 rounded-xl text-xs shadow-xs">
          <span className="text-slate-500">
            Page <strong className="text-slate-800">{currentPage}</strong> of <strong className="text-slate-800">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 rounded-lg border border-slate-200 text-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-700 px-2 font-bold">{currentPage}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 rounded-lg border border-slate-200 text-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
