import React, { useState } from 'react';
import { View, Text, TextInput, Switch, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { ShieldCheck, CloudCog, Link2, Gauge, LogOut } from 'lucide-react-native';
import GlassCard from '../components/GlassCard';
import ConfirmModal from '../components/ConfirmModal';
import FadeSlideIn from '../animations/FadeSlideIn';
import { colors, spacing, radii, typography } from '../theme/tokens';

const THRESHOLD_OPTIONS = [
  { value: 75, label: '75% Low' },
  { value: 85, label: '85% Normal' },
  { value: 95, label: '95% High' },
];

export default function Settings({
  enableHipaaAudit,
  setEnableHipaaAudit,
  enableCloudSync,
  setEnableCloudSync,
  apiUrl,
  setApiUrl,
  confidenceThreshold,
  setConfidenceThreshold,
  onSignOut,
}) {
  const [confirmVisible, setConfirmVisible] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <FadeSlideIn>
        <Text style={styles.title}>Clinic System Settings</Text>
      </FadeSlideIn>

      <FadeSlideIn delay={60}>
        <GlassCard>
          <View style={styles.sectionHeader}>
            <ShieldCheck color={colors.cyanLight} size={16} />
            <Text style={styles.label}>Clinical Audit Options</Text>
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.rowTxt}>HIPAA Compliant Logging</Text>
            <Switch
              value={enableHipaaAudit}
              onValueChange={setEnableHipaaAudit}
              trackColor={{ false: colors.glassFillStrong, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
          <View style={[styles.switchRow, { marginBottom: 0 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <CloudCog color={colors.textMuted} size={14} />
              <Text style={styles.rowTxt}>Secure Cloud Sync rosters</Text>
            </View>
            <Switch
              value={enableCloudSync}
              onValueChange={setEnableCloudSync}
              trackColor={{ false: colors.glassFillStrong, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </GlassCard>
      </FadeSlideIn>

      <FadeSlideIn delay={120}>
        <GlassCard>
          <View style={styles.sectionHeader}>
            <Link2 color={colors.cyanLight} size={16} />
            <Text style={styles.label}>Keras API Endpoint URL</Text>
          </View>
          <TextInput
            style={styles.input}
            value={apiUrl}
            onChangeText={setApiUrl}
            placeholder="https://dental-ai-app-production-4464.up.railway.app/predict"
            placeholderTextColor={colors.textMuted}
          />
        </GlassCard>
      </FadeSlideIn>

      <FadeSlideIn delay={180}>
        <GlassCard>
          <View style={styles.thresholdHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Gauge color={colors.cyanLight} size={16} />
              <Text style={styles.label}>Model classifier sensitivity</Text>
            </View>
            <Text style={styles.thresholdVal}>{confidenceThreshold}%</Text>
          </View>

          <View style={styles.sliderTrack}>
            <MotiView
              animate={{ left: `${(confidenceThreshold - 50) * 2}%` }}
              transition={{ type: 'spring', damping: 16, stiffness: 200 }}
              style={styles.knob}
            />
          </View>

          <View style={styles.thresholdRow}>
            {THRESHOLD_OPTIONS.map(({ value, label }) => {
              const active = confidenceThreshold === value;
              return (
                <TouchableOpacity
                  key={value}
                  style={[styles.thresholdChip, active && styles.thresholdChipActive]}
                  onPress={() => setConfidenceThreshold(value)}
                >
                  <Text style={[styles.thresholdChipTxt, active && styles.thresholdChipTxtActive]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </GlassCard>
      </FadeSlideIn>

      <FadeSlideIn delay={240}>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => setConfirmVisible(true)}>
          <LogOut color={colors.danger} size={16} />
          <Text style={styles.logoutTxt}>Sign Out Doctor License</Text>
        </TouchableOpacity>
      </FadeSlideIn>

      <ConfirmModal
        visible={confirmVisible}
        title="Sign Out"
        message="You'll need to re-authenticate with your clinical license to access the portal again."
        confirmLabel="Sign Out"
        danger
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          setConfirmVisible(false);
          onSignOut();
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, paddingTop: 50, paddingBottom: 24 },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md },
  label: { ...typography.label, color: colors.textMuted, textTransform: 'uppercase' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  rowTxt: { color: colors.textSecondary, fontSize: typography.body.fontSize },
  input: {
    height: 46, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.glassBorder,
    backgroundColor: colors.glassFill, paddingHorizontal: spacing.md, color: colors.textPrimary, fontSize: 13,
  },
  thresholdHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  thresholdVal: { color: colors.cyanLight, fontWeight: '800' },
  sliderTrack: { height: 6, borderRadius: 3, backgroundColor: colors.glassFillStrong, marginBottom: spacing.md, position: 'relative' },
  knob: {
    position: 'absolute', top: -5, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.cyanLight,
    shadowColor: colors.cyanLight, shadowOpacity: 0.7, shadowRadius: 8, elevation: 6,
  },
  thresholdRow: { flexDirection: 'row', gap: 6 },
  thresholdChip: {
    flex: 1, paddingVertical: 10, borderRadius: radii.sm, alignItems: 'center',
    backgroundColor: colors.glassFill, borderWidth: 1, borderColor: colors.glassBorder,
  },
  thresholdChipActive: { backgroundColor: colors.primary, borderColor: '#fff' },
  thresholdChipTxt: { color: colors.textSecondary, fontSize: 11 },
  thresholdChipTxtActive: { color: '#fff', fontWeight: '700' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.35)', backgroundColor: colors.dangerBg,
    borderRadius: radii.md, paddingVertical: 14, marginTop: spacing.sm,
  },
  logoutTxt: { color: colors.danger, fontWeight: '700', fontSize: 14 },
});
