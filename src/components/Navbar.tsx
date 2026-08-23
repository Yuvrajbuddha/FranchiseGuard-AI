import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Store, 
  CheckCircle, 
  Building2, 
  Sparkles, 
  ChevronDown, 
  Camera, 
  Video, 
  Plus, 
  LogOut, 
  User, 
  ShieldCheck, 
  BarChart3, 
  Film, 
  Utensils, 
  ArrowRightLeft,
  Users,
  Eye
} from 'lucide-react';
import { FranchiseBrand, AuthUser, UserRole } from '../types/franchise';
import { DEMO_USERS } from '../data/mockFranchiseData';

export type ActiveTab = 
  | 'owner_analytics' 
  | 'manager_portal' 
  | 'franchisee_portal' 
  | 'customer_portal' 
  | 'stores' 
  | 'human_loop';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  currentUser: AuthUser | null;
  onSwitchUser: (user: AuthUser) => void;
  onLogout: () => void;
  selectedBrand: FranchiseBrand;
  setSelectedBrand: (brand: FranchiseBrand) => void;
  brands: FranchiseBrand[];
  criticalCount: number;
  openStoreInspector: (storeNumber: number) => void;
  openCustomerUpload?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onSwitchUser,
  onLogout,
  selectedBrand,
  setSelectedBrand,
  brands,
  criticalCount,
  openStoreInspector,
  openCustomerUpload,
}) => {
  const [brandDropdownOpen, setBrandDropdownOpen] = useState<boolean>(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState<boolean>(false);

  // Role-adaptive Navigation Items
  const getNavItems = () => {
    if (!currentUser) return [];

    switch (currentUser.role) {
      case 'owner':
        return [
          { id: 'owner_analytics', label: 'Fleet Charts & Analytics', icon: BarChart3 },
          { id: 'stores', label: 'All 500 Franchises', icon: Store, badge: criticalCount > 0 ? `${criticalCount} Alert` : undefined },
          { id: 'human_loop', label: 'Action & Governance Center', icon: CheckCircle },
        ];
      case 'manager':
        return [
          { id: 'manager_portal', label: 'Media & Review Center', icon: Film },
          { id: 'stores', label: 'Store Fleet & Inspections', icon: Store, badge: criticalCount > 0 ? `${criticalCount} Alert` : undefined },
          { id: 'human_loop', label: 'Approve & Cure Notices', icon: CheckCircle },
        ];
      case 'franchisee':
        return [
          { id: 'franchisee_portal', label: 'My Store #247 Dashboard', icon: Store },
          { id: 'stores', label: 'Benchmark with Fleet', icon: LayoutDashboard },
        ];
      case 'customer':
      default:
        return [
          { id: 'customer_portal', label: 'Food Safety & Dining Hub', icon: Utensils },
          { id: 'stores', label: 'Browse Verified Outlets', icon: Store },
        ];
    }
  };

  const navItems = getNavItems();

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'manager':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      case 'franchisee':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'customer':
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 text-slate-900">
      {/* Top clean status bar with User Profile and Fast Switcher */}
      <div className="bg-slate-950 text-slate-300 px-4 sm:px-6 py-2 text-xs flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5 text-[12px]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-white">{selectedBrand.name}</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">{selectedBrand.headquarters} (500 Stores)</span>
        </div>

        {/* Top Right Quick Actions & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Upload Button */}
          {openCustomerUpload && (
            <button
              id="nav-btn-customer-upload"
              onClick={openCustomerUpload}
              className="text-teal-300 bg-teal-950/80 hover:bg-teal-900 border border-teal-700/70 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">+ Add Media</span>
              <span className="sm:hidden">Upload</span>
            </button>
          )}

          {/* User Account & Role Switcher Dropdown */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg text-xs text-slate-200 transition-colors cursor-pointer"
              >
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-4 h-4 rounded-full object-cover" />
                ) : (
                  <User className="w-3.5 h-3.5 text-teal-400" />
                )}
                <span className="font-bold text-white max-w-[110px] truncate">{currentUser.name}</span>
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${getRoleBadgeStyle(currentUser.role)}`}>
                  {currentUser.role}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn text-xs text-slate-200">
                  <div className="px-3 py-1.5 border-b border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Active User Session
                    </span>
                    <span className="font-bold text-white block mt-0.5">{currentUser.name}</span>
                    <span className="text-[11px] text-teal-400">{currentUser.title}</span>
                  </div>

                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Switch Test Persona:
                  </div>

                  {DEMO_USERS.map((demo) => (
                    <button
                      key={demo.id}
                      onClick={() => {
                        onSwitchUser({
                          id: demo.id,
                          name: demo.name,
                          email: demo.email,
                          role: demo.role,
                          avatar: demo.avatar,
                          title: demo.title,
                          assignedStoreNumber: demo.assignedStoreNumber,
                          assignedRegion: demo.assignedRegion,
                        });
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors hover:bg-slate-800 cursor-pointer ${
                        currentUser.role === demo.role ? 'bg-teal-950/60 text-teal-300 font-bold' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] border ${
                            demo.role === 'owner'
                              ? 'bg-purple-950 text-purple-300 border-purple-700/60'
                              : demo.role === 'manager'
                              ? 'bg-teal-950 text-teal-300 border-teal-700/60'
                              : demo.role === 'franchisee'
                              ? 'bg-amber-950 text-amber-300 border-amber-700/60'
                              : 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                          }`}
                        >
                          {demo.name[0]}
                        </div>
                        <div>
                          <span className="block font-medium">{demo.name.split(' ')[0]}</span>
                          <span className="text-[10px] text-slate-400 block">{demo.badge}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded border ${getRoleBadgeStyle(demo.role)}`}>
                        {demo.role}
                      </span>
                    </button>
                  ))}

                  <div className="border-t border-slate-800 mt-1 pt-1 px-1">
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50 flex items-center gap-2 font-bold cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out to Login Screen</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (currentUser?.role === 'owner') setActiveTab('owner_analytics');
              else if (currentUser?.role === 'manager') setActiveTab('manager_portal');
              else if (currentUser?.role === 'franchisee') setActiveTab('franchisee_portal');
              else setActiveTab('customer_portal');
            }} 
            className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
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
          <div className="relative hidden md:block">
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

        {/* Dynamic Navigation Tabs based on Role */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-200' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
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
