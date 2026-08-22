import React from 'react';
import { 
  LayoutDashboard, 
  Store, 
  CheckCircle,
  Building2,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { FranchiseBrand } from '../types/franchise';

export type ActiveTab = 
  | 'dashboard' 
  | 'stores' 
  | 'human_loop';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  selectedBrand: FranchiseBrand;
  setSelectedBrand: (brand: FranchiseBrand) => void;
  brands: FranchiseBrand[];
  criticalCount: number;
  openStoreInspector: (storeNumber: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedBrand,
  setSelectedBrand,
  brands,
  criticalCount,
  openStoreInspector,
}) => {
  const [brandDropdownOpen, setBrandDropdownOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stores', label: 'Store Fleet', icon: Store, badge: criticalCount > 0 ? `${criticalCount} Alert` : undefined },
    { id: 'human_loop', label: 'Action Center', icon: CheckCircle },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 text-slate-900">
      {/* Top clean status bar */}
      <div className="bg-slate-950 text-slate-300 px-4 sm:px-6 py-2 text-xs flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 text-[12px]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-white">Fleet Monitoring Live</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">{selectedBrand.name} ({selectedBrand.headquarters})</span>
        </div>

        <button 
          id="nav-quick-spotlight-store247"
          onClick={() => openStoreInspector(247)}
          className="text-rose-300 bg-rose-950/70 hover:bg-rose-900 border border-rose-800/80 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Spotlight Store #247 (Hazratganj)</span>
        </button>
      </div>

      {/* Main navigation header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              FG
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900">FranchiseGuard</span>
              <span className="font-bold text-base tracking-tight text-teal-600 ml-0.5">AI</span>
            </div>
          </button>

          {/* Clean Brand Switcher */}
          <div className="relative hidden sm:block">
            <button
              id="btn-brand-switcher"
              onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-teal-700" />
              <span>{selectedBrand.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {brandDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-fadeIn">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100">
                  Select Franchise Brand
                </div>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBrand(b);
                      setBrandDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex flex-col transition-colors ${
                      selectedBrand.id === b.id ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{b.name}</span>
                      <span className="text-[10px] text-slate-400">{b.totalLocations} stores</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">{b.headquarters}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3 Clear Navigation Tabs */}
        <nav className="flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-200' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-teal-900 text-teal-100'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
