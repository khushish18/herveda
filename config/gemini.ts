import Constants from "expo-constants";

const getEnvValue = () => {
  const runtimeProcess = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  };

  const fromEnv =
    runtimeProcess.process?.env?.EXPO_PUBLIC_GEMINI_API_KEY?.trim();
  if (fromEnv) {
    return fromEnv;
  }

  const fromExpoConfig = Constants.expoConfig?.extra?.geminiApiKey?.trim();
  return fromExpoConfig || "";
};

export const GEMINI_API_KEY = getEnvValue();
export const GEMINI_MODEL = "gemini-3.6-flash";
