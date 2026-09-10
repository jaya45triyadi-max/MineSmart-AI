import React from "react";
import { LayoutDashboard, Smartphone, Bot, Bell, Menu } from "lucide-react";
import { NavigationModuleKey } from "../../types";

export interface MobileNavigationProps {
  activeModule: NavigationModuleKey;
  onSelectModule: (module: NavigationModuleKey) => void;
  onOpenMobileMenu: () => void;
  onOpenNotifications: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeModule,
  onSelectModule,
  onOpenMobileMenu,
  onOpenNotifications,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-800 bg-[#070E20]/95 px-2 backdrop-blur-md lg:hidden shadow-lg text-slate-300">
      <button
        onClick={() => onSelectModule("dashboard")}
        className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold ${
          activeModule === "dashboard"
            ? "text-purple-400"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <LayoutDashboard className="h-5 w-5" />
        <span>Executive</span>
      </button>

      <button
        onClick={() => onSelectModule("mobile-app")}
        className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold ${
          activeModule === "mobile-app"
            ? "text-purple-400 font-black"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <Smartphone className="h-5 w-5" />
        <span>App Lapangan</span>
      </button>

      {/* Center AI Copilot Button */}
      <button
        onClick={() => onSelectModule("ai")}
        className="flex h-12 w-12 -mt-5 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-amber-500 text-white shadow-xl shadow-purple-600/30 border-2 border-[#070E20] active:scale-95 cursor-pointer"
        title="AI Copilot"
      >
        <Bot className="h-6 w-6" />
      </button>

      <button
        onClick={onOpenNotifications}
        className="flex flex-col items-center gap-1 p-1 text-[10px] font-bold text-slate-400 hover:text-white relative"
      >
        <Bell className="h-5 w-5" />
        <span>Alerts</span>
        <span className="absolute top-1 right-3 h-2 w-2 rounded-full bg-rose-500" />
      </button>

      <button
        onClick={onOpenMobileMenu}
        className="flex flex-col items-center gap-1 p-1 text-[10px] font-bold text-slate-400 hover:text-white"
      >
        <Menu className="h-5 w-5" />
        <span>Menu</span>
      </button>
    </nav>
  );
};
