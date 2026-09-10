import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./providers/AuthProvider";
import { Header } from "./components/common/Header";
import { Sidebar } from "./components/common/Sidebar";
import { Footer } from "./components/common/Footer";
import { LandingPage } from "./components/landing/LandingPage";
import { LicenseActivationModal } from "./components/auth/LicenseActivationModal";
import { LoginModal } from "./components/auth/LoginModal";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";
import { VerifyEmailPage } from "./components/auth/VerifyEmailPage";
import { VerifyOtpPage } from "./components/auth/VerifyOtpPage";
import { ForgotPasswordPage } from "./components/auth/ForgotPasswordPage";
import { UserProfilePage } from "./components/auth/UserProfilePage";
import { ProtectedRoute, LicenseGuard } from "./components/auth/Guards";
import { DashboardModule } from "./modules/dashboard/DashboardModule";
import { AICopilotModule } from "./modules/ai/AICopilotModule";
import { GenericModuleShell } from "./modules/common/GenericModuleShell";
import { SettingsModule } from "./modules/settings/SettingsModule";
import { LicenseHubModule } from "./modules/license/LicenseHubModule";
import { DesignSystemPage } from "./modules/design-system/DesignSystemPage";
import { LicenseProvider } from "./providers/LicenseProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { LanguageProvider } from "./providers/LanguageProvider";
import { ToastProvider } from "./components/ui/ToastProvider";
import { MobileNavigation } from "./components/common/MobileNavigation";
import { ProductionModule } from "./modules/production/ProductionModule";
import { FleetModule } from "./modules/fleet/FleetModule";
import { FuelModule } from "./modules/fuel/FuelModule";
import { HSEModule } from "./modules/hse/HSEModule";
import { EnvironmentModule } from "./modules/environment/EnvironmentModule";
import { ReclamationModule } from "./modules/reclamation/ReclamationModule";
import { GISMapModule } from "./modules/gis/GISMapModule";
import { MinePlanningModule } from "./modules/mine-planning/MinePlanningModule";
import { GeologyModule } from "./modules/geology/GeologyModule";
import { SurveyModule } from "./modules/survey/SurveyModule";
import { EquipmentModule } from "./modules/equipment/EquipmentModule";
import { DispatchModule } from "./modules/dispatch/DispatchModule";
import { HaulingModule } from "./modules/hauling/HaulingModule";
import { PredictiveMaintenanceModule } from "./modules/predictive/PredictiveMaintenanceModule";
import { MaintenanceModule } from "./modules/maintenance";
import { ProcessingPlantModule } from "./modules/crusher/ProcessingPlantModule";
import { StockpileModule } from "./modules/stockpile/StockpileModule";
import { LaboratoryModule } from "./modules/laboratory/LaboratoryModule";
import { SalesModule } from "./modules/sales/SalesModule";
import { WeighbridgeModule } from "./modules/weighbridge/WeighbridgeModule";
import { HRModule } from "./modules/hr/HRModule";
import { AttendanceModule } from "./modules/attendance/AttendanceModule";
import { ProcurementModule } from "./modules/procurement/ProcurementModule";
import { WarehouseModule } from "./modules/warehouse/WarehouseModule";
import { FinanceModule } from "./modules/finance/FinanceModule";
import { DocumentManagementModule } from "./modules/documents/DocumentManagementModule";
import { RKABComplianceModule } from "./modules/rkab/RKABComplianceModule";
import { BIDashboardBuilderModule } from "./modules/bi-builder/BIDashboardBuilderModule";
import { AIPredictionEngineModule } from "./modules/ai/AIPredictionEngineModule";
import { SmartAlertCenterModule } from "./modules/alerts/SmartAlertCenterModule";
import { MineSmartMobileApp } from "./modules/mobile/MineSmartMobileApp";
import { OfflineSyncCenterModule } from "./modules/offline/OfflineSyncCenterModule";
import { DataQualityCenterModule } from "./modules/quality/DataQualityCenterModule";
import { DigitalApprovalCenterModule } from "./modules/approval/DigitalApprovalCenterModule";
import { AuditTrailCenterModule } from "./modules/audit/AuditTrailCenterModule";
import { EnterpriseSecurityModule } from "./modules/security/EnterpriseSecurityModule";
import { AIAnalyticsModule } from "./modules/ai/AIAnalyticsModule";
import { ReportingBIIntegrationModule } from "./modules/reports/ReportingBIIntegrationModule";
import { CommercialReleaseModule } from "./modules/commercial/CommercialReleaseModule";
import { MultiCompanyHubModule } from "./modules/holding/MultiCompanyHubModule";
import { IntegrationHubModule } from "./modules/integration/IntegrationHubModule";
import { IoTCenterModule } from "./modules/iot/IoTCenterModule";
import { AICCTVModule } from "./modules/cctv/AICCTVModule";
import { AIRootCauseModule } from "./modules/rootcause/AIRootCauseModule";
import { AIReportGeneratorModule } from "./modules/reports/AIReportGeneratorModule";
import { DeveloperControlPanelModule } from "./modules/admin/DeveloperControlPanelModule";
import { NavigationModuleKey } from "./types";
import { INITIAL_PRODUCTION_LOGS, INITIAL_EQUIPMENT_LIST, INITIAL_FUEL_RECORDS, INITIAL_HSE_INCIDENTS } from "./data/mockData";

const MainAppContent: React.FC = () => {
  const { activeSite, isLicenseActive, isEmailVerified } = useAuth();
  const [currentView, setCurrentView] = useState<"landing" | "app">("landing");
  const [authPage, setAuthPage] = useState<"none" | "login" | "register" | "verify-email" | "verify-otp" | "forgot-password">("none");
  const [activeModule, setActiveModule] = useState<NavigationModuleKey | "profile">("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    (window as any).__NAVIGATE_MODULE__ = (mod: any) => setActiveModule(mod);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Auth Page Views
  if (authPage === "login") {
    return (
      <LoginPage
        onNavigateRegister={() => setAuthPage("register")}
        onNavigateForgotPassword={() => setAuthPage("forgot-password")}
        onLoginSuccess={() => {
          if (!isEmailVerified) {
            setAuthPage("verify-email");
          } else {
            setAuthPage("none");
            setCurrentView("app");
          }
        }}
      />
    );
  }

  if (authPage === "register") {
    return (
      <RegisterPage
        onNavigateLogin={() => setAuthPage("login")}
        onRegisterSuccess={() => setAuthPage("verify-email")}
      />
    );
  }

  if (authPage === "verify-email") {
    return (
      <VerifyEmailPage
        onVerifiedSuccess={() => {
          setAuthPage("none");
          setCurrentView("app");
        }}
      />
    );
  }

  if (authPage === "verify-otp") {
    return (
      <VerifyOtpPage
        onOtpSuccess={() => {
          setAuthPage("none");
          setCurrentView("app");
        }}
        onCancel={() => setAuthPage("none")}
      />
    );
  }

  if (authPage === "forgot-password") {
    return <ForgotPasswordPage onNavigateLogin={() => setAuthPage("login")} />;
  }

  // Handle module rendering router
  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return (
          <DashboardModule
            onOpenAICopilot={() => setActiveModule("ai")}
            onNavigateModule={(modKey) => setActiveModule(modKey)}
          />
        );

      case "ai":
        return <AICopilotModule />;

      case "profile":
        return <UserProfilePage />;

      case "security":
        return <EnterpriseSecurityModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "settings":
      case "users":
      case "roles":
      case "audit":
        return <SettingsModule />;

      case "license":
        return <LicenseHubModule />;

      case "multi-company":
      case "holding":
        return <MultiCompanyHubModule />;

      case "integration-hub":
      case "api-center":
        return <IntegrationHubModule />;

      case "iot-center":
      case "iot":
        return <IoTCenterModule />;

      case "cctv":
      case "ai-cctv":
        return <AICCTVModule />;

      case "root-cause":
      case "ai-root-cause":
        return <AIRootCauseModule />;

      case "developer-control-panel":
      case "control-panel":
      case "admin-panel":
        return (
          <DeveloperControlPanelModule
            onNavigateModule={(modKey) => setActiveModule(modKey as any)}
            onEnterCustomerView={() => setActiveModule("dashboard")}
          />
        );

      case "design-system":
        return <DesignSystemPage />;

      // Specialized Mining Modules
      case "gis":
        return <GISMapModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "mine-planning":
        return <MinePlanningModule />;

      case "geology":
        return <GeologyModule />;

      case "survey":
        return <SurveyModule />;

      case "production":
        return <ProductionModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "hauling":
        return <HaulingModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "stockpile":
        return <StockpileModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "weighbridge":
        return <WeighbridgeModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "laboratory":
        return <LaboratoryModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "sales":
      case "shipment":
        return <SalesModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "processing-plant":
      case "crusher":
      case "washing-plant":
        return <ProcessingPlantModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "equipment":
        return <EquipmentModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "fleet":
        return <FleetModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "dispatch":
        return <DispatchModule />;

      case "fuel":
        return <FuelModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "maintenance":
      case "predictive-maintenance":
        return <MaintenanceModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "hse":
        return <HSEModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "reclamation":
        return <ReclamationModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "environment":
        return <EnvironmentModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "hr":
        return <HRModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "attendance":
        return <AttendanceModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "procurement":
        return <ProcurementModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "warehouse":
        return <WarehouseModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "finance":
        return <FinanceModule />;

      case "documents":
      case "document-management":
        return <DocumentManagementModule />;

      case "rkab":
        return <RKABComplianceModule />;

      case "bi-builder":
        return <BIDashboardBuilderModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "ai-prediction":
      case "predictive":
        return <AIPredictionEngineModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "smart-alerts":
        return <SmartAlertCenterModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "mobile-app":
      case "mobile":
        return <MineSmartMobileApp onOpenAICopilot={() => setActiveModule("ai")} />;

      case "offline-sync":
      case "offline":
        return <OfflineSyncCenterModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "data-quality":
      case "quality-center":
        return <DataQualityCenterModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "digital-approval":
      case "approval":
      case "approvals":
        return <DigitalApprovalCenterModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "audit":
      case "audit-trail":
        return <AuditTrailCenterModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "security":
        return <EnterpriseSecurityModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "analytics":
        return <AIAnalyticsModule />;

      case "ai-reports":
      case "report-generator":
        return <AIReportGeneratorModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "reports":
        return <ReportingBIIntegrationModule onOpenAICopilot={() => setActiveModule("ai")} />;

      case "commercial":
        return <CommercialReleaseModule onOpenAICopilot={() => setActiveModule("ai")} />;

      default:
        return (
          <DashboardModule
            onOpenAICopilot={() => setActiveModule("ai")}
            onNavigateModule={(modKey) => setActiveModule(modKey)}
          />
        );
    }
  };

  // Render Landing Page
  if (currentView === "landing") {
    return (
      <>
        <LandingPage
          onEnterDashboard={() => setCurrentView("app")}
          onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
        />
        <LicenseActivationModal
          isOpen={isLicenseModalOpen}
          onClose={() => setIsLicenseModalOpen(false)}
        />
      </>
    );
  }

  // Render Main Platform Workspace with Security Guards
  return (
    <ProtectedRoute onNavigateLogin={() => setAuthPage("login")}>
      <LicenseGuard>
        <div className="min-h-screen bg-[#070E20] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 pb-16 lg:pb-0 transition-colors">
          <Header
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onOpenAICopilot={() => setActiveModule("ai")}
            onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
            activeModule={activeModule}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          />

          <div className="flex flex-1 overflow-hidden">
            <Sidebar
              activeModule={activeModule as NavigationModuleKey}
              onSelectModule={(mod) => setActiveModule(mod)}
              isOpen={isSidebarOpen}
              onCloseMobile={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {renderModule()}
            </main>
          </div>

          <Footer />

          {/* Mobile Bottom Navigation */}
          <MobileNavigation
            activeModule={activeModule as NavigationModuleKey}
            onSelectModule={(mod) => setActiveModule(mod)}
            onOpenMobileMenu={() => setIsSidebarOpen(true)}
            onOpenNotifications={() => {
              if ((window as any).__OPEN_NOTIFICATION_CENTER__) {
                (window as any).__OPEN_NOTIFICATION_CENTER__();
              }
            }}
          />

          {/* Modals */}
          <LicenseActivationModal
            isOpen={isLicenseModalOpen}
            onClose={() => setIsLicenseModalOpen(false)}
          />

          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
          />
        </div>
      </LicenseGuard>
    </ProtectedRoute>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <LanguageProvider>
          <AuthProvider>
            <LicenseProvider>
              <MainAppContent />
            </LicenseProvider>
          </AuthProvider>
        </LanguageProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
