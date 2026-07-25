import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface HomeCardProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  accent?: boolean;
}

export default function HomeCard({ title, subtitle, children, accent = false }: HomeCardProps) {
  return (
    <View style={[styles.card, accent && styles.cardAccent]}>
      <View style={styles.header}>
        <Text style={[styles.title, accent && styles.titleAccent]}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#2b3a2c',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardAccent: {
    backgroundColor: '#4f7a4c',
  },
  header: {
    marginBottom: 10,
  },
  title: {
    color: '#182418',
    fontSize: 16,
    fontWeight: '700',
  },
  titleAccent: {
    color: '#ffffff',
  },
  subtitle: {
    color: '#6b746b',
    fontSize: 13,
    marginTop: 4,
  },
});
