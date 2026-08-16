import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { supabase } from '../config/supabase';
import { apiService, ProfileData } from '../services/api';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: ProfileData | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to fetch user profile details from the backend database
  const loadProfile = async (currentSession: Session | null) => {
    if (!currentSession) {
      setProfile(null);
      return;
    }
    try {
      const data = await apiService.getMyProfile();
      setProfile(data);
    } catch (err) {
      console.warn('[AuthProvider] Failed to load user profile from backend:', err);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (session) {
      await loadProfile(session);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[AuthProvider] Error signing out:', err);
    } finally {
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 1. Restore persistent session on startup
    const checkSession = async () => {
      try {
        const { data: { session: restoredSession } } = await supabase.auth.getSession();
        setSession(restoredSession);
        setUser(restoredSession?.user ?? null);
        
        if (restoredSession) {
          await loadProfile(restoredSession);
        }
      } catch (err) {
        console.error('[AuthProvider] Session restoration failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // 2. Subscribe to Supabase auth state change events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log(`[AuthProvider] Auth Event: ${event}`);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession) {
        // If logged in or token refreshed, load user profile from Express backend
        await loadProfile(currentSession);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    // 3. Handle deep link URL redirect for email confirmation
    const handleDeepLink = async (url: string) => {
      console.log('[AuthProvider] Received Deep Link:', url);
      try {
        const parsed = Linking.parse(url.replace('#', '?'));
        const { access_token, refresh_token } = parsed.queryParams || {};
        const token = Array.isArray(access_token) ? access_token[0] : access_token;
        const refresh = Array.isArray(refresh_token) ? refresh_token[0] : refresh_token;

        if (token && refresh) {
          console.log('[AuthProvider] Found tokens in deep link. Setting session...');
          const { error } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: refresh,
          });
          if (error) {
            console.error('[AuthProvider] Error setting session from deep link:', error.message);
          }
        }
      } catch (err) {
        console.error('[AuthProvider] Deep link parsing error:', err);
      }
    };

    // Get initial URL if the app was launched by a link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Listen for incoming URLs while the app is active
    const linkingSubscription = Linking.addEventListener('url', (event) => {
      if (event.url) {
        handleDeepLink(event.url);
      }
    });

    return () => {
      subscription.unsubscribe();
      linkingSubscription.remove();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, profile, isLoading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
