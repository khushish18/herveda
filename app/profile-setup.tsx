import { saveUserProfile } from "@/services/profile";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { getUserProfile } from "@/services/profile";

const lifeStageOptions = [
  "Pregnancy",
  "PCOS",
  "Postpartum",
  "Menopause",
  "General Wellness",
];
const dietOptions = ["Vegetarian", "Non Vegetarian", "Vegan"];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [selectedDiet, setSelectedDiet] = useState<string>("");
  const isEditing = params.mode === "edit";

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await getUserProfile();
      if (profile) {
        setFullName(profile.fullName || "");
        setAge(profile.age || "");
        setHeight(profile.height || "");
        setWeight(profile.weight || "");
        setSelectedStage(profile.lifeStage || "General Wellness");
        setSelectedDiet(profile.dietPreference || "Vegetarian");
      }
    };

    loadProfile();
  }, []);

  const handleContinue = async () => {
    const profile = {
      fullName: fullName.trim(),
      age: age.trim(),
      height: height.trim(),
      weight: weight.trim(),
      lifeStage: selectedStage || "General Wellness",
      dietPreference: selectedDiet || "Vegetarian",
    };

    await saveUserProfile(profile);

    router.replace({
      pathname: "/home",
      params: {
        fullName: profile.fullName,
        age: profile.age,
        lifeStage: profile.lifeStage,
        dietPreference: profile.dietPreference,
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Personalized</Text>
          </View>
          <Text style={styles.eyebrow}>Your Health Profile</Text>
          <Text style={styles.title}>
            {isEditing ? "Update your profile" : "Build your nutrition plan"}
          </Text>
          <Text style={styles.subtitle}>
            {isEditing
              ? "Adjust your preferences and keep your wellness plan current."
              : "A calm, intelligent profile helps us tailor your daily wellness support."}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>About You</Text>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            placeholderTextColor="#8a8f87"
          />

          <View style={styles.inlineFields}>
            <View style={styles.inlineField}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Age"
                keyboardType="number-pad"
                placeholderTextColor="#8a8f87"
              />
            </View>
            <View style={styles.inlineField}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                placeholder="Height"
                keyboardType="number-pad"
                placeholderTextColor="#8a8f87"
              />
            </View>
          </View>

          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="Enter your weight"
            keyboardType="number-pad"
            placeholderTextColor="#8a8f87"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Life Stage</Text>
          <View style={styles.optionGrid}>
            {lifeStageOptions.map((option) => {
              const selected = selectedStage === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => setSelectedStage(option)}
                  style={[
                    styles.optionChip,
                    selected && styles.optionChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diet Preference</Text>
          <View style={styles.optionGrid}>
            {dietOptions.map((option) => {
              const selected = selectedDiet === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => setSelectedDiet(option)}
                  style={[
                    styles.optionChip,
                    selected && styles.optionChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable onPress={handleContinue} style={styles.button}>
          <Text style={styles.buttonText}>
            {isEditing ? "Save Profile" : "Continue"}
          </Text>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 140,
  },
  hero: {
    marginBottom: 22,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#eaf4e8",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  heroBadgeText: {
    color: "#4f7a4c",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  eyebrow: {
    color: "#4f7a4c",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    color: "#152017",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: "#5f655d",
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 320,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
    shadowColor: "#2c3d2b",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  cardTitle: {
    color: "#19241a",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
  },
  label: {
    color: "#415041",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 10,
  },
  inlineFields: {
    flexDirection: "row",
    gap: 12,
  },
  inlineField: {
    flex: 1,
  },
  input: {
    backgroundColor: "#f8f2e8",
    borderColor: "#e3dfd5",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#19241a",
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    color: "#1f2d1f",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionChip: {
    backgroundColor: "#ffffff",
    borderColor: "#e0e0dc",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#2c3d2b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionChipSelected: {
    backgroundColor: "#4f7a4c",
    borderColor: "#4f7a4c",
  },
  optionText: {
    color: "#425142",
    fontSize: 13,
    fontWeight: "600",
  },
  optionTextSelected: {
    color: "#ffffff",
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
  button: {
    backgroundColor: "#4f7a4c",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#4f7a4c",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
