import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import HomeActionPill from "@/components/home-action-pill";
import HomeCard from "@/components/home-card";
import { getMealHistory } from "@/services/meal-history";
import { useAuth } from "@/context/auth";

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const params = useLocalSearchParams<{
    lifeStage?: string;
    age?: string;
    dietPreference?: string;
    fullName?: string;
  }>();
  const [userName, setUserName] = useState(profile?.fullName || params.fullName || "Khushi");
  const [latestMeal, setLatestMeal] = useState("No meals scanned yet");
  const [latestRecommendation, setLatestRecommendation] = useState(
    "Scan a meal to see your first recommendation.",
  );

  const handleOpenScanner = () => {
    router.push({
      pathname: "/scan-meal",
      params: { lifeStage: profile?.lifeStage || params.lifeStage || "" },
    });
  };

  const handleOpenChat = () => {
    router.push({
      pathname: "/ai-chat",
      params: {
        lifeStage: profile?.lifeStage || params.lifeStage || "General Wellness",
        age: profile?.age || params.age || "",
        dietPreference: profile?.dietPreference || params.dietPreference || "",
        fullName: profile?.fullName || params.fullName || "",
      },
    });
  };

  const handleOpenHistory = () => {
    router.push("/meal-history");
  };

  const handleOpenHealthReport = () => {
    router.push("/health-report");
  };

  const handleOpenProfile = () => {
    router.push("/profile");
  };

  useEffect(() => {
    if (profile?.fullName) {
      setUserName(profile.fullName);
    }
  }, [profile]);

  useEffect(() => {
    const loadDashboardData = async () => {
      const history = await getMealHistory();
      if (history.length > 0) {
        const latest = history[0];
        setLatestMeal(latest.mealName || "Recent meal");
        setLatestRecommendation(
          latest.aiInsights?.[0] || "Keep building balanced meals.",
        );
      }
    };

    loadDashboardData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Evening, {userName} 🌿</Text>
          <Text style={styles.subtext}>
            Here’s your calm nutrition overview for today.
          </Text>
        </View>

        <HomeCard title="Wellness Score" subtitle="Balanced and steady" accent>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreValue}>82%</Text>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreBadgeText}>On Track</Text>
            </View>
          </View>
        </HomeCard>

        <Pressable onPress={handleOpenScanner}>
          <HomeCard
            title="Scan Your Meal"
            subtitle="Analyze your food using AI"
            accent
          >
            <View style={styles.primaryCard}>
              <View style={styles.primaryIconBox}>
                <Text style={styles.primaryIcon}>📷</Text>
              </View>
              <Text style={styles.primaryTitle}>Capture a meal in seconds</Text>
              <Text style={styles.primaryText}>
                Get instant insights tailored to your goals.
              </Text>
            </View>
          </HomeCard>
        </Pressable>

        <View style={styles.actionsRow}>
          <HomeActionPill icon="🤖" label="AI Chat" onPress={handleOpenChat} />
          <HomeActionPill
            icon="🕒"
            label="History"
            onPress={handleOpenHistory}
          />
          <HomeActionPill
            icon="📄"
            label="Report"
            onPress={handleOpenHealthReport}
          />
        </View>

        <HomeCard title="Latest Meal" subtitle="Your most recent scan">
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationTitle}>{latestMeal}</Text>
            <Text style={styles.recommendationText}>
              Tap history to review prior meals and insights.
            </Text>
          </View>
        </HomeCard>

        <HomeCard
          title="Latest Recommendation"
          subtitle="Gentle guidance for your day"
        >
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationTitle}>
              Personalized guidance
            </Text>
            <Text style={styles.recommendationText}>
              {latestRecommendation}
            </Text>
          </View>
        </HomeCard>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Text style={[styles.navItem, styles.navItemActive]}>Home</Text>
        <Pressable onPress={handleOpenScanner}>
          <Text style={styles.navItem}>Scan</Text>
        </Pressable>
        <Pressable onPress={handleOpenProfile}>
          <Text style={styles.navItem}>Profile</Text>
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
    paddingBottom: 100,
  },
  header: {
    marginBottom: 18,
  },
  greeting: {
    color: "#142116",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtext: {
    color: "#5f655d",
    fontSize: 14,
    lineHeight: 20,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  scoreValue: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "700",
  },
  scoreBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  scoreBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  primaryCard: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 22,
    padding: 16,
    marginTop: 6,
  },
  primaryIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.22)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  primaryIcon: {
    fontSize: 24,
  },
  primaryTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  primaryText: {
    color: "#eaf4e8",
    fontSize: 13,
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 16,
  },
  recommendationBox: {
    backgroundColor: "#f8f2e8",
    borderRadius: 18,
    padding: 14,
  },
  recommendationTitle: {
    color: "#1b2a1c",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  recommendationText: {
    color: "#5f655d",
    fontSize: 13,
    lineHeight: 20,
  },
  bottomNav: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 22,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingVertical: 12,
    shadowColor: "#29422b",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  navItem: {
    color: "#7a847a",
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 10,
  },
  navItemActive: {
    color: "#4f7a4c",
    fontWeight: "700",
  },
});
