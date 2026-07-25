import AsyncStorage from "@react-native-async-storage/async-storage";

export interface MealHistoryEntry {
  id: string;
  mealName: string;
  imageUri: string;
  calories: number;
  healthScore: number;
  scannedAt: string;
  aiInsights: string[];
}

const MEAL_HISTORY_KEY = "@herveda_meal_history";

export async function saveMealAnalysisToHistory(entry: {
  mealName: string;
  imageUri: string;
  calories: number;
  healthScore: number;
  aiInsights: string[];
}): Promise<void> {
  const existing = await getMealHistory();
  const nextEntry: MealHistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    mealName: entry.mealName,
    imageUri: entry.imageUri,
    calories: entry.calories,
    healthScore: entry.healthScore,
    scannedAt: new Date().toISOString(),
    aiInsights: entry.aiInsights,
  };

  const nextItems = [nextEntry, ...existing].slice(0, 50);
  await AsyncStorage.setItem(MEAL_HISTORY_KEY, JSON.stringify(nextItems));
}

export async function getMealHistory(): Promise<MealHistoryEntry[]> {
  const raw = await AsyncStorage.getItem(MEAL_HISTORY_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as MealHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Unable to parse meal history", error);
    return [];
  }
}
