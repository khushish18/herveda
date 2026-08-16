import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = (
  process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ||
  Constants.expoConfig?.extra?.supabaseUrl?.trim() ||
  ''
);

const supabaseAnonKey = (
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  Constants.expoConfig?.extra?.supabaseAnonKey?.trim() ||
  ''
);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase Client Warning]: EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY is missing. ' +
    'Please set these environment variables in your frontend .env file.'
  );
}

console.log('[Supabase Config Diagnostic]:', {
  EXPO_PUBLIC_SUPABASE_URL_Loaded: !!process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY_Loaded: !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  Resolved_Supabase_URL: supabaseUrl,
});

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
