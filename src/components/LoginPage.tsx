import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  Store, 
  Users, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  BarChart3, 
  Video, 
  FileCheck, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { AuthUser, UserRole } from '../types/franchise';
import { DEMO_USERS, DemoUserAccount } from '../data/mockFranchiseData';

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>('owner@franchiseguard.com');
  const [password, setPassword] = useState<string>('owner123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>('owner');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectDemoUser = (demoUser: DemoUserAccount) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setSelectedRoleTab(demoUser.role);
    setErrorMessage(null);
  };

  const handleQuickLogin = (demoUser: DemoUserAccount) => {
    onLogin({
      id: demoUser.id,
      name: demoUser.name,
      email: demoUser.email,
      role: demoUser.role,
      avatar: demoUser.avatar,
      title: demoUser.title,
      assignedStoreNumber: demoUser.assignedStoreNumber,
      assignedRegion: demoUser.assignedRegion,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Check against demo accounts or validate
    const matchedUser = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matchedUser) {
      if (password === matchedUser.password || password === 'demo' || password.length >= 4) {
        onLogin({
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role,
          avatar: matchedUser.avatar,
          title: matchedUser.title,
          assignedStoreNumber: matchedUser.assignedStoreNumber,
          assignedRegion: matchedUser.assignedRegion,
        });
        return;
      } else {
        setErrorMessage('Incorrect password. For testing, use the default demo password or click the Quick Login button.');
        return;
      }
    }

    // Default fallback if user types custom email
    const fallbackRole: UserRole = selectedRoleTab;
    onLogin({
      id: `user-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email: email.trim(),
      role: fallbackRole,
      title: fallbackRole === 'owner' 
        ? 'Franchise Brand Owner' 
        : fallbackRole === 'manager' 
        ? 'Regional Operations Manager' 
        : fallbackRole === 'franchisee' 
        ? 'Franchisee Operator (Store #247)' 
        : 'Registered Customer',
      assignedStoreNumber: fallbackRole === 'franchisee' ? 247 : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-teal-600 selection:text-white">
      {/* Top Brand Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md py-4 px-6 sm:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-800 flex items-center justify-center text-white shadow-md shadow-teal-900/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">FranchiseGuard AI</h1>
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                Multi-Role v2.5
              </span>
            </div>
            <p className="text-xs text-slate-400">Continuous Brand Compliance, Vision Auditing & Operations Hub</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>AI Vision & Multimodal Auditing</span>
          </span>
        </div>
      </header>

      {/* Main Login Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Login Form & Role Direct Access */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block mb-1">
                Authentication Portal
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Sign in to your Workspace
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose your role or select one of the pre-configured demo credentials below.
              </p>
            </div>

            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  const u = DEMO_USERS.find(d => d.role === 'owner')!;
                  handleSelectDemoUser(u);
                }}
                className={`py-2 px-2.5 rounded-xl font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedRoleTab === 'owner'
                    ? 'bg-teal-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="truncate">Owner</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const u = DEMO_USERS.find(d => d.role === 'manager')!;
                  handleSelectDemoUser(u);
                }}
                className={`py-2 px-2.5 rounded-xl font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedRoleTab === 'manager'
                    ? 'bg-teal-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span className="truncate">Manager</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const u = DEMO_USERS.find(d => d.role === 'franchisee')!;
                  handleSelectDemoUser(u);
                }}
                className={`py-2 px-2.5 rounded-xl font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedRoleTab === 'franchisee'
                    ? 'bg-teal-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Store className="w-4 h-4" />
                <span className="truncate">Franchisee</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const u = DEMO_USERS.find(d => d.role === 'customer')!;
                  handleSelectDemoUser(u);
                }}
                className={`py-2 px-2.5 rounded-xl font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedRoleTab === 'customer'
                    ? 'bg-teal-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="truncate">Customer</span>
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Email Address / User ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@franchiseguard.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <span className="text-[11px] text-teal-400 cursor-pointer hover:underline">
                    Demo Password: <strong className="text-white font-mono">{password || 'owner123'}</strong>
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-teal-900/30 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Enter as {selectedRoleTab === 'owner' ? 'Franchise Owner' : selectedRoleTab === 'manager' ? 'Operations Manager' : selectedRoleTab === 'franchisee' ? 'Franchisee Operator' : 'Customer'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Quick Guest Access */}
            <div className="pt-2 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={() => {
                  const cust = DEMO_USERS.find(d => d.role === 'customer')!;
                  handleQuickLogin(cust);
                }}
                className="text-xs text-slate-400 hover:text-teal-300 font-semibold transition-colors"
              >
                Or continue directly to the <span className="underline font-bold text-teal-400">Public Customer Dining Portal</span> →
              </button>
            </div>
          </div>

          {/* Right Column: Interactive 1-Click Demo Accounts Selector */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">1-Click Demo Test Profiles</h3>
                <p className="text-xs text-slate-400">Select any profile to log in immediately with role-specific views.</p>
              </div>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-1 rounded-md border border-slate-700">
                Ready for Review
              </span>
            </div>

            <div className="space-y-3">
              {DEMO_USERS.map((demo) => {
                const isSelected = selectedRoleTab === demo.role;
                return (
                  <div
                    key={demo.id}
                    className={`p-4 rounded-2xl border transition-all relative ${
                      isSelected
                        ? 'bg-slate-900 border-teal-500 ring-2 ring-teal-500/20 shadow-lg'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm border shrink-0 ${
                            demo.role === 'owner'
                              ? 'bg-purple-950/80 text-purple-300 border-purple-700/60'
                              : demo.role === 'manager'
                              ? 'bg-teal-950/80 text-teal-300 border-teal-700/60'
                              : demo.role === 'franchisee'
                              ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                          }`}
                        >
                          {demo.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{demo.name}</h4>
                            <span
                              className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                                demo.role === 'owner'
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                  : demo.role === 'manager'
                                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                                  : demo.role === 'franchisee'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              }`}
                            >
                              {demo.badge}
                            </span>
                          </div>
                          <p className="text-xs text-teal-400 font-medium">{demo.title}</p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                            <span>ID: <strong className="text-slate-200">{demo.email}</strong></span>
                            <span>•</span>
                            <span>Pass: <strong className="text-slate-200">{demo.password}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* 1-Click Login Action Button */}
                      <button
                        type="button"
                        onClick={() => handleQuickLogin(demo)}
                        className="bg-slate-800 hover:bg-teal-600 text-slate-200 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border border-slate-700 hover:border-teal-500 flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <span>Quick Login</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 mt-2.5 pt-2.5 border-t border-slate-800/80 leading-relaxed">
                      {demo.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Feature Matrix Highlights */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <HelpCircle className="w-4 h-4 text-teal-400" />
                <span>Role Responsibilities & Capabilities:</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span><strong>Owner:</strong> Charts, bar graphs & fleet health</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span><strong>Manager:</strong> Video upload, review audits, cure notices</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span><strong>Franchisee:</strong> Store hygiene score & proof-of-fix</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span><strong>Customer:</strong> Dine-in reviews & photo uploads</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>FranchiseGuard AI Compliance Engine • Intelligent Brand Quality & Operations</p>
      </footer>
    </div>
  );
};
