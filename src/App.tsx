import React, { useState } from 'react';
import { 
  FRANCHISE_BRANDS, 
  generateFleetStores, 
  MOCK_SYSTEMIC_PATTERNS, 
  MOCK_AUDIT_LOGS 
} from './data/mockFranchiseData';
import { 
  FranchiseStore, 
  FranchiseBrand, 
  SystemicPattern, 
  AuditLogEntry 
} from './types/franchise';
import { Navbar, ActiveTab } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { StoreInspectorModal } from './components/StoreInspectorModal';
import { StoreListAuditor } from './components/StoreListAuditor';
import { HumanInTheLoopCenter } from './components/HumanInTheLoopCenter';
import confetti from 'canvas-confetti';

export function App() {
  const [selectedBrand, setSelectedBrand] = useState<FranchiseBrand>(FRANCHISE_BRANDS[0]);
  const [stores, setStores] = useState<FranchiseStore[]>(() => generateFleetStores());
  const [systemicPatterns, setSystemicPatterns] = useState<SystemicPattern[]>(MOCK_SYSTEMIC_PATTERNS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedStoreNumber, setSelectedStoreNumber] = useState<number | null>(null);
  const [isScanningFleet, setIsScanningFleet] = useState<boolean>(false);
  const [fleetScanToast, setFleetScanToast] = useState<string | null>(null);

  const selectedStore = stores.find((s) => s.storeNumber === selectedStoreNumber) || null;
  const criticalCount = stores.filter((s) => s.riskLevel === 'critical').length;

  const handleOpenStoreInspector = (storeNum: number) => {
    setSelectedStoreNumber(storeNum);
  };

  const handleCloseStoreInspector = () => {
    setSelectedStoreNumber(null);
  };

  const handleTriggerFleetScan = () => {
    setIsScanningFleet(true);
    setTimeout(() => {
      setIsScanningFleet(false);
      setFleetScanToast('Fleet scan complete: 500 store vision feeds and customer reviews verified.');
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.5 },
      });
      setTimeout(() => setFleetScanToast(null), 4000);
    }, 1500);
  };

  const handleApproveAction = (storeNumber: number, actionType: string, note?: string) => {
    const updated = stores.map((s) => {
      if (s.storeNumber === storeNumber) {
        return {
          ...s,
          humanReviewStatus: 'Approved' as const,
        };
      }
      return s;
    });
    setStores(updated);

    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      storeNumber,
      actionTaken: `Approved: ${actionType.replace('_', ' ').toUpperCase()}`,
      decisionType: 'Approved',
      actor: 'Franchise Compliance Director',
      notes: note || 'Approved for immediate field dispatch.',
      aiRecommendation: 'Physical inspection dispatched following AI risk flag.',
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleRejectAction = (storeNumber: number, note?: string) => {
    const updated = stores.map((s) => {
      if (s.storeNumber === storeNumber) {
        return {
          ...s,
          humanReviewStatus: 'Dismissed' as const,
          riskScore: Math.max(25, s.riskScore - 20),
          riskLevel: 'medium' as const,
        };
      }
      return s;
    });
    setStores(updated);

    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      storeNumber,
      actionTaken: 'Flag Dismissed by Franchise Manager',
      decisionType: 'Rejected',
      actor: 'Franchise Operations Manager',
      notes: note || 'Resolved locally or non-violation confirmed.',
      aiRecommendation: 'Dismissed after review by store supervisor.',
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleInvestigateAction = (storeNumber: number, note?: string) => {
    const updated = stores.map((s) => {
      if (s.storeNumber === storeNumber) {
        return {
          ...s,
          humanReviewStatus: 'Under Investigation' as const,
        };
      }
      return s;
    });
    setStores(updated);

    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      storeNumber,
      actionTaken: 'Clarification & Photo Evidence Requested',
      decisionType: 'Approved',
      actor: 'Franchise Field Operations',
      notes: note || 'Requested supplementary photos and POS transaction logs.',
      aiRecommendation: 'Supplementary audit evidence requested.',
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col selection:bg-teal-700 selection:text-white">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        brands={FRANCHISE_BRANDS}
        criticalCount={criticalCount}
        openStoreInspector={handleOpenStoreInspector}
      />

      {/* Fleet Scan Global Toast */}
      {fleetScanToast && (
        <div className="bg-teal-700 text-white px-4 py-2 text-xs font-semibold text-center border-b border-teal-800 flex items-center justify-center gap-2 shadow-xs animate-fadeIn">
          <span>✨ {fleetScanToast}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 pb-12">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            stores={stores}
            systemicPatterns={systemicPatterns}
            brand={selectedBrand}
            onSelectStore={handleOpenStoreInspector}
            onNavigateTab={setActiveTab}
            onTriggerFleetScan={handleTriggerFleetScan}
            isScanning={isScanningFleet}
          />
        )}

        {activeTab === 'stores' && (
          <StoreListAuditor
            stores={stores}
            onSelectStore={handleOpenStoreInspector}
          />
        )}

        {activeTab === 'human_loop' && (
          <HumanInTheLoopCenter
            stores={stores}
            auditLogs={auditLogs}
            onInspectStore={handleOpenStoreInspector}
            onApproveAction={handleApproveAction}
            onRejectAction={handleRejectAction}
          />
        )}
      </main>

      {/* Store Details Inspector Modal */}
      {selectedStore && (
        <StoreInspectorModal
          store={selectedStore}
          onClose={handleCloseStoreInspector}
          onApproveAction={handleApproveAction}
          onRejectAction={handleRejectAction}
          onInvestigateAction={handleInvestigateAction}
        />
      )}

      {/* Persistent Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">FranchiseGuard AI</span>
            <span>•</span>
            <span>Continuous Compliance Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Powered by Gemini 3.7 Vision & NLP
            </span>
            <span>•</span>
            <button onClick={() => handleOpenStoreInspector(247)} className="hover:text-teal-700 font-semibold transition-colors">
              Inspect Store #247 (Hazratganj)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
