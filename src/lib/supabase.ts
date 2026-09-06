import { createClient } from '@supabase/supabase-js';

if (typeof window === 'undefined') {
  try {
    const dns = require('dns');
    if (dns && typeof dns.setDefaultResultOrder === 'function') {
      dns.setDefaultResultOrder('ipv4first');
    }
  } catch {
    // Ignore
  }
}

const NEW_PROJECT_URL = 'https://vbmznehiwviydvextdgb.supabase.co';
const NEW_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibXpuZWhpd3ZpeWR2ZXh0ZGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MTI0OTMsImV4cCI6MjEwNDI4ODQ5M30.KeAy6f-WZKzR5V4LJXQjzJi73JxiE7_og7zqVFP2bBA';
const NEW_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibXpuZWhpd3ZpeWR2ZXh0ZGdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODcxMjQ5MywiZXhwIjoyMTA0Mjg4NDkzfQ.rlDJ_sZLpKoUHYio-6eFJvFhR-xLasq3rQs_va3PQl4';

export const supabaseUrl = NEW_PROJECT_URL;
export const supabaseAnonKey = NEW_ANON_KEY;
export const supabaseServiceRoleKey = NEW_SERVICE_ROLE_KEY;

export const supabaseBrowser = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const supabaseServer =
  supabaseUrl && supabaseServiceRoleKey ? createClient(supabaseUrl, supabaseServiceRoleKey, { auth: { persistSession: false } }) : null;
