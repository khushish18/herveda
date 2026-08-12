import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useAuth } from "@/context/auth";

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Your Profile</Text>
          <Text style={styles.title}>Health details at a glance</Text>
          <Text style={styles.subtitle}>
            Keep your wellness plan aligned with the latest information.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile Overview</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{profile?.fullName || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Age</Text>
            <Text style={styles.value}>
              {profile?.age ? `${profile.age} yrs` : "—"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Height</Text>
            <Text style={styles.value}>
              {profile?.height ? `${profile.height} cm` : "—"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Weight</Text>
            <Text style={styles.value}>
              {profile?.weight ? `${profile.weight} kg` : "—"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Life Stage</Text>
            <Text style={styles.value}>{profile?.lifeStage || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Diet Preference</Text>
            <Text style={styles.value}>{profile?.dietPreference || "—"}</Text>
          </View>
        </View>

        <Pressable
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/profile-setup",
              params: { mode: "edit" },
            })
          }
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.logoutButton]}
          onPress={signOut}
        >
          <Text style={[styles.buttonText, styles.logoutButtonText]}>Log Out</Text>
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
    marginBottom: 18,
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
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#2b3a2c",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 3,
  },
  cardTitle: {
    color: "#182418",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0e8dc",
  },
  label: {
    color: "#6b746b",
    fontSize: 13,
    fontWeight: "600",
  },
  value: {
    color: "#182418",
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
    textAlign: "right",
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
  logoutButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#c93b3b",
    marginTop: 12,
  },
  logoutButtonText: {
    color: "#c93b3b",
  },
});
