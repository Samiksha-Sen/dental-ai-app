import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Read credentials strictly from environment variables (Requirement 2, 12, 13)
const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Warning: SUPABASE_URL and/or SUPABASE_ANON_KEY environment variables are not set. Check your .env file.'
  );
}

// Reusable Supabase client configured with persistent sessions (Requirement 1, 2, 3)
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});
