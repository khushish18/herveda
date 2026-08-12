import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useAuth } from "@/context/auth";
import AnalysisCard from "@/components/analysis-card";
import { getMealHistory } from "@/services/meal-history";

export default function HealthReportScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const [mealCount, setMealCount] = useState(0);
  const [avgCalories, setAvgCalories] = useState(0);
  const [avgHealthScore, setAvgHealthScore] = useState(0);
  const [latestRecommendation, setLatestRecommendation] = useState(
    "Scan meals to build your first health report.",
  );
  const [profileSummary, setProfileSummary] = useState("No profile saved yet.");

  useEffect(() => {
    const loadReport = async () => {
      const history = await getMealHistory();

      if (history.length > 0) {
        const totalCalories = history.reduce(
          (sum, meal) => sum + meal.calories,
          0,
        );
        const totalHealth = history.reduce(
          (sum, meal) => sum + meal.healthScore,
          0,
        );
        setMealCount(history.length);
        setAvgCalories(Math.round(totalCalories / history.length));
        setAvgHealthScore(Math.round(totalHealth / history.length));
        setLatestRecommendation(
          history[0]?.aiInsights?.[0] || "Keep building balanced meals.",
        );
      }

    };

    loadReport();
  }, []);

  useEffect(() => {
    if (profile) {
      const summaryParts = [
        profile.fullName || "your profile",
        profile.lifeStage || "wellness",
        profile.dietPreference || "balanced diet",
      ];
      setProfileSummary(summaryParts.join(" • "));
    } else {
      setProfileSummary("No profile saved yet.");
    }
  }, [profile]);

  const summaryItems = useMemo(
    () => [
      { label: "Meals scanned", value: `${mealCount}` },
      { label: "Average calories", value: `${avgCalories} kcal` },
      { label: "Average health score", value: `${avgHealthScore}/100` },
    ],
    [mealCount, avgCalories, avgHealthScore],
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Health Report</Text>
          <Text style={styles.title}>Your nutrition overview</Text>
          <Text style={styles.subtitle}>
            Review your recent scans and keep your goals grounded in real data.
          </Text>
        </View>

        <AnalysisCard title="Snapshot" icon="📈">
          <View style={styles.grid}>
            {summaryItems.map((item) => (
              <View key={item.label} style={styles.metricBox}>
                <Text style={styles.metricLabel}>{item.label}</Text>
                <Text style={styles.metricValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </AnalysisCard>

        <AnalysisCard title="Latest Recommendation" icon="🌿">
          <Text style={styles.sectionText}>{latestRecommendation}</Text>
        </AnalysisCard>

        <AnalysisCard title="User Profile Summary" icon="👤">
          <Text style={styles.sectionText}>{profileSummary}</Text>
        </AnalysisCard>

        <Pressable style={styles.button} onPress={() => router.push("/home")}>
          <Text style={styles.buttonText}>Back Home</Text>
        </Pressable>
      </ScrollView>
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
    paddingBottom: 80,
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
  sectionText: {
    color: "#4b574a",
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#4f7a4c",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});
