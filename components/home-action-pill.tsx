import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface HomeActionPillProps {
  icon: string;
  label: string;
  onPress?: () => void;
}

export default function HomeActionPill({
  icon,
  label,
  onPress,
}: HomeActionPillProps) {
  return (
    <Pressable style={styles.pill} onPress={onPress}>
      <View style={styles.iconBox}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    shadowColor: "#2b3a2c",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#eef6eb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    color: "#1f2d1f",
    fontSize: 13,
    fontWeight: "600",
  },
});
