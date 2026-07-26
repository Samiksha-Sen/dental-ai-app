import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Activity, Fingerprint } from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import GradientButton from '../../components/GradientButton';
import FloatingInput from '../../components/FloatingInput';
import FadeSlideIn from '../../animations/FadeSlideIn';
import ShimmerSweep from '../../animations/ShimmerSweep';
import { colors, gradients, radii, spacing, typography } from '../../theme/tokens';

export default function Login({ email, setEmail, password, setPassword, onSubmit, onGotoSignup }) {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.wrap}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <FadeSlideIn>
          <View style={styles.header}>
            <MotiView
              from={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 9, stiffness: 120 }}
              style={styles.logoBadge}
            >
              <LinearGradient colors={gradients.primary} style={StyleSheet.absoluteFillObject} />
              <Activity color="#fff" size={28} />
            </MotiView>
            <Text style={styles.brand}>DENTAL.AI</Text>
            <Text style={styles.subtitle}>Clinical Attestation Diagnostic System</Text>
          </View>
        </FadeSlideIn>

        <FadeSlideIn delay={120}>
          <GlassCard style={styles.card}>
            <ShimmerSweep />
            <FloatingInput
              label="Clinical License Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter clinical ID"
            />
            <FloatingInput
              label="Secure Access Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter passkey"
              secureTextEntry
            />
            <GradientButton title="Decrypt & Sign In" onPress={onSubmit} />

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerTxt}>Or Biometrics</Text>
              <View style={styles.dividerLine} />
            </View>

            <MotiView
              from={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', duration: 1200, loop: true, repeatReverse: true }}
              style={{ alignSelf: 'stretch' }}
            >
              <GradientButton
                title="Scan TouchID / FaceKey"
                icon={<Fingerprint color="#fff" size={18} />}
                onPress={onSubmit}
                colorsOverride={[colors.bgElevated, colors.bgCard]}
              />
            </MotiView>
          </GlassCard>
        </FadeSlideIn>

        <FadeSlideIn delay={200}>
          <View style={styles.footerLink}>
            <Text style={styles.footerText} onPress={onGotoSignup}>
              Need clinical registry? <Text style={styles.accent}>Register License</Text>
            </Text>
          </View>
        </FadeSlideIn>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  brand: { ...typography.h1, color: colors.textPrimary, letterSpacing: 2 },
  subtitle: { color: colors.textMuted, fontSize: typography.body.fontSize, marginTop: 6, textAlign: 'center' },
  card: { overflow: 'hidden' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginVertical: spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.glassBorder },
  dividerTxt: { color: colors.textMuted, fontSize: typography.caption.fontSize },
  footerLink: { alignItems: 'center', marginTop: spacing.xl },
  footerText: { color: colors.textMuted, fontSize: typography.body.fontSize },
  accent: { color: colors.cyanLight, fontWeight: '700' },
});
