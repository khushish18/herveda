import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { getNutritionChatReply } from "@/services/gemini-analysis";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
}

const examplePrompts = [
  "Can I eat pizza with PCOS?",
  "Healthy breakfast?",
  "Iron-rich foods?",
  "Foods to avoid during pregnancy?",
];

export default function AIChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    lifeStage?: string;
    age?: string;
    dietPreference?: string;
    fullName?: string;
  }>();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hello! I can help with nutrition and women’s health questions tailored to your profile.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  const profileContext = useMemo(() => {
    const parts = [
      params.fullName ? `Name: ${params.fullName}` : null,
      params.age ? `Age: ${params.age}` : null,
      params.lifeStage
        ? `Life stage: ${params.lifeStage}`
        : "Life stage: General Wellness",
      params.dietPreference
        ? `Diet preference: ${params.dietPreference}`
        : "Diet preference: Vegetarian",
    ].filter(Boolean);

    return parts.join("\n");
  }, [params.age, params.dietPreference, params.fullName, params.lifeStage]);

  const handleSend = async (messageText?: string) => {
    const text = (messageText ?? draft).trim();
    if (!text) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setDraft("");
    setLoading(true);

    try {
      const reply = await getNutritionChatReply(text, profileContext);
      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        text: reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const fallback =
        error instanceof Error
          ? error.message
          : "I could not answer right now.";
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant-error`,
          role: "assistant",
          text: fallback,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>HerVeda AI</Text>
          <Text style={styles.title}>Nutrition & Wellness Chat</Text>
        </View>
      </View>

      <ScrollView
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.bubble,
              message.role === "user"
                ? styles.userBubble
                : styles.assistantBubble,
            ]}
          >
            <Text
              style={[
                styles.bubbleText,
                message.role === "user"
                  ? styles.userBubbleText
                  : styles.assistantBubbleText,
              ]}
            >
              {message.text}
            </Text>
          </View>
        ))}
        {loading ? <Text style={styles.typing}>Thinking…</Text> : null}
      </ScrollView>

      <View style={styles.examplesRow}>
        {examplePrompts.map((prompt) => (
          <Pressable
            key={prompt}
            style={styles.exampleChip}
            onPress={() => handleSend(prompt)}
          >
            <Text style={styles.exampleChipText}>{prompt}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="Ask about nutrition or women’s health"
          placeholderTextColor="#8a8f87"
          multiline
        />
        <Pressable style={styles.sendButton} onPress={() => handleSend()}>
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
  chatArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatContent: {
    paddingVertical: 8,
    gap: 10,
  },
  bubble: {
    maxWidth: "85%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#4f7a4c",
  },
  assistantBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userBubbleText: {
    color: "#ffffff",
  },
  assistantBubbleText: {
    color: "#1d241d",
  },
  typing: {
    color: "#6b746b",
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },
  examplesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  exampleChip: {
    backgroundColor: "#eef6eb",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  exampleChipText: {
    color: "#4f7a4c",
    fontSize: 12,
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 120,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#1d241d",
    borderWidth: 1,
    borderColor: "#e3dfd5",
  },
  sendButton: {
    backgroundColor: "#4f7a4c",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
