import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Smartphone } from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import GradientButton from '../../components/GradientButton';
import StepProgress from '../../components/StepProgress';
import FadeSlideIn from '../../animations/FadeSlideIn';
import { colors, radii, spacing, typography } from '../../theme/tokens';

export default function Otp({ otpCodes, onSubmit }) {
  // Cosmetic countdown only — purely local UI state, not wired to any resend
  // logic (there isn't one), so it can't drift from real app behavior.
  const [secondsLeft, setSecondsLeft] = useState(45);

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = Math.floor(secondsLeft / 60);
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return (
    <View style={styles.wrap}>
      <FadeSlideIn>
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Smartphone color={colors.cyanLight} size={24} />
          </View>
          <Text style={styles.title}>Attestation Login</Text>
          <Text style={styles.subtitle}>Dispatched 6-digit decrypt key to +91 •••• 530</Text>
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={100}>
        <StepProgress step={2} total={2} label="Step 2 of 2 — Verification" />
      </FadeSlideIn>

      <FadeSlideIn delay={160}>
        <GlassCard>
          <View style={styles.otpRow}>
            {otpCodes.map((code, idx) => (
              <MotiView
                key={idx}
                from={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 180, delay: idx * 60 }}
              >
                <TextInput style={styles.otpBox} value={code} maxLength={1} keyboardType="numeric" />
              </MotiView>
            ))}
          </View>
          <Text style={styles.timer}>
            Resend key in <Text style={styles.timerVal}>{mm}:{ss}</Text>
          </Text>
          <GradientButton title="Verify & Decrypt" onPress={onSubmit} />
        </GlassCard>
      </FadeSlideIn>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: spacing.xl, paddingTop: 60, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: radii.md,
    backgroundColor: colors.glassFillStrong,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: { color: colors.textMuted, fontSize: typography.body.fontSize, marginTop: 6, textAlign: 'center' },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg },
  otpBox: {
    width: 44,
    height: 52,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassFill,
    color: colors.textPrimary,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
  },
  timer: { textAlign: 'center', color: colors.textMuted, fontSize: typography.body.fontSize, marginBottom: spacing.lg },
  timerVal: { color: colors.textSecondary, fontWeight: '700' },
});
