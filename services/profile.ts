import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserProfile {
  fullName: string;
  age: string;
  height: string;
  weight: string;
  lifeStage: string;
  dietPreference: string;
}

const PROFILE_KEY = "@herveda_user_profile";

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as UserProfile;
    return parsed;
  } catch (error) {
    console.warn("Unable to parse user profile", error);
    return null;
  }
}
