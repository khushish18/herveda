import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import ScanActionCard from '@/components/scan-action-card';

export default function ScanMealScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lifeStage?: string }>();
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAnalyze = () => {
    if (!imageUri) {
      return;
    }

    router.replace({ pathname: '/analysis', params: { imageUri, lifeStage: params.lifeStage || '' } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Meal Scanner</Text>
        <Text style={styles.title}>Scan your meal with ease</Text>
        <Text style={styles.subtitle}>
          Capture a meal photo or choose one from your gallery to begin.
        </Text>
      </View>

      <View style={styles.previewCard}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>📷</Text>
            <Text style={styles.placeholderTitle}>Your meal preview will appear here</Text>
            <Text style={styles.placeholderText}>Choose a photo to continue.</Text>
          </View>
        )}
      </View>

      <View style={styles.actionsSection}>
        <ScanActionCard
          icon="📸"
          title="Take Photo"
          subtitle="Use your camera for a fresh meal capture"
          onPress={takePhoto}
        />
        <ScanActionCard
          icon="🖼️"
          title="Choose from Gallery"
          subtitle="Pick an existing photo from your device"
          onPress={pickFromGallery}
        />
      </View>

      <Pressable
        style={[styles.analyzeButton, !imageUri && styles.analyzeButtonDisabled]}
        disabled={!imageUri}
        onPress={handleAnalyze}>
        <Text style={styles.analyzeButtonText}>Analyze Meal</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7efe5',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 28,
  },
  header: {
    marginBottom: 18,
  },
  eyebrow: {
    color: '#4f7a4c',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    color: '#152017',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: '#5f655d',
    fontSize: 14,
    lineHeight: 20,
  },
  previewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 12,
    shadowColor: '#2b3a2c',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 18,
  },
  previewImage: {
    width: '100%',
    height: 250,
    borderRadius: 20,
  },
  placeholder: {
    height: 250,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e4e1d8',
    borderStyle: 'dashed',
    backgroundColor: '#f8f2e8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  placeholderIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  placeholderTitle: {
    color: '#182418',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  placeholderText: {
    color: '#6b746b',
    fontSize: 13,
    textAlign: 'center',
  },
  actionsSection: {
    marginBottom: 20,
  },
  analyzeButton: {
    backgroundColor: '#4f7a4c',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#4f7a4c',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 4,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#9eb59a',
    shadowOpacity: 0.08,
  },
  analyzeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
