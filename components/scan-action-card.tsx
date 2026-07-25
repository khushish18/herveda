import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ScanActionCardProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export default function ScanActionCard({ icon, title, subtitle, onPress }: ScanActionCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.iconBox}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#2b3a2c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eef6eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    color: '#182418',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    color: '#6b746b',
    fontSize: 13,
    lineHeight: 18,
  },
});
