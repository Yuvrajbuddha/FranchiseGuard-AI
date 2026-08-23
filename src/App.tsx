import React, { useState } from 'react';
import { 
  FRANCHISE_BRANDS, 
  generateFleetStores, 
  MOCK_SYSTEMIC_PATTERNS, 
  MOCK_AUDIT_LOGS,
  DEMO_USERS
} from './data/mockFranchiseData';
import { 
  FranchiseStore, 
  FranchiseBrand, 
  SystemicPattern, 
  AuditLogEntry,
  StorePhotoAudit,
  CustomerReview,
  AuthUser,
  UserRole
} from './types/franchise';
import { Navbar, ActiveTab } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { OwnerAnalyticsDashboard } from './components/OwnerAnalyticsDashboard';
import { ManagerPortal } from './components/ManagerPortal';
import { FranchiseePortal } from './components/FranchiseePortal';
import { CustomerPortal } from './components/CustomerPortal';
import { StoreInspectorModal } from './components/StoreInspectorModal';
import { StoreListAuditor } from './components/StoreListAuditor';
import { HumanInTheLoopCenter } from './components/HumanInTheLoopCenter';
import { CustomerMediaUploadModal } from './components/CustomerMediaUploadModal';
import confetti from 'canvas-confetti';

export function App() {
  // Current Authenticated User (null = Shows Login Screen First)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const [selectedBrand, setSelectedBrand] = useState<FranchiseBrand>(FRANCHISE_BRANDS[0]);
  const [stores, setStores] = useState<FranchiseStore[]>(() => generateFleetStores());
  const [systemicPatterns, setSystemicPatterns] = useState<SystemicPattern[]>(MOCK_SYSTEMIC_PATTERNS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('owner_analytics');
  const [selectedStoreNumber, setSelectedStoreNumber] = useState<number | null>(null);
  const [isScanningFleet, setIsScanningFleet] = useState<boolean>(false);
  const [fleetScanToast, setFleetScanToast] = useState<string | null>(null);

  // Customer Media Upload Modal State
  const [isCustomerUploadOpen, setIsCustomerUploadOpen] = useState<boolean>(false);
  const [uploadTargetStoreNumber, setUploadTargetStoreNumber] = useState<number>(247);

  const selectedStore = stores.find((s) => s.storeNumber === selectedStoreNumber) || null;
  const criticalCount = stores.filter((s) => s.riskLevel === 'critical').length;

  // Franchisee's assigned store (default to #247)
  const franchiseeStoreNumber = currentUser?.assignedStoreNumber || 247;
  const franchiseeStore = stores.find((s) => s.storeNumber === franchiseeStoreNumber) || stores[0];

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    // Route to role-specific home tab
    switch (user.role) {
      case 'owner':
        setActiveTab('owner_analytics');
        break;
      case 'manager':
        setActiveTab('manager_portal');
        break;
      case 'franchisee':
        setActiveTab('franchisee_portal');
        break;
      case 'customer':
      default:
        setActiveTab('customer_portal');
        break;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedStoreNumber(null);
  };

  const handleSwitchUser = (user: AuthUser) => {
    handleLogin(user);
  };

  const handleOpenStoreInspector = (storeNum: number) => {
    setSelectedStoreNumber(storeNum);
  };

  const handleCloseStoreInspector = () => {
    setSelectedStoreNumber(null);
  };

  const handleOpenCustomerUpload = (storeNum?: number) => {
    setUploadTargetStoreNumber(storeNum || selectedStoreNumber || 247);
    setIsCustomerUploadOpen(true);
  };

  const handleCustomerMediaSubmitted = (
    storeNumber: number,
    newMedia: StorePhotoAudit,
    customerReviewText?: string,
    rating?: number
  ) => {
    setStores((prevStores) =>
      prevStores.map((s) => {
        if (s.storeNumber === storeNumber) {
          const hasViolations = newMedia.detectedViolations.length > 0;
          const updatedPhotos = [newMedia, ...s.photos];
          
          let updatedReviews = s.reviews;
          if (customerReviewText) {
            const newRev: CustomerReview = {
              id: `rev-cust-${Date.now()}`,
              timestamp: new Date().toISOString().substring(0, 10),
              source: 'Zomato / Customer App',
              rating: rating || 1,
              text: customerReviewText,
              sentiment: (rating || 1) <= 2 ? 'negative' : (rating || 1) === 3 ? 'neutral' : 'positive',
              sentimentScore: (rating || 1) <= 2 ? -0.85 : 0.75,
              extractedCategory: newMedia.zone.includes('Food') ? 'Food Quality' : 'Cleanliness',
              severity: (rating || 1) === 1 ? 'critical' : 'high',
              isRecurringIssue: true,
            };
            updatedReviews = [newRev, ...s.reviews];
          }

          const scoreIncrement = hasViolations ? 15 : 0;
          const newRiskScore = Math.min(99, s.riskScore + scoreIncrement);
          const newRiskLevel = newRiskScore >= 80 ? 'critical' : newRiskScore >= 60 ? 'high' : s.riskLevel;

          return {
            ...s,
            photos: updatedPhotos,
            reviews: updatedReviews,
            riskScore: newRiskScore,
            riskLevel: newRiskLevel,
            recentViolationsCount: s.recentViolationsCount + newMedia.detectedViolations.length,
            negativeReviewsCount30d: (rating && rating <= 2) ? s.negativeReviewsCount30d + 1 : s.negativeReviewsCount30d,
            humanReviewStatus: hasViolations ? 'Pending Review' : s.humanReviewStatus,
          };
        }
        return s;
      })
    );

    // Add entry to audit log
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      storeNumber,
      actionTaken: `Customer ${newMedia.mediaType === 'video' ? 'Video Evidence' : 'Photo Evidence'} Uploaded`,
      decisionType: newMedia.detectedViolations.length > 0 ? 'Approved' : 'Dismissed',
      actor: newMedia.submittedBy || 'Verified Customer',
      notes: customerReviewText || 'Customer uploaded visual audit evidence to store record.',
      aiRecommendation: newMedia.detectedViolations.length > 0
        ? `Computer Vision flagged ${newMedia.detectedViolations.length} compliance infractions. Priority review scheduled.`
        : 'Media passed AI cleanliness baseline check.',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setFleetScanToast(`Customer ${newMedia.mediaType === 'video' ? 'Video' : 'Photo'} successfully submitted and analyzed for Store #${storeNumber}!`);
    setTimeout(() => setFleetScanToast(null), 5000);
  };

  const handleTriggerFleetScan = () => {
    setIsScanningFleet(true);
    setTimeout(() => {
      setIsScanningFleet(false);
      setFleetScanToast('Fleet scan complete: 500 store vision feeds, customer photos, and video logs verified.');
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
      actor: currentUser?.name || 'Franchise Compliance Director',
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
      actor: currentUser?.name || 'Franchise Operations Manager',
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
      actor: currentUser?.name || 'Franchise Field Operations',
      notes: note || 'Requested supplementary photos and POS transaction logs.',
      aiRecommendation: 'Supplementary audit evidence requested.',
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  // If not logged in, render the Login Page First!
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col selection:bg-teal-700 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onLogout={handleLogout}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        brands={FRANCHISE_BRANDS}
        criticalCount={criticalCount}
        openStoreInspector={handleOpenStoreInspector}
        openCustomerUpload={() => handleOpenCustomerUpload(247)}
      />

      {/* Fleet Scan Global Toast */}
      {fleetScanToast && (
        <div className="bg-teal-700 text-white px-4 py-2.5 text-xs font-semibold text-center border-b border-teal-800 flex items-center justify-center gap-2 shadow-xs animate-fadeIn">
          <span>✨ {fleetScanToast}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 pb-12">
        
        {/* 1. Franchise Owner View: Graphical Representation & Bar Charts */}
        {activeTab === 'owner_analytics' && (
          <OwnerAnalyticsDashboard
            stores={stores}
            brand={selectedBrand}
            systemicPatterns={systemicPatterns}
            onSelectStore={handleOpenStoreInspector}
            onTriggerFleetScan={handleTriggerFleetScan}
            isScanning={isScanningFleet}
          />
        )}

        {/* 2. Operations Manager View: Upload Videos & Customer Reviews */}
        {activeTab === 'manager_portal' && (
          <ManagerPortal
            stores={stores}
            onSelectStore={handleOpenStoreInspector}
            onOpenMediaUpload={handleOpenCustomerUpload}
            onApproveAction={handleApproveAction}
            onRejectAction={handleRejectAction}
            onInvestigateAction={handleInvestigateAction}
          />
        )}

        {/* 3. Franchisee Operator View: Store Status & Proof of Fix */}
        {activeTab === 'franchisee_portal' && (
          <FranchiseePortal
            store={franchiseeStore}
            onOpenMediaUpload={handleOpenCustomerUpload}
            onSelectStore={handleOpenStoreInspector}
          />
        )}

        {/* 4. Normal User / Customer Interface: Food Safety & Reviews */}
        {activeTab === 'customer_portal' && (
          <CustomerPortal
            stores={stores}
            onOpenCustomerUpload={handleOpenCustomerUpload}
            onSelectStore={handleOpenStoreInspector}
          />
        )}

        {/* 5. Full Store Fleet Matrix Tab */}
        {activeTab === 'stores' && (
          <StoreListAuditor
            stores={stores}
            onSelectStore={handleOpenStoreInspector}
            onOpenMediaUpload={handleOpenCustomerUpload}
          />
        )}

        {/* 6. Human in the Loop Governance Center */}
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
          onOpenMediaUpload={handleOpenCustomerUpload}
        />
      )}

      {/* Customer Photo & Video Upload Modal */}
      <CustomerMediaUploadModal
        isOpen={isCustomerUploadOpen}
        onClose={() => setIsCustomerUploadOpen(false)}
        stores={stores}
        preselectedStoreNumber={uploadTargetStoreNumber}
        onMediaSubmitted={handleCustomerMediaSubmitted}
      />

      {/* Persistent Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">FranchiseGuard AI</span>
            <span>•</span>
            <span>Active Role: <strong className="text-teal-700 capitalize">{currentUser.role} ({currentUser.name})</strong></span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={() => handleOpenCustomerUpload(247)}
              className="text-teal-700 hover:text-teal-800 font-bold transition-colors"
            >
              + Add Customer Photo / Video
            </button>
            <span>•</span>
            <button
              onClick={handleLogout}
              className="text-rose-600 hover:text-rose-700 font-semibold transition-colors"
            >
              Sign Out
            </button>
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
