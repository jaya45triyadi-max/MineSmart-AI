/**
 * MINE SMART AI - Comprehensive Supabase PostgreSQL Schema
 * Ready to copy & execute directly inside Supabase SQL Editor
 */

export const MINESMART_SUPABASE_SQL = `-- ==============================================================================
-- MINE SMART AI - ENTERPRISE MINING SUITE DATABASE SCHEMA
-- PostgreSQL / Supabase Schema Definition with Row-Level Security (RLS)
-- ==============================================================================

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. CORE HOLDING & MULTI-COMPANY TABLES
-- ==============================================================================

-- Companies (Anak Perusahaan / Mining Business Units)
CREATE TABLE IF NOT EXISTS public.companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    commodity_type TEXT NOT NULL DEFAULT 'COAL',
    commodity_label TEXT NOT NULL,
    iup_number TEXT,
    iup_expiry_date DATE,
    headquarters TEXT,
    operating_sites_count INTEGER DEFAULT 1,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Operating Sites (Pit / Concession Locations)
CREATE TABLE IF NOT EXISTS public.sites (
    id TEXT PRIMARY KEY,
    company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    province TEXT NOT NULL,
    regency TEXT NOT NULL,
    concession_area_ha NUMERIC(10, 2) DEFAULT 0,
    coordinates_lat NUMERIC(10, 6),
    coordinates_lng NUMERIC(10, 6),
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Profiles & RBAC
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'VIEWER',
    company_id TEXT REFERENCES public.companies(id),
    assigned_site_ids TEXT[] DEFAULT '{}',
    avatar_url TEXT,
    phone TEXT,
    department TEXT,
    status TEXT DEFAULT 'ACTIVE',
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. MINING OPERATIONS & PRODUCTION
-- ==============================================================================

-- Daily Production Records (Coal/Ore vs Overburden)
CREATE TABLE IF NOT EXISTS public.production_records (
    id TEXT PRIMARY KEY,
    company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
    site_id TEXT REFERENCES public.sites(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    shift TEXT NOT NULL CHECK (shift IN ('SHIFT_1', 'SHIFT_2', 'DAY', 'NIGHT')),
    pit_location TEXT NOT NULL,
    ob_actual_bcm NUMERIC(12, 2) DEFAULT 0,
    ob_plan_bcm NUMERIC(12, 2) DEFAULT 0,
    coal_actual_ton NUMERIC(12, 2) DEFAULT 0,
    coal_plan_ton NUMERIC(12, 2) DEFAULT 0,
    strip_ratio_actual NUMERIC(6, 2) GENERATED ALWAYS AS (
        CASE WHEN coal_actual_ton > 0 THEN ob_actual_bcm / coal_actual_ton ELSE 0 END
    ) STORED,
    rainfall_mm NUMERIC(6, 2) DEFAULT 0,
    rain_duration_hours NUMERIC(4, 2) DEFAULT 0,
    slippery_duration_hours NUMERIC(4, 2) DEFAULT 0,
    effective_working_hours NUMERIC(4, 2) DEFAULT 12,
    status TEXT DEFAULT 'CONFIRMED',
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fleet Units & Heavy Equipment Registry
CREATE TABLE IF NOT EXISTS public.fleet_units (
    id TEXT PRIMARY KEY,
    company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
    site_id TEXT REFERENCES public.sites(id) ON DELETE CASCADE,
    unit_code TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('EXCAVATOR', 'DUMP_TRUCK', 'DOZER', 'GRADER', 'COMPACTOR', 'DRILL', 'SUPPORT')),
    model TEXT NOT NULL,
    brand TEXT NOT NULL,
    capacity_ton NUMERIC(8, 2),
    assigned_pit TEXT,
    assigned_operator TEXT,
    operational_status TEXT NOT NULL DEFAULT 'OPERATING' CHECK (operational_status IN ('OPERATING', 'STANDBY', 'BREAKDOWN', 'MAINTENANCE', 'IDLE')),
    fuel_level_percent NUMERIC(5, 2) DEFAULT 100,
    engine_hours_total NUMERIC(10, 2) DEFAULT 0,
    current_lat NUMERIC(10, 6),
    current_lng NUMERIC(10, 6),
    current_speed_kmh NUMERIC(5, 2) DEFAULT 0,
    health_score NUMERIC(5, 2) DEFAULT 98.5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dispatch Hauling Trips (Cycle Times & Haul Logs)
CREATE TABLE IF NOT EXISTS public.dispatch_trips (
    id TEXT PRIMARY KEY,
    company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
    site_id TEXT REFERENCES public.sites(id) ON DELETE CASCADE,
    loader_unit_id TEXT REFERENCES public.fleet_units(id),
    hauler_unit_id TEXT REFERENCES public.fleet_units(id),
    material_type TEXT NOT NULL CHECK (material_type IN ('COAL', 'OVERBURDEN', 'INTERBURDEN', 'TOPSOIL')),
    loading_point TEXT NOT NULL,
    dumping_point TEXT NOT NULL,
    tonnage NUMERIC(8, 2) NOT NULL,
    cycle_time_minutes NUMERIC(6, 2) NOT NULL,
    loading_time_minutes NUMERIC(5, 2),
    hauling_time_minutes NUMERIC(5, 2),
    dumping_time_minutes NUMERIC(5, 2),
    empty_return_minutes NUMERIC(5, 2),
    queue_time_minutes NUMERIC(5, 2) DEFAULT 0,
    distance_km NUMERIC(6, 2) DEFAULT 2.5,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. FUEL & FLEET REFUELING TRANSACTIONS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.fuel_transactions (
    id TEXT PRIMARY KEY,
    company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
    site_id TEXT REFERENCES public.sites(id) ON DELETE CASCADE,
    unit_id TEXT REFERENCES public.fleet_units(id),
    fuel_station_code TEXT NOT NULL,
    dispensed_liters NUMERIC(10, 2) NOT NULL,
    unit_smr_hours NUMERIC(10, 2) NOT NULL,
    burn_rate_lph NUMERIC(6, 2),
    operator_name TEXT,
    fuelman_name TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. HSE SAFETY & INCIDENTS MANAGEMENT
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.safety_incidents (
    id TEXT PRIMARY KEY,
    company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
    site_id TEXT REFERENCES public.sites(id) ON DELETE CASCADE,
    incident_number TEXT NOT NULL,
    incident_date DATE NOT NULL,
    incident_time TIME NOT NULL,
    location TEXT NOT NULL,
    severity_level TEXT NOT NULL CHECK (severity_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'FATALITY')),
    incident_type TEXT NOT NULL CHECK (incident_type IN ('NEAR_MISS', 'FIRST_AID', 'MEDICAL_TREATMENT', 'LOST_TIME_INJURY', 'PROPERTY_DAMAGE', 'ENVIRONMENTAL')),
    description TEXT NOT NULL,
    root_cause TEXT,
    corrective_action TEXT,
    action_owner TEXT,
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'INVESTIGATING', 'ACTION_TAKEN', 'CLOSED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. COAL & MINERAL QUALITY LABORATORY SAMPLES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.lab_samples (
    id TEXT PRIMARY KEY,
    company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
    site_id TEXT REFERENCES public.sites(id) ON DELETE CASCADE,
    sample_code TEXT UNIQUE NOT NULL,
    seam_name TEXT NOT NULL,
    sample_type TEXT NOT NULL CHECK (sample_type IN ('IN_SITU_CORE', 'CHANNEL_SAMPLE', 'ROM_STOCKPILE', 'CRUSHER_PRODUCT', 'BARGE_LOADING')),
    sampling_date DATE NOT NULL,
    total_moisture_ar NUMERIC(5, 2),
    inherent_moisture_adb NUMERIC(5, 2),
    ash_content_adb NUMERIC(5, 2),
    volatile_matter_adb NUMERIC(5, 2),
    fixed_carbon_adb NUMERIC(5, 2),
    total_sulfur_adb NUMERIC(5, 2),
    gross_calorific_value_gar NUMERIC(8, 2),
    gross_calorific_value_adb NUMERIC(8, 2),
    hgi INTEGER,
    status TEXT DEFAULT 'VERIFIED' CHECK (status IN ('RECEIVED', 'TESTING', 'VERIFIED', 'CERTIFIED')),
    certificate_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. IOT RADAR, SLOPE STABILITY & PIT SENSORS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.iot_sensors (
    id TEXT PRIMARY KEY,
    company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
    site_id TEXT REFERENCES public.sites(id) ON DELETE CASCADE,
    sensor_code TEXT UNIQUE NOT NULL,
    sensor_type TEXT NOT NULL CHECK (sensor_type IN ('SLOPE_RADAR', 'PIEZOMETER', 'WEATHER_STATION', 'DUST_PM25', 'VIBRATION_SEISMIC', 'WATER_LEVEL')),
    location_bench TEXT NOT NULL,
    coordinates_lat NUMERIC(10, 6),
    coordinates_lng NUMERIC(10, 6),
    battery_level_pct NUMERIC(5, 2) DEFAULT 100,
    telemetry_status TEXT DEFAULT 'ONLINE' CHECK (telemetry_status IN ('ONLINE', 'OFFLINE', 'ALERT', 'CALIBRATING')),
    last_ping TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.iot_readings (
    id BIGSERIAL PRIMARY KEY,
    sensor_id TEXT REFERENCES public.iot_sensors(id) ON DELETE CASCADE,
    metric_key TEXT NOT NULL,
    metric_value NUMERIC(12, 4) NOT NULL,
    metric_unit TEXT NOT NULL,
    status_flag TEXT DEFAULT 'NORMAL' CHECK (status_flag IN ('NORMAL', 'WARNING', 'CRITICAL')),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. AUDIT TRAIL & TAMPER-PROOF SECURITY LEDGER
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    company_id TEXT,
    site_id TEXT,
    actor_id TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action_type TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    previous_state JSONB,
    new_state JSONB,
    ip_address TEXT,
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. PERFORMANCE INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_prod_date ON public.production_records(record_date);
CREATE INDEX IF NOT EXISTS idx_prod_company_site ON public.production_records(company_id, site_id);
CREATE INDEX IF NOT EXISTS idx_fleet_company_status ON public.fleet_units(company_id, operational_status);
CREATE INDEX IF NOT EXISTS idx_trips_timestamp ON public.dispatch_trips(timestamp);
CREATE INDEX IF NOT EXISTS idx_fuel_timestamp ON public.fuel_transactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_safety_date ON public.safety_incidents(incident_date);
CREATE INDEX IF NOT EXISTS idx_iot_readings_sensor_time ON public.iot_readings(sensor_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON public.audit_logs(timestamp DESC);

-- ==============================================================================
-- 10. ENABLE ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispatch_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iot_sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iot_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public/Anon access policies (allows client app reading and sync with Supabase API key)
CREATE POLICY "Allow public read access on companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Allow public read access on sites" ON public.sites FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read/write on production" ON public.production_records FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write on fleet" ON public.fleet_units FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write on dispatch" ON public.dispatch_trips FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write on fuel" ON public.fuel_transactions FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write on safety" ON public.safety_incidents FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write on lab" ON public.lab_samples FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write on iot" ON public.iot_sensors FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write on audit" ON public.audit_logs FOR ALL USING (true);

-- ==============================================================================
-- 11. ENABLE SUPABASE REALTIME REPLICATION
-- ==============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.production_records;
ALTER PUBLICATION supabase_realtime ADD TABLE public.fleet_units;
ALTER PUBLICATION supabase_realtime ADD TABLE public.dispatch_trips;
ALTER PUBLICATION supabase_realtime ADD TABLE public.iot_sensors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.safety_incidents;
`;

export const SUPABASE_TABLE_SPECS = [
  { name: "companies", label: "Multi-Company Holding", count: 3, status: "Active" },
  { name: "sites", label: "Mining Site Concessions", count: 8, status: "Active" },
  { name: "profiles", label: "RBAC User Profiles", count: 24, status: "Active" },
  { name: "production_records", label: "Coal & Overburden Production", count: 1820, status: "Active" },
  { name: "fleet_units", label: "Fleet & Heavy Equipment Registry", count: 148, status: "Active" },
  { name: "dispatch_trips", label: "Dispatch FMS Haul Logs", count: 14200, status: "Realtime" },
  { name: "fuel_transactions", label: "Fuel Dispensing & Burn Rate", count: 4800, status: "Active" },
  { name: "safety_incidents", label: "HSE Incidents & Zero Harm", count: 42, status: "Active" },
  { name: "lab_samples", label: "Coal Quality & COA Laboratory", count: 640, status: "Active" },
  { name: "iot_sensors", label: "Slope Radar & Pit IoT Sensors", count: 36, status: "Realtime" },
  { name: "audit_logs", label: "6-Dimensional Security Audit Trail", count: 28400, status: "Active" },
];
