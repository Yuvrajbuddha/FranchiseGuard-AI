import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  Line,
  ComposedChart
} from 'recharts';
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  DollarSign, 
  BarChart3, 
  PieChart as PieIcon, 
  ArrowUpRight, 
  FileText, 
  MapPin, 
  RefreshCw,
  Search,
  Filter,
  Activity,
  Flame,
  Zap,
  Target,
  Clock,
  ArrowRight,
  ShieldCheck,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { FranchiseStore, FranchiseBrand, SystemicPattern } from '../types/franchise';

interface OwnerAnalyticsDashboardProps {
  stores: FranchiseStore[];
  brand: FranchiseBrand;
  systemicPatterns: SystemicPattern[];
  onSelectStore: (storeNumber: number) => void;
  onTriggerFleetScan: () => void;
  isScanning: boolean;
}

export const OwnerAnalyticsDashboard: React.FC<OwnerAnalyticsDashboardProps> = ({
  stores,
  brand,
  systemicPatterns,
  onSelectStore,
  onTriggerFleetScan,
  isScanning,
}) => {
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('All');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeChartTab, setActiveChartTab] = useState<'regional' | 'revenue' | 'categories' | 'trends'>('regional');

  // Fleet Statistics
  const totalStores = stores.length;
  const criticalStores = stores.filter((s) => s.riskLevel === 'critical');
  const highRiskStores = stores.filter((s) => s.riskLevel === 'high');
  const mediumRiskStores = stores.filter((s) => s.riskLevel === 'medium');
  const lowRiskStores = stores.filter((s) => s.riskLevel === 'low');

  const avgRiskScore = Math.round(
    stores.reduce((acc, s) => acc + s.riskScore, 0) / (totalStores || 1)
  );

  const complianceRate = Math.round(
    ((totalStores - criticalStores.length - highRiskStores.length) / (totalStores || 1)) * 100
  );

  const totalEstRevenueAtRisk = criticalStores.reduce(
    (acc, s) => acc + Math.abs(s.posMetrics?.weeklyRevenue * 0.25 || 150000), 
    0
  );

  // 1. Regional Data: Multi-color grouped statistics
  const regionalData = useMemo(() => {
    const regions = [
      { key: 'North', color: '#6366F1' },
      { key: 'Central', color: '#EC4899' },
      { key: 'South', color: '#10B981' },
      { key: 'West', color: '#F59E0B' },
      { key: 'East', color: '#06B6D4' },
      { key: 'Metro', color: '#8B5CF6' }
    ] as const;

    return regions.map(({ key: region, color }) => {
      const regionStores = stores.filter((s) => s.location.region === region);
      const count = regionStores.length;
      if (count === 0) return { region, avgScore: 0, criticalCount: 0, complianceRate: 100, count: 0, resolved: 0, color };
      
      const avgScore = Math.round(regionStores.reduce((acc, s) => acc + s.riskScore, 0) / count);
      const crit = regionStores.filter((s) => s.riskLevel === 'critical').length;
      const high = regionStores.filter((s) => s.riskLevel === 'high').length;
      const comp = Math.round(((count - crit) / count) * 100);
      const resolved = Math.round(count * 0.75 + (count - crit * 2));

      return {
        region,
        avgRiskScore: avgScore,
        criticalStores: crit,
        highRiskStores: high,
        compliancePct: comp,
        totalStores: count,
        resolvedAudits: resolved,
        color
      };
    });
  }, [stores]);

  // 2. Risk Distribution Data with Vibrant Modern Palette
  const riskDistributionData = useMemo(() => [
    { name: 'Low Risk (<40)', count: lowRiskStores.length, color: '#10B981', gradient: 'from-emerald-500 to-teal-600', fill: '#10B981' },
    { name: 'Medium Risk (40-59)', count: mediumRiskStores.length, color: '#06B6D4', gradient: 'from-cyan-500 to-blue-600', fill: '#06B6D4' },
    { name: 'High Risk (60-79)', count: highRiskStores.length, color: '#F59E0B', gradient: 'from-amber-500 to-orange-600', fill: '#F59E0B' },
    { name: 'Critical Risk (80+)', count: criticalStores.length, color: '#F43F5E', gradient: 'from-rose-500 to-red-600', fill: '#F43F5E' },
  ], [lowRiskStores, mediumRiskStores, highRiskStores, criticalStores]);

  // 3. Top 8 Critical Stores Data with City & Dynamic Colors
  const topCriticalStoresData = useMemo(() => {
    return [...stores]
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 8)
      .map((s, idx) => ({
        storeName: `#${s.storeNumber} ${s.name.split('-')[0].trim()}`,
        shortName: `#${s.storeNumber} ${s.location.city}`,
        storeNumber: s.storeNumber,
        city: s.location.city,
        riskScore: s.riskScore,
        violations: s.recentViolationsCount,
        complaints: s.negativeReviewsCount30d,
        operator: s.operatorName,
        fillColor: idx < 3 ? '#F43F5E' : idx < 6 ? '#FB923C' : '#FBBF24',
      }));
  }, [stores]);

  // 4. 6-Month Fleet Evolution & Predictive Forecast
  const trendData = [
    { month: 'Mar', complianceRate: 94, infractions: 42, resolved: 38, projectedTarget: 95 },
    { month: 'Apr', complianceRate: 92, infractions: 55, resolved: 50, projectedTarget: 95 },
    { month: 'May', complianceRate: 89, infractions: 78, resolved: 68, projectedTarget: 95 },
    { month: 'Jun', complianceRate: 91, infractions: 62, resolved: 58, projectedTarget: 95 },
    { month: 'Jul', complianceRate: 88, infractions: 84, resolved: 72, projectedTarget: 95 },
    { month: 'Aug (Live)', complianceRate: complianceRate, infractions: criticalStores.length * 4 + 18, resolved: 85, projectedTarget: 95 },
    { month: 'Sep (Forecast)', complianceRate: 93, infractions: 38, resolved: 90, projectedTarget: 95 },
  ];

  // 5. Rich Violation Categories Data with Custom Vivid Palette
  const violationCategoryData = [
    { category: 'Kitchen Sanitation & Floors', count: 148, riskImpact: 'Critical', color: '#F43F5E', fill: '#F43F5E', pct: 36 },
    { category: 'TrueCold Gasket & Storage Temp', count: 104, riskImpact: 'High', color: '#FB923C', fill: '#FB923C', pct: 25 },
    { category: 'Staff Hairnet & Uniform Lapses', count: 78, riskImpact: 'Medium', color: '#FBBF24', fill: '#FBBF24', pct: 19 },
    { category: 'Customer Seating & Table Hygiene', count: 52, riskImpact: 'Medium', color: '#06B6D4', fill: '#06B6D4', pct: 13 },
    { category: 'Store Signage & Illumination', count: 28, riskImpact: 'Low', color: '#8B5CF6', fill: '#8B5CF6', pct: 7 },
  ];

  // 6. Revenue Impact Data by Risk Tier
  const revenueImpactData = [
    { tier: 'Critical (80+)', lostWeekly: 14.8, count: criticalStores.length, color: '#F43F5E' },
    { tier: 'High (60-79)', lostWeekly: 9.4, count: highRiskStores.length, color: '#FB923C' },
    { tier: 'Medium (40-59)', lostWeekly: 4.2, count: mediumRiskStores.length, color: '#06B6D4' },
    { tier: 'Low (<40)', lostWeekly: 0.8, count: lowRiskStores.length, color: '#10B981' },
  ];

  // Filtered stores for list drilldown
  const filteredStores = stores.filter((s) => {
    const matchesRegion = selectedRegionFilter === 'All' || s.location.region === selectedRegionFilter;
    const matchesRisk = selectedRiskFilter === 'All' || s.riskLevel === selectedRiskFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.storeNumber.toString().includes(searchQuery);
    return matchesRegion && matchesRisk && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Fleet Scan Bar */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Glow Accent Circles in Background */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Franchise Owner Executive Intelligence</span>
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-teal-400 font-semibold bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-800/60">
              {brand.name} • 500 Outlets Fleet
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Franchise Portfolio Health & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Multi-dimensional graphical intelligence across 500 franchise locations. Continuous monitoring synthesizing AI vision audits, review NLP streams, and POS revenue correlations.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={onTriggerFleetScan}
            disabled={isScanning}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white px-6 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-xl shadow-teal-950/50 cursor-pointer disabled:opacity-60 border border-teal-400/30"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning 500 Stores...' : 'Trigger Full Fleet Scan'}</span>
          </button>
        </div>
      </div>

      {/* Top 4 Executive KPI Cards with Rich Vibrant Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Franchise Fleet */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Active Franchises</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalStores}</span>
            <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">100% Online</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Across 6 regional operating clusters in India
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real-time feeds connected</span>
          </div>
        </div>

        {/* Card 2: Overall Fleet Compliance */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Fleet Compliance Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{complianceRate}%</span>
            <span className="text-xs text-slate-500 font-medium">Target: {brand.complianceTargetPct}%</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              style={{ width: `${complianceRate}%` }} 
              className={`h-full rounded-full bg-gradient-to-r ${complianceRate >= 90 ? 'from-emerald-500 to-teal-500' : 'from-amber-500 to-orange-500'}`} 
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
            <span>Healthy: <strong className="text-emerald-700 font-bold">{lowRiskStores.length + mediumRiskStores.length}</strong></span>
            <span>At-risk: <strong className="text-rose-600 font-bold">{criticalStores.length + highRiskStores.length}</strong></span>
          </div>
        </div>

        {/* Card 3: Critical Attention Required */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-500/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Critical Infractions</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">{criticalStores.length}</span>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              Needs Immediate Cure
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {highRiskStores.length} additional locations in High-Risk watch
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-rose-600 font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>14-Day Cure Notices Dispatched</span>
          </div>
        </div>

        {/* Card 4: Est. Revenue at Risk */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Brand Revenue at Risk</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">₹{(totalEstRevenueAtRisk / 100000).toFixed(1)}L</span>
            <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md">POS Correlated</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Calculated from footfall drops following hygiene infractions
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Avg Risk Score:</span>
            <span className="font-bold text-slate-800">{avgRiskScore} / 100</span>
          </div>
        </div>
      </div>

      {/* GRAPH EXPLORATION NAVIGATION TABS */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveChartTab('regional')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeChartTab === 'regional'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Regional Health & Distribution</span>
          </button>

          <button
            onClick={() => setActiveChartTab('categories')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeChartTab === 'categories'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Violation Categories & Top Outlets</span>
          </button>

          <button
            onClick={() => setActiveChartTab('revenue')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeChartTab === 'revenue'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Revenue Exposure & Risk Tiers</span>
          </button>

          <button
            onClick={() => setActiveChartTab('trends')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeChartTab === 'trends'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>6-Month Trend & Forecast</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-semibold pr-2">
          <span className="w-2 h-2 rounded-full bg-teal-500" />
          <span>Interactive Visualizer Active</span>
        </div>
      </div>

      {/* GRAPH VIEW 1: REGIONAL HEALTH & RISK DISTRIBUTION */}
      {activeChartTab === 'regional' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Left: Regional Risk Score & Compliance Comparison Composed Graph */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-teal-700" />
                  <h3 className="text-base font-bold text-slate-900">Regional Compliance & Risk Comparison</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Average AI risk score & compliance percentage per regional cluster</p>
              </div>
              <span className="text-[11px] bg-slate-100 font-mono text-slate-700 px-3 py-1 rounded-lg border border-slate-200 font-bold">
                6 Regions (500 Stores)
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={regionalData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="complianceBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0D9488" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#14B8A6" stopOpacity={0.7}/>
                    </linearGradient>
                    <linearGradient id="riskBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#FB7185" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="region" stroke="#64748B" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '14px', color: '#fff', border: '1px solid #334155', fontSize: '12px', padding: '10px 14px' }}
                    itemStyle={{ color: '#E2E8F0' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="compliancePct" name="Compliance Rate %" fill="url(#complianceBarGrad)" radius={[8, 8, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="avgRiskScore" name="Avg Risk Score (Lower is Better)" fill="url(#riskBarGrad)" radius={[8, 8, 0, 0]} maxBarSize={28} />
                  <Line type="monotone" dataKey="resolvedAudits" name="Resolved Audits" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, fill: '#8B5CF6' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
              <div className="p-2 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-slate-500 block">Top Region</span>
                <span className="font-bold text-emerald-800">South (96% Comp)</span>
              </div>
              <div className="p-2 bg-rose-50/50 rounded-xl border border-rose-100">
                <span className="text-[10px] text-slate-500 block">Highest Risk</span>
                <span className="font-bold text-rose-700">North (Store #247)</span>
              </div>
              <div className="p-2 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <span className="text-[10px] text-slate-500 block">Fastest Cure</span>
                <span className="font-bold text-indigo-700">Metro Tier-1</span>
              </div>
            </div>
          </div>

          {/* Right: Vibrant Donut Chart with glowing center */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-teal-700" />
                  <h3 className="text-base font-bold text-slate-900">Franchise Risk Distribution</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Breakdown of 500 locations by compliance level</p>
              </div>
            </div>

            <div className="h-60 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '14px', color: '#fff', border: '1px solid #334155', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-900">{totalStores}</span>
                <span className="text-[10px] font-bold uppercase text-slate-500">Stores</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              {riskDistributionData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: item.color }} />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800 text-[11px] truncate">{item.name}</div>
                    <div className="text-slate-500 text-[10px] font-mono">
                      {item.count} stores ({Math.round((item.count / totalStores) * 100)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* GRAPH VIEW 2: VIOLATION CATEGORIES & HIGHEST RISK OUTLETS */}
      {activeChartTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Left: Multi-color Violation Breakdown */}
          <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-700" />
                  <h3 className="text-base font-bold text-slate-900">Infractions by Category</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Fleet-wide breakdown of infractions detected by AI Vision</p>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg border border-purple-200">
                410 Total Infractions
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={violationCategoryData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" stroke="#64748B" fontSize={11} />
                  <YAxis dataKey="category" type="category" stroke="#64748B" fontSize={10} width={130} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '14px', color: '#fff', border: '1px solid #334155', fontSize: '12px' }}
                    formatter={(val: any) => [`${val} Detected Infractions`, 'Count']}
                  />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={22}>
                    {violationCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Kitchen Sanitation is #1 Root Cause:</strong>
                <span>Constitutes 36% of all fleet infractions. Recommended action: Mandate quarterly deep clean & TrueCold inspections.</span>
              </div>
            </div>
          </div>

          {/* Right: Highest Risk Outlets */}
          <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <h3 className="text-base font-bold text-slate-900">Highest Risk Franchise Outlets</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Top flagged locations requiring executive oversight & cure notices</p>
              </div>
              <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-md border border-rose-200">
                Click store to inspect
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={topCriticalStoresData} 
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  onClick={(data: any) => {
                    if (data && data.activePayload && data.activePayload[0]) {
                      const storeNum = data.activePayload[0].payload.storeNumber;
                      onSelectStore(storeNum);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={11} />
                  <YAxis dataKey="shortName" type="category" stroke="#64748B" fontSize={10} width={90} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '14px', color: '#fff', border: '1px solid #334155', fontSize: '12px' }}
                    formatter={(val: any) => [`${val}/100 Risk Score`, 'Risk Score']}
                  />
                  <Bar 
                    dataKey="riskScore" 
                    radius={[0, 8, 8, 0]} 
                    maxBarSize={22}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    {topCriticalStoresData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fillColor} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
              <span>Flagged by Vision & Customer NLP</span>
              <button
                onClick={() => onSelectStore(247)}
                className="text-teal-700 hover:text-teal-800 font-bold transition-colors flex items-center gap-1"
              >
                <span>Inspect #247 Hazratganj Flagship</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* GRAPH VIEW 3: REVENUE EXPOSURE & RISK TIERS */}
      {activeChartTab === 'revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Revenue at Risk Area Chart */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <h3 className="text-base font-bold text-slate-900">Estimated Weekly Revenue Impact by Risk Tier</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Estimated financial loss (in Lakhs INR) from customer churn and bad reviews</p>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueImpactData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="tier" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '14px', color: '#fff', border: '1px solid #334155', fontSize: '12px' }}
                    formatter={(val: any) => [`₹${val} Lakhs / week`, 'Est. Lost Revenue']}
                  />
                  <Bar dataKey="lostWeekly" name="Lost Revenue (₹ Lakhs)" radius={[8, 8, 0, 0]} maxBarSize={38}>
                    {revenueImpactData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
              <span className="font-bold block">POS Correlation Insight:</span>
              <span>Stores with Risk Score &gt; 80 experience an average <strong>23.4% reduction in repeat diner transactions</strong> within 14 days of negative cleanliness reviews.</span>
            </div>
          </div>

          {/* Right: Cost-of-Non-Compliance Breakdown */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Cost-of-Non-Compliance Matrix</h3>
              <p className="text-xs text-slate-500 mt-0.5">Estimated annual financial leakage if cure actions are delayed</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-rose-900">
                  <span>Customer Churn & Rating Drop</span>
                  <span className="font-mono text-rose-700">₹42.5 Lakhs / yr</span>
                </div>
                <div className="w-full bg-rose-200 rounded-full h-2">
                  <div className="bg-rose-600 h-2 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span>Food Spoilage & Cold Chain Waste</span>
                  <span className="font-mono text-amber-700">₹24.0 Lakhs / yr</span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2">
                  <div className="bg-amber-600 h-2 rounded-full" style={{ width: '55%' }} />
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                  <span>Audit Penalties & Franchise Arbitration</span>
                  <span className="font-mono text-indigo-700">₹12.8 Lakhs / yr</span>
                </div>
                <div className="w-full bg-indigo-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span>Saved via Automated AI Remediation</span>
                  <span className="font-mono text-emerald-700">+₹58.2 Lakhs / yr</span>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* GRAPH VIEW 4: 6-MONTH TREND & FORECAST */}
      {activeChartTab === 'trends' && (
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-700" />
                <h3 className="text-lg font-bold text-slate-900">6-Month Fleet Compliance Trajectory & Forecast</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Historical compliance rates, total flagged infractions, and Q3 projected target</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                Target: 95.0%
              </span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
                AI Automated Audits Active
              </span>
            </div>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="infractionsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} domain={[70, 100]} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '14px', color: '#fff', border: '1px solid #334155', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area 
                  type="monotone" 
                  dataKey="complianceRate" 
                  name="Fleet Compliance %" 
                  stroke="#0D9488" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#trendGradient)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="projectedTarget" 
                  name="Target Baseline (95%)" 
                  stroke="#6366F1" 
                  strokeDasharray="5 5" 
                  strokeWidth={2}
                  dot={false}
                />
                <Bar dataKey="resolved" name="Resolved Remediation Cases" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={22} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-500 block">Q1 2026 Average</span>
              <span className="text-base font-extrabold text-slate-800">93.0% Compliance</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-500 block">Q2 2026 Average</span>
              <span className="text-base font-extrabold text-slate-800">89.3% Compliance</span>
            </div>
            <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200">
              <span className="text-teal-700 font-bold block">Q3 2026 Projected</span>
              <span className="text-base font-extrabold text-teal-900">94.8% (Target Met)</span>
            </div>
          </div>
        </div>
      )}

      {/* REGIONAL CLUSTERS VISUAL CARDS (Colorful 6-Grid) */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Regional Cluster Operations & Audit Health</h3>
            <p className="text-xs text-slate-500">Live operational status across India's 6 franchise divisions</p>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
            500 Total Stores
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {regionalData.map((reg) => (
            <div 
              key={reg.region}
              className="p-4 rounded-2xl border border-slate-200 hover:border-teal-400 bg-gradient-to-b from-white to-slate-50/70 transition-all shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Regional Hub
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: reg.color }} />
                    <span>{reg.region} India Hub</span>
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {reg.totalStores} stores
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Compliance Rate</span>
                  <span className="font-bold text-slate-800">{reg.compliancePct}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full" 
                    style={{ width: `${reg.compliancePct}%`, backgroundColor: reg.color }} 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                <span className="text-rose-600 font-bold">
                  {reg.criticalStores} Critical {reg.criticalStores === 1 ? 'Alert' : 'Alerts'}
                </span>
                <button
                  onClick={() => setSelectedRegionFilter(reg.region)}
                  className="text-teal-700 font-bold hover:underline"
                >
                  Filter stores →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SYSTEMIC FLEET ANOMALY DETECTIONS (Brand-Wide Root Cause) */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-md shadow-purple-900/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Systemic Cross-Location Anomalies</h3>
              <p className="text-xs text-slate-500">Root causes recurring across multiple independent franchise operators</p>
            </div>
          </div>
          <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full border border-purple-200">
            {systemicPatterns.length} Active Fleet Anomalies
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemicPatterns.map((pattern) => (
            <div key={pattern.id} className="p-4 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200 space-y-3 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-bold border border-indigo-100">
                    {pattern.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1.5">{pattern.title}</h4>
                </div>
                <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2.5 py-0.5 rounded-md shrink-0 border border-rose-200">
                  {pattern.affectedStoresCount} Stores
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{pattern.patternDescription}</p>

              <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 text-xs space-y-1">
                <span className="font-bold text-teal-900 block flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                  <span>Recommended Fleet Mandate:</span>
                </span>
                <p className="text-slate-700 text-[11px] leading-relaxed">{pattern.recommendedFleetAction}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                <span>Est. Risk: <strong className="text-rose-600 font-bold">{pattern.potentialCostRisk}</strong></span>
                <span className="text-slate-400">Detected: {pattern.dateDetected}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ALL FRANCHISES BROWSER (Direct Filter & Drilldown Table) */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">All 500 Franchise Stores Matrix</h3>
            <p className="text-xs text-slate-500">Filter by region, risk level, or click any card to inspect full evidence</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search store, city, #..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-teal-600"
              />
            </div>

            {/* Region Filter */}
            <select
              value={selectedRegionFilter}
              onChange={(e) => setSelectedRegionFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-600 cursor-pointer"
            >
              <option value="All">All Regions</option>
              <option value="North">North India</option>
              <option value="Central">Central India</option>
              <option value="South">South India</option>
              <option value="West">West India</option>
              <option value="East">East India</option>
              <option value="Metro">Metro Tier-1</option>
            </select>

            {/* Risk Filter */}
            <select
              value={selectedRiskFilter}
              onChange={(e) => setSelectedRiskFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-600 cursor-pointer"
            >
              <option value="All">All Risk Tiers</option>
              <option value="critical">Critical Risk (80+)</option>
              <option value="high">High Risk (60-79)</option>
              <option value="medium">Medium Risk (40-59)</option>
              <option value="low">Low Risk (&lt;40)</option>
            </select>
          </div>
        </div>

        {/* Store Grid Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[440px] overflow-y-auto pr-1">
          {filteredStores.slice(0, 18).map((store) => {
            const isCrit = store.riskLevel === 'critical';
            const isHigh = store.riskLevel === 'high';
            return (
              <div
                key={store.id}
                onClick={() => onSelectStore(store.storeNumber)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:shadow-md flex flex-col justify-between ${
                  isCrit
                    ? 'bg-rose-50/50 border-rose-200 hover:border-rose-400'
                    : isHigh
                    ? 'bg-amber-50/50 border-amber-200 hover:border-amber-400'
                    : 'bg-slate-50/80 border-slate-200 hover:border-teal-400'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-500">#{store.storeNumber}</span>
                      <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 bg-white rounded border border-slate-200 text-slate-600">
                        {store.location.region}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">{store.name}</h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-teal-700 shrink-0" />
                      <span>{store.location.city}, {store.location.state}</span>
                    </p>
                  </div>

                  <div
                    className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-bold shrink-0 shadow-2xs ${
                      isCrit
                        ? 'bg-rose-500 text-white shadow-rose-200'
                        : isHigh
                        ? 'bg-amber-500 text-white shadow-amber-200'
                        : 'bg-emerald-600 text-white shadow-emerald-200'
                    }`}
                  >
                    <span className="text-xs leading-none">{store.riskScore}</span>
                    <span className="text-[7px] uppercase font-extrabold tracking-tighter">SCORE</span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 truncate max-w-[140px]">
                    Op: {store.operatorName}
                  </span>
                  <span className="text-teal-700 font-bold flex items-center gap-0.5 hover:underline">
                    <span>Inspect Evidence</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredStores.length > 18 && (
          <p className="text-center text-xs text-slate-500 pt-1">
            Showing top 18 of {filteredStores.length} stores. Use the filters above to locate any specific franchise.
          </p>
        )}
      </div>

    </div>
  );
};
