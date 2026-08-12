import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

import { AuthProvider, useAuth } from "@/context/auth";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutNav() {
  const { session, isLoading, profile } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Wait until session checking and initial profile loading is completed
    if (isLoading) return;

    const inAuthGroup = segments[0] === "login" || segments[0] === "signup";

    // Check if the current route is the main splash screen
    const isSplash = segments[0] === "(tabs)";

    console.log(
      `[Auth Guard] Session: ${!!session}, Profile: ${!!profile}, Segments: ${JSON.stringify(
        segments
      )}`
    );

    if (!session) {
      // 1. Unauthenticated User Flow
      // Allow only login, signup, and the branding splash screen. Redirect everything else to login.
      const isAllowed = inAuthGroup || isSplash;
      if (!isAllowed) {
        console.log("[Auth Guard] Unauthenticated user. Redirecting to /login.");
        router.replace("/login");
      }
    } else {
      // 2. Authenticated User Flow
      // Check if profile is complete (e.g. has lifeStage populated)
      const hasCompletedProfile = !!profile?.lifeStage;
      const isProfileSetup = segments[0] === "profile-setup";

      if (!hasCompletedProfile) {
        // If profile is incomplete, force completed setup unless they are already there
        if (!isProfileSetup) {
          console.log("[Auth Guard] Profile incomplete. Redirecting to /profile-setup.");
          router.replace("/profile-setup");
        }
      } else {
        // If profile is complete, prevent them from going back to login/signup/splash
        if (inAuthGroup || isSplash) {
          console.log("[Auth Guard] User logged in and set up. Redirecting to /home.");
          router.replace("/home");
        }
      }
    }
  }, [session, isLoading, profile, segments]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f7efe5",
        }}
      >
        <ActivityIndicator size="large" color="#4f7a4c" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="scan-meal" options={{ headerShown: false }} />
        <Stack.Screen name="analysis" options={{ headerShown: false }} />
        <Stack.Screen name="ai-chat" options={{ headerShown: false }} />
        <Stack.Screen name="meal-history" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="health-report" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
