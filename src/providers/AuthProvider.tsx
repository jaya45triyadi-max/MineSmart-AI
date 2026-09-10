import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "../services/firebase/config";
import { AuthService, RegisterPayload } from "../services/auth/auth-service";
import { LicenseService } from "../services/license/license-service";
import { UserRepository } from "../services/repositories/UserRepository";
import { companyRepository } from "../services/repositories/CompanyRepository";
import { siteRepository } from "../services/repositories/SiteRepository";
import { UserProfile, Company, Site, LicenseInfo, UserRole } from "../types";
import {
  HoldingGroup,
  MultiCompanyEntity,
  MultiSiteEntity,
  TenantScopeLevel,
} from "../types/multiCompanyTypes";
import {
  HOLDING_GROUP_DATA,
  MULTI_COMPANIES_DATA,
  MULTI_SITES_DATA,
} from "../data/multiCompanyData";
import { DEMO_COMPANY, DEMO_SITES, DEMO_USERS } from "../data/mockData";

interface AuthContextType {
  authLoading: boolean;
  currentUser: UserProfile;
  holding: HoldingGroup;
  companies: MultiCompanyEntity[];
  company: MultiCompanyEntity;
  activeCompany: MultiCompanyEntity;
  sites: MultiSiteEntity[];
  activeSite: MultiSiteEntity;
  activeScope: TenantScopeLevel;
  isHoldingScope: boolean;
  license: LicenseInfo | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isLicenseActive: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  sendVerificationEmail: () => Promise<boolean>;
  verifyOTP: (code: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchHoldingView: () => void;
  switchCompany: (companyId: string) => void;
  switchSite: (siteId: string) => void;
  switchRole: (role: UserRole) => void;
  switchUserAccount: (userUid: string) => void;
  activateNewLicense: (key: string) => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]);
  const [holding, setHolding] = useState<HoldingGroup>(HOLDING_GROUP_DATA);
  const [companies, setCompanies] = useState<MultiCompanyEntity[]>(MULTI_COMPANIES_DATA);
  const [company, setCompany] = useState<MultiCompanyEntity>(MULTI_COMPANIES_DATA[0]);
  const [sites, setSites] = useState<MultiSiteEntity[]>(
    MULTI_SITES_DATA.filter((s) => s.companyId === MULTI_COMPANIES_DATA[0].id)
  );
  const [activeSite, setActiveSite] = useState<MultiSiteEntity>(MULTI_SITES_DATA[0]);
  const [activeScope, setActiveScope] = useState<TenantScopeLevel>("COMPANY");
  const [license, setLicense] = useState<LicenseInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(true);

  // Initialize Auth State & Listeners
  useEffect(() => {
    // Load local stored license
    const storedLic = LicenseService.getStoredLicense();
    setLicense(storedLic);

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser && fbUser.email) {
        setIsAuthenticated(true);
        setIsEmailVerified(fbUser.emailVerified);

        const userRepo = new UserRepository();
        const profile = await userRepo.getUserByEmail(fbUser.email);

        if (profile) {
          setCurrentUser(profile);
          const foundCompany = MULTI_COMPANIES_DATA.find((c) => c.id === profile.companyId) || MULTI_COMPANIES_DATA[0];
          setCompany(foundCompany);

          const compSites = MULTI_SITES_DATA.filter((s) => s.companyId === foundCompany.id);
          setSites(compSites);
          const foundSite = compSites.find((s) => s.id === profile.activeSiteId) || compSites[0];
          if (foundSite) setActiveSite(foundSite);
        }
      } else {
        // Default to active demo session
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setAuthLoading(true);
    try {
      const result = await AuthService.login(email, pass);
      setCurrentUser(result.user);
      const foundCompany = MULTI_COMPANIES_DATA.find((c) => c.id === result.company.id) || MULTI_COMPANIES_DATA[0];
      setCompany(foundCompany);
      const compSites = MULTI_SITES_DATA.filter((s) => s.companyId === foundCompany.id);
      setSites(compSites);
      const foundSite = compSites.find((s) => s.id === result.user.activeSiteId) || compSites[0];
      if (foundSite) setActiveSite(foundSite);
      setIsAuthenticated(true);
      setIsEmailVerified(true);

      if (result.company.licenseKey) {
        const lic = LicenseService.verifyKeyLocally(result.company.licenseKey);
        setLicense(lic);
      }
      setAuthLoading(false);
      return true;
    } catch (err) {
      setAuthLoading(false);
      throw err;
    }
  };

  const register = async (payload: RegisterPayload): Promise<boolean> => {
    setAuthLoading(true);
    try {
      const result = await AuthService.register(payload);
      setCurrentUser(result.user);
      const foundCompany = MULTI_COMPANIES_DATA.find((c) => c.id === result.company.id) || MULTI_COMPANIES_DATA[0];
      setCompany(foundCompany);
      setIsAuthenticated(true);
      setIsEmailVerified(false);
      setAuthLoading(false);
      return true;
    } catch (err) {
      setAuthLoading(false);
      throw err;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    return AuthService.forgotPassword(email);
  };

  const sendVerificationEmail = async (): Promise<boolean> => {
    return AuthService.sendVerificationEmail();
  };

  const verifyOTP = async (code: string): Promise<boolean> => {
    return AuthService.verifyOTP(code, currentUser.email);
  };

  const logout = async (): Promise<void> => {
    await AuthService.logout();
    setIsAuthenticated(false);
  };

  // Switch to Holding-wide consolidated scope
  const switchHoldingView = () => {
    setActiveScope("HOLDING");
    if ((window as any).__NAVIGATE_MODULE__) {
      (window as any).__NAVIGATE_MODULE__("multi-company");
    }
  };

  // Switch Company (Isolates all operational views & repositories to this Company)
  const switchCompany = (companyId: string) => {
    const targetComp = companies.find((c) => c.id === companyId);
    if (targetComp) {
      setCompany(targetComp);
      setActiveScope("COMPANY");

      // Filter sites strictly for this company
      const compSites = MULTI_SITES_DATA.filter((s) => s.companyId === targetComp.id);
      setSites(compSites);
      if (compSites.length > 0) {
        setActiveSite(compSites[0]);
        setCurrentUser((prev) => ({
          ...prev,
          companyId: targetComp.id,
          companyName: targetComp.displayName,
          siteIds: compSites.map((s) => s.id),
          activeSiteId: compSites[0].id,
        }));
      }
    }
  };

  // Switch Site (Granular Pit/Site level under active Company)
  const switchSite = (siteId: string) => {
    const found = sites.find((s) => s.id === siteId) || MULTI_SITES_DATA.find((s) => s.id === siteId);
    if (found) {
      setActiveSite(found);
      setActiveScope("SITE");
      setCurrentUser((prev) => ({
        ...prev,
        activeSiteId: siteId,
      }));

      // If site belongs to a different company, align company as well
      if (found.companyId !== company.id) {
        const foundComp = companies.find((c) => c.id === found.companyId);
        if (foundComp) {
          setCompany(foundComp);
          const compSites = MULTI_SITES_DATA.filter((s) => s.companyId === foundComp.id);
          setSites(compSites);
        }
      }
    }
  };

  const switchRole = (role: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role,
    }));
  };

  const switchUserAccount = (userUid: string) => {
    const found = DEMO_USERS.find((u) => u.uid === userUid);
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      setIsEmailVerified(true);
      const targetCompany = companies.find((c) => c.id === found.companyId) || companies[0];
      setCompany(targetCompany);
      const compSites = MULTI_SITES_DATA.filter((s) => s.companyId === targetCompany.id);
      setSites(compSites);
      const site = compSites.find((s) => s.id === found.activeSiteId) || compSites[0];
      if (site) setActiveSite(site);
    }
  };

  const activateNewLicense = async (key: string): Promise<boolean> => {
    try {
      const updatedLicense = await LicenseService.verifyAndActivateKey(key);
      setLicense(updatedLicense);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const isLicenseActive = license ? license.status === "ACTIVE" : true;
  const isHoldingScope = activeScope === "HOLDING";

  return (
    <AuthContext.Provider
      value={{
        authLoading,
        currentUser,
        holding,
        companies,
        company,
        activeCompany: company,
        sites,
        activeSite,
        activeScope,
        isHoldingScope,
        license,
        isAuthenticated,
        isEmailVerified,
        isLicenseActive,
        login,
        register,
        forgotPassword,
        sendVerificationEmail,
        verifyOTP,
        logout,
        switchHoldingView,
        switchCompany,
        switchSite,
        switchRole,
        switchUserAccount,
        activateNewLicense,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
