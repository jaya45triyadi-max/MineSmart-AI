import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceKey?: string;
  isConnected: boolean;
  lastConnectedAt?: string;
  latencyMs?: number;
}

const STORAGE_KEY = "minesmart_supabase_config";

// Read from env or local storage
const getSavedConfig = (): SupabaseConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // Ignore storage parse error
  }

  return {
    url: (import.meta as any).env?.VITE_SUPABASE_URL || "",
    anonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "",
    isConnected: false,
  };
};

let currentConfig: SupabaseConfig = getSavedConfig();
let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (supabaseInstance) return supabaseInstance;

  if (currentConfig.url && currentConfig.anonKey) {
    try {
      supabaseInstance = createClient(currentConfig.url, currentConfig.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      });
      return supabaseInstance;
    } catch (err) {
      console.error("Failed to initialize Supabase client:", err);
      return null;
    }
  }

  return null;
};

export const getSupabaseConfig = (): SupabaseConfig => {
  return { ...currentConfig };
};

export const saveSupabaseConfig = (config: Partial<SupabaseConfig>): SupabaseConfig => {
  currentConfig = {
    ...currentConfig,
    ...config,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentConfig));
  } catch (e) {
    console.error("Failed to persist Supabase config:", e);
  }

  // Reset instance to re-instantiate on next get
  supabaseInstance = null;
  if (currentConfig.url && currentConfig.anonKey) {
    getSupabaseClient();
  }

  return currentConfig;
};

export const testSupabaseConnection = async (
  url: string,
  anonKey: string
): Promise<{ success: boolean; latencyMs: number; error?: string }> => {
  const startTime = performance.now();
  try {
    const tempClient = createClient(url, anonKey);
    // Ping with a lightweight query or auth check
    const { error } = await tempClient.from("profiles").select("count", { count: "exact", head: true });
    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    // Even if table doesn't exist yet, 404 or 401 with proper auth response confirms URL reachable
    const isSuccess = !error || error.code === "PGRST116" || error.code === "42P01" || error.message.includes("does not exist");

    return {
      success: isSuccess,
      latencyMs: latency,
      error: !isSuccess ? error.message : undefined,
    };
  } catch (err: any) {
    const endTime = performance.now();
    return {
      success: false,
      latencyMs: Math.round(endTime - startTime),
      error: err.message || "Connection refused or invalid URL",
    };
  }
};
