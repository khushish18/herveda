import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const getSupabaseUrl = (): string => {
  const runtimeProcess = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  };
  return (
    runtimeProcess.process?.env?.EXPO_PUBLIC_SUPABASE_URL?.trim() ||
    Constants.expoConfig?.extra?.supabaseUrl?.trim() ||
    ''
  );
};

const getSupabaseAnonKey = (): string => {
  const runtimeProcess = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  };
  return (
    runtimeProcess.process?.env?.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    Constants.expoConfig?.extra?.supabaseAnonKey?.trim() ||
    ''
  );
};

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase Client Warning]: EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY is missing. ' +
    'Please set these environment variables in your frontend .env file.'
  );
}

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
