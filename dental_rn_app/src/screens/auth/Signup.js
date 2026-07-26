import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ClipboardEdit } from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import GradientButton from '../../components/GradientButton';
import FloatingInput from '../../components/FloatingInput';
import StepProgress from '../../components/StepProgress';
import FadeSlideIn from '../../animations/FadeSlideIn';
import { colors, gradients, radii, spacing, typography } from '../../theme/tokens';

export default function Signup({
  doctorName,
  setDoctorName,
  licenseNo,
  setLicenseNo,
  clinicName,
  setClinicName,
  onSubmit,
  onGotoLogin,
}) {
  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <FadeSlideIn>
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <ClipboardEdit color={colors.cyanLight} size={24} />
          </View>
          <Text style={styles.title}>License Registry</Text>
          <Text style={styles.subtitle}>Verify DDS credentials with central health networks</Text>
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={100}>
        <StepProgress step={1} total={2} label="Step 1 of 2 — Registration Details" />
      </FadeSlideIn>

      <FadeSlideIn delay={160}>
        <GlassCard>
          <FloatingInput label="Full Clinical Name" value={doctorName} onChangeText={setDoctorName} placeholder="Dr. Samiksha Sen" />
          <FloatingInput label="Dental License No." value={licenseNo} onChangeText={setLicenseNo} placeholder="DDS-94031-WHO" />
          <FloatingInput label="Clinic Center Name" value={clinicName} onChangeText={setClinicName} placeholder="Clinic Name" />
          <GradientButton title="Send Verification Request" onPress={onSubmit} colorsOverride={gradients.violet} />
        </GlassCard>
      </FadeSlideIn>

      <FadeSlideIn delay={220}>
        <View style={styles.footerLink}>
          <Text style={styles.footerText} onPress={onGotoLogin}>
            Registered clinician? <Text style={styles.accent}>Log In</Text>
          </Text>
        </View>
      </FadeSlideIn>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: spacing.xl, paddingTop: 60, paddingBottom: 40 },
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
  footerLink: { alignItems: 'center', marginTop: spacing.xl },
  footerText: { color: colors.textMuted, fontSize: typography.body.fontSize },
  accent: { color: colors.cyanLight, fontWeight: '700' },
});
