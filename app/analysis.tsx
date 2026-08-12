import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "@/context/auth";
import AnalysisCard from "@/components/analysis-card";
import { apiService, MealAnalysisResult } from "@/services/api";
import * as FileSystem from "expo-file-system/legacy";
import { saveMealAnalysisToHistory } from "@/services/meal-history";

const getLifeStageRecommendations = (lifeStage?: string) => {
  switch (lifeStage) {
    case "Pregnancy":
      return [
        "Folate-rich foods",
        "Iron-rich foods",
        "Calcium-rich foods",
        "Stay well hydrated",
      ];
    case "PCOS":
      return [
        "Choose low GI foods",
        "Increase protein intake",
        "Add more fiber",
        "Reduce refined carbohydrates",
      ];
    case "Postpartum":
      return [
        "Increase protein",
        "Stay hydrated",
        "Include iron-rich foods",
        "Eat regular balanced meals",
      ];
    case "Menopause":
      return [
        "Increase calcium",
        "Include vitamin D",
        "Add protein-rich foods",
        "Support bone health",
      ];
    default:
      return [
        "Follow a balanced diet",
        "Keep meals varied",
        "Prioritize whole foods",
        "Stay hydrated",
      ];
  }
};

export default function AnalysisScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const params = useLocalSearchParams<{
    imageUri?: string;
    lifeStage?: string;
    fromHistory?: string;
  }>();
  const [analysis, setAnalysis] = useState<MealAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runAnalysis = async () => {
      const imageUri = params.imageUri;
      if (!imageUri) {
        setError("Unable to analyze this meal. Please try another image.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Read image file as base64 string
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const mimeType = imageUri.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";

        // Query the secure backend analyze endpoint
        const result = await apiService.analyzeMeal(base64, mimeType);
        setAnalysis(result);

        await saveMealAnalysisToHistory({
          mealName: result.meal_name,
          imageUri: result.image_url, // Save the secure temporary URL in history
          calories: result.estimated_calories,
          healthScore: result.health_score,
          aiInsights: result.ai_insights,
        });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to analyze this meal. Please try another image.";
        setError(
          message.includes("API key")
            ? "Backend Gemini API key is not configured. Ask your administrator to set GEMINI_API_KEY in the backend environment."
            : message
        );
      } finally {
        setLoading(false);
      }
    };

    runAnalysis();
  }, [params.imageUri]);

  const resolvedLifeStage = params.lifeStage || profile?.lifeStage || "General Wellness";
  const recommendations = getLifeStageRecommendations(resolvedLifeStage);

  const nutritionData = analysis
    ? [
        {
          label: "Calories",
          value: `${Math.round(analysis.estimated_calories)} kcal`,
        },
        { label: "Protein", value: `${analysis.protein_g} g` },
        { label: "Carbohydrates", value: `${analysis.carbs_g} g` },
        { label: "Fat", value: `${analysis.fat_g} g` },
        { label: "Fiber", value: `${analysis.fiber_g} g` },
      ]
    : [];

  const insights = analysis?.ai_insights ?? [];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>AI Nutrition Analysis</Text>
          <Text style={styles.title}>
            {analysis?.meal_name || "Analyzing meal..."}
          </Text>
          <Text style={styles.subtitle}>
            {loading
              ? "Reviewing your image with Gemini 2.5 Flash Vision."
              : error ||
                "Detected meal with high-confidence insights for your wellness goals."}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#4f7a4c" />
            <Text style={styles.loadingText}>Analyzing your meal image...</Text>
          </View>
        ) : null}

        {!loading && !error && analysis ? (
          <>
            <AnalysisCard title="Meal Overview" icon="🧾">
              <View style={styles.overviewRow}>
                <View style={styles.overviewItem}>
                  <Text style={styles.label}>Confidence</Text>
                  <Text style={styles.value}>
                    {Math.round(analysis.confidence)}%
                  </Text>
                </View>
                <View style={styles.overviewItem}>
                  <Text style={styles.label}>Iron</Text>
                  <Text style={styles.value}>{analysis.iron}</Text>
                </View>
                <View style={styles.overviewItem}>
                  <Text style={styles.label}>Calcium</Text>
                  <Text style={styles.value}>{analysis.calcium}</Text>
                </View>
              </View>
            </AnalysisCard>

            <AnalysisCard title="Nutrition Snapshot" icon="🥗">
              <View style={styles.grid}>
                {nutritionData.map((item) => (
                  <View key={item.label} style={styles.metricBox}>
                    <Text style={styles.metricLabel}>{item.label}</Text>
                    <Text style={styles.metricValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            </AnalysisCard>

            <AnalysisCard title="AI Insights" icon="✨">
              <View style={styles.list}>
                {insights.map((insight) => (
                  <View key={insight} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}>{insight}</Text>
                  </View>
                ))}
              </View>
            </AnalysisCard>

            <AnalysisCard title="Women's Health Recommendation" icon="🌿">
              <Text style={styles.sectionText}>
                Since your life stage is {resolvedLifeStage}:
              </Text>
              <View style={styles.list}>
                {recommendations.map((recommendation) => (
                  <View key={recommendation} style={styles.listItem}>
                    <Text style={styles.check}>✓</Text>
                    <Text style={styles.listText}>{recommendation}</Text>
                  </View>
                ))}
              </View>
            </AnalysisCard>

            <AnalysisCard title="Virudh Aahar Check" icon="🫖">
              <Text style={styles.sectionText}>
                No incompatible food combinations detected.
              </Text>
            </AnalysisCard>
          </>
        ) : null}

        {!loading && error ? (
          <AnalysisCard title="Analysis Error" icon="⚠️">
            <Text style={styles.sectionText}>{error}</Text>
          </AnalysisCard>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push("/scan-meal")}
        >
          <Text style={styles.secondaryButtonText}>Scan Another Meal</Text>
        </Pressable>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push("/home")}
        >
          <Text style={styles.primaryButtonText}>Back Home</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7efe5",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 140,
  },
  header: {
    marginBottom: 16,
  },
  eyebrow: {
    color: "#4f7a4c",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    color: "#152017",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: "#5f655d",
    fontSize: 14,
    lineHeight: 20,
  },
  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  overviewItem: {
    flex: 1,
    backgroundColor: "#f8f2e8",
    borderRadius: 16,
    padding: 12,
  },
  label: {
    color: "#6b746b",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  value: {
    color: "#182418",
    fontSize: 16,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricBox: {
    width: "47%",
    backgroundColor: "#f8f2e8",
    borderRadius: 16,
    padding: 12,
  },
  metricLabel: {
    color: "#6b746b",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  metricValue: {
    color: "#182418",
    fontSize: 15,
    fontWeight: "700",
  },
  list: {
    gap: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bullet: {
    color: "#4f7a4c",
    fontSize: 16,
    marginRight: 8,
    lineHeight: 20,
  },
  check: {
    color: "#4f7a4c",
    fontSize: 16,
    marginRight: 8,
    lineHeight: 20,
  },
  listText: {
    color: "#4b574a",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  sectionText: {
    color: "#4b574a",
    fontSize: 14,
    lineHeight: 20,
  },
  loadingCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#2b3a2c",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 3,
  },
  loadingText: {
    color: "#4f7a4c",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: "#f7efe5",
    borderTopWidth: 1,
    borderTopColor: "#e7dfd2",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: "#1f2d1f",
    fontSize: 15,
    fontWeight: "700",
  },
  primaryButton: {
    backgroundColor: "#4f7a4c",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});
