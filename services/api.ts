import { supabase } from '../config/supabase';

// Helper to resolve the backend API URL.
// When testing on a physical device, set EXPO_PUBLIC_BACKEND_URL to your machine's LAN IP (e.g. http://192.168.1.X:5000).
const getBackendUrl = (): string => {
  const runtimeProcess = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  };
  return (
    runtimeProcess.process?.env?.EXPO_PUBLIC_BACKEND_URL?.trim() ||
    'http://localhost:5000'
  );
};

const BASE_URL = getBackendUrl();

console.log(`[API Client] Initialized with Base URL: ${BASE_URL}`);

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Custom fetch client that handles headers, tokens, and errors.
 */
async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { requiresAuth = true, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers || {});

  // Append Content-Type if not already specified (except for FormData if used)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach Supabase access token if route is protected
  if (requiresAuth) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn(`[API Client Warning] Attempted to fetch protected route "${path}" but no active session token was found.`);
    }
  }

  const resolvedUrl = `${BASE_URL}${path}`;

  try {
    const response = await fetch(resolvedUrl, {
      ...fetchOptions,
      headers,
    });

    let payload: any;
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      payload = await response.json();
    } else {
      payload = await response.text();
    }

    if (!response.ok) {
      // Map server-provided structured errors if available
      const message = payload?.error?.message || payload?.message || `HTTP error ${response.status}: ${response.statusText}`;
      const error = new Error(message);
      (error as any).statusCode = response.status;
      (error as any).code = payload?.error?.code || 'HTTP_ERROR';
      throw error;
    }

    // Server-side response payload wrapped in { success: true, data: T }
    return (payload?.data ?? payload) as T;
  } catch (error) {
    console.error(`[API Client Error] Request to ${resolvedUrl} failed:`, error);
    throw error;
  }
}

export interface ProfileData {
  id?: string;
  userId?: string;
  fullName: string;
  age: string;
  height: string;
  weight: string;
  lifeStage: string;
  dietPreference: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MealAnalysisPayload {
  image: string; // Base64 string
  mimeType?: string;
}

export interface MealAnalysisResult {
  id: string;
  user_id: string;
  image_url: string; // Private Signed URL from Supabase
  storage_path: string;
  meal_name: string;
  confidence: number;
  foods: string[];
  estimated_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  iron: 'Low' | 'Moderate' | 'High';
  calcium: 'Low' | 'Moderate' | 'High';
  vitamin_d: 'Low' | 'Moderate' | 'High';
  folate: 'Low' | 'Moderate' | 'High';
  health_score: number;
  ai_insights: string[];
  created_at: string;
}

/**
 * Unified Backend API service functions.
 */
export const apiService = {
  /**
   * Health status check
   */
  async healthCheck(): Promise<any> {
    return apiFetch<any>('/api/health', { method: 'GET', requiresAuth: false });
  },

  /**
   * Fetch current authenticated user's profile
   */
  async getMyProfile(): Promise<ProfileData | null> {
    const rawData = await apiFetch<any>('/api/profiles/me', { method: 'GET' });
    if (!rawData) {
      return null;
    }
    // Map backend database columns (snake_case) to frontend states (camelCase)
    return {
      id: rawData.id,
      userId: rawData.user_id,
      fullName: rawData.full_name || '',
      age: rawData.age ? String(rawData.age) : '',
      height: rawData.height ? String(rawData.height) : '',
      weight: rawData.weight ? String(rawData.weight) : '',
      lifeStage: rawData.life_stage || 'General Wellness',
      dietPreference: rawData.diet_preference || 'Vegetarian',
      createdAt: rawData.created_at,
      updatedAt: rawData.updated_at,
    };
  },

  /**
   * Upsert current authenticated user's profile
   */
  async upsertProfile(profile: Omit<ProfileData, 'id' | 'userId'>): Promise<ProfileData> {
    const rawData = await apiFetch<any>('/api/profiles', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
    return {
      id: rawData.id,
      userId: rawData.user_id,
      fullName: rawData.full_name,
      age: String(rawData.age || ''),
      height: String(rawData.height || ''),
      weight: String(rawData.weight || ''),
      lifeStage: rawData.life_stage,
      dietPreference: rawData.diet_preference,
      createdAt: rawData.created_at,
      updatedAt: rawData.updated_at,
    };
  },

  /**
   * Request secure Gemini meal analysis from the backend
   */
  async analyzeMeal(image: string, mimeType?: string): Promise<MealAnalysisResult> {
    return apiFetch<MealAnalysisResult>('/api/meals/analyze', {
      method: 'POST',
      body: JSON.stringify({ image, mimeType }),
    });
  },
};
