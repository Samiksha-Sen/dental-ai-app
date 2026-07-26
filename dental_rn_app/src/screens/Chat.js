import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Bot } from 'lucide-react-native';
import GlassCard from '../components/GlassCard';
import TypingDots from '../animations/TypingDots';
import FadeSlideIn from '../animations/FadeSlideIn';
import { colors, gradients, radii, spacing, typography } from '../theme/tokens';

const SUGGESTIONS = ['Tell me about tooth 36', 'What is caries?', 'When is extraction needed?'];

export default function Chat({ chatMessages, chatInput, setChatInput, handleChatSend }) {
  const [isTyping, setIsTyping] = useState(false);
  const prevLen = useRef(chatMessages.length);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (chatMessages.length > prevLen.current) {
      const last = chatMessages[chatMessages.length - 1];
      if (last.sender === 'bot') setIsTyping(false);
    }
    prevLen.current = chatMessages.length;
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
  }, [chatMessages]);

  const onSend = () => {
    if (!chatInput.trim()) return;
    setIsTyping(true);
    handleChatSend();
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>AI Clinical Diagnostics Assistant</Text>

      <ScrollView ref={scrollRef} style={{ flex: 1, marginVertical: spacing.md }} contentContainerStyle={{ paddingBottom: spacing.md }}>
        {chatMessages.map((msg, idx) => (
          <FadeSlideIn key={idx} from={8}>
            <View style={[styles.bubble, msg.sender === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
              {msg.sender === 'bot' && <Bot color={colors.cyanLight} size={14} style={{ marginBottom: 4 }} />}
              <Text style={styles.bubbleTxt}>{msg.text}</Text>
            </View>
          </FadeSlideIn>
        ))}
        {isTyping && (
          <View style={[styles.bubble, styles.bubbleBot, { paddingVertical: 4 }]}>
            <TypingDots />
          </View>
        )}
      </ScrollView>

      <View style={styles.suggestRow}>
        {SUGGESTIONS.map((s) => (
          <TouchableOpacity key={s} style={styles.suggestChip} onPress={() => setChatInput(s)}>
            <Text style={styles.suggestTxt}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tray}>
        <TextInput
          style={styles.input}
          placeholder="Ask about tooth 36..."
          placeholderTextColor={colors.textMuted}
          value={chatInput}
          onChangeText={setChatInput}
          onSubmitEditing={onSend}
        />
        <TouchableOpacity onPress={onSend}>
          <LinearGradient colors={gradients.primary} style={styles.sendBtn}>
            <Send color="#fff" size={16} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: spacing.lg, paddingTop: 50 },
  title: { ...typography.h2, color: colors.textPrimary },
  bubble: { maxWidth: '82%', borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginBottom: spacing.sm },
  bubbleUser: { alignSelf: 'flex-end', backgroundColor: colors.primary },
  bubbleBot: { alignSelf: 'flex-start', backgroundColor: colors.glassFillStrong, borderWidth: 1, borderColor: colors.glassBorder },
  bubbleTxt: { color: colors.textPrimary, fontSize: typography.body.fontSize, lineHeight: 19 },
  suggestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: spacing.sm },
  suggestChip: {
    borderWidth: 1, borderColor: colors.glassBorder, backgroundColor: colors.glassFill,
    borderRadius: radii.pill, paddingHorizontal: spacing.md, paddingVertical: 6,
  },
  suggestTxt: { color: colors.textSecondary, fontSize: 11 },
  tray: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  input: {
    flex: 1, height: 48, borderRadius: radii.md, borderWidth: 1, borderColor: colors.glassBorder,
    backgroundColor: colors.glassFill, paddingHorizontal: spacing.md, color: colors.textPrimary,
  },
  sendBtn: { width: 48, height: 48, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
});
