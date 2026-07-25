import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { getMealHistory, MealHistoryEntry } from "@/services/meal-history";

const formatTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const groupEntries = (entries: MealHistoryEntry[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  return {
    today: entries.filter((entry) => new Date(entry.scannedAt) >= today),
    yesterday: entries.filter((entry) => {
      const scannedAt = new Date(entry.scannedAt);
      return scannedAt >= yesterday && scannedAt < today;
    }),
    older: entries.filter((entry) => new Date(entry.scannedAt) < yesterday),
  };
};

export default function MealHistoryScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<MealHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const history = await getMealHistory();
      setEntries(history);
      setLoading(false);
    };

    load();
  }, []);

  const grouped = useMemo(() => groupEntries(entries), [entries]);

  const renderSection = (title: string, items: MealHistoryEntry[]) => {
    if (!items.length) {
      return null;
    }

    return (
      <View style={styles.section} key={title}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {items.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/analysis",
                params: { imageUri: item.imageUri, fromHistory: "true" },
              })
            }
          >
            {item.imageUri ? (
              <Image source={{ uri: item.imageUri }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>📷</Text>
              </View>
            )}
            <View style={styles.cardBody}>
              <View style={styles.cardHeader}>
                <Text style={styles.mealName}>{item.mealName}</Text>
                <Text style={styles.scanTime}>
                  {formatTime(item.scannedAt)}
                </Text>
              </View>
              <Text style={styles.meta}>{Math.round(item.calories)} kcal</Text>
              <Text style={styles.meta}>
                Health score: {item.healthScore}/100
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>Meal History</Text>
          <Text style={styles.title}>Your recent scans</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Loading your history…</Text>
        </View>
      ) : !entries.length ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No meal scans yet.</Text>
          <Text style={styles.emptySubtext}>
            Complete a meal analysis to see it here.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {renderSection("Today", grouped.today)}
          {renderSection("Yesterday", grouped.yesterday)}
          {renderSection("Older", grouped.older)}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7efe5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 12,
    gap: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#4f7a4c",
    fontSize: 20,
    fontWeight: "700",
  },
  eyebrow: {
    color: "#4f7a4c",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    color: "#152017",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#4f7a4c",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#2b3a2c",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  image: {
    width: 78,
    height: 78,
    borderRadius: 16,
    backgroundColor: "#f8f2e8",
  },
  imagePlaceholder: {
    width: 78,
    height: 78,
    borderRadius: 16,
    backgroundColor: "#f8f2e8",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: {
    fontSize: 24,
  },
  cardBody: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 4,
  },
  mealName: {
    flex: 1,
    color: "#152017",
    fontSize: 15,
    fontWeight: "700",
  },
  scanTime: {
    color: "#6b746b",
    fontSize: 12,
    fontWeight: "600",
  },
  meta: {
    color: "#5f655d",
    fontSize: 13,
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyText: {
    color: "#152017",
    fontSize: 17,
    fontWeight: "700",
  },
  emptySubtext: {
    color: "#6b746b",
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
  },
});
