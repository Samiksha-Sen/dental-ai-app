import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Layers, ShieldAlert, Gauge, ScanLine, Users, MessageCircle, Sparkles } from 'lucide-react-native';
import GlassCard from '../components/GlassCard';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import PressableScale from '../components/PressableScale';
import FadeSlideIn from '../animations/FadeSlideIn';
import ShimmerSweep from '../animations/ShimmerSweep';
import { colors, gradients, radii, spacing, typography } from '../theme/tokens';

const QUICK_ACTIONS = [
  { key: 'scan', label: 'Scan X-Ray', Icon: ScanLine, color: colors.primary },
  { key: 'patients', label: 'Patients', Icon: Users, color: colors.success },
  { key: 'chat', label: 'AI Chat', Icon: MessageCircle, color: colors.primaryPurple },
];

export default function Dashboard({ clinicName, doctorName, onSelectPatient, onGotoTab, onGotoSettings }) {
  const initials = doctorName.split(' ').map((n) => n[0]).join('');

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.orbA} pointerEvents="none" />
      <View style={styles.orbB} pointerEvents="none" />

      <FadeSlideIn>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>OVERVIEW</Text>
            <Text style={styles.title}>Clinical Dashboard</Text>
            <Text style={styles.subtitle}>{clinicName} Center</Text>
          </View>
          <PressableScale onPress={onGotoSettings} scaleTo={0.92}>
            <LinearGradient colors={gradients.primary} style={styles.avatar}>
              <Text style={styles.avatarTxt}>{initials}</Text>
            </LinearGradient>
          </PressableScale>
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={80}>
        <View style={styles.statsRow}>
          <StatCard
            icon={<Layers color={colors.primary} size={19} />}
            label="Total AI Scans"
            value={1482}
            color={colors.primary}
          />
          <StatCard
            icon={<ShieldAlert color={colors.danger} size={19} />}
            label="Severe Caries"
            value={12}
            color={colors.danger}
          />
          <StatCard
            icon={<Gauge color={colors.cyanLight} size={19} />}
            label="Avg Latency"
            value="0.82s"
            color={colors.cyanLight}
            isNumeric={false}
          />
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={140}>
        <GlassCard style={styles.heroCard}>
          <ShimmerSweep />
          <LinearGradient colors={['#6366f1', '#7c3aed', '#06b6d4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroFill} />
          <View style={styles.heroGlyph} pointerEvents="none">
            <Sparkles color="rgba(255,255,255,0.14)" size={140} strokeWidth={1} />
          </View>
          <View style={styles.heroBadge}>
            <Sparkles color="#fff" size={12} />
            <Text style={styles.heroBadgeTxt}>AI DUAL-MODEL TRIAGE</Text>
          </View>
          <Text style={styles.heroTitle}>Start Oral Screening</Text>
          <Text style={styles.heroDesc}>
            Dual-model triage: X-ray validity check, then caries confidence scoring — results save straight to the patient EHR.
          </Text>
          <PressableScale onPress={() => onGotoTab('scan')} style={styles.heroBtnPressable} innerStyle={styles.heroBtn}>
            <ScanLine color="#4338ca" size={17} />
            <Text style={styles.heroBtnTxt}>Scan Patient X-Ray</Text>
          </PressableScale>
        </GlassCard>
      </FadeSlideIn>

      <FadeSlideIn delay={200}>
        <Text style={styles.eyebrow}>QUICK ACTIONS</Text>
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map(({ key, label, Icon, color }) => (
            <PressableScale
              key={key}
              onPress={() => onGotoTab(key)}
              scaleTo={0.95}
              style={styles.quickCardPressable}
              innerStyle={[styles.quickCard, { borderColor: `${color}40` }]}
            >
              <LinearGradient colors={[`${color}26`, 'transparent']} style={StyleSheet.absoluteFillObject} />
              <View style={[styles.quickIconWrap, { backgroundColor: `${color}26`, shadowColor: color }]}>
                <Icon color={color} size={20} />
              </View>
              <Text style={styles.quickLabel}>{label}</Text>
            </PressableScale>
          ))}
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={260}>
        <Text style={styles.eyebrow}>PATIENT ROSTER</Text>
        <GlassCard>
          <Text style={styles.cardTitle}>Urgent Attestations Required</Text>
          <PressableScale
            onPress={() => onSelectPatient('Anjali Mishra')}
            scaleTo={0.98}
            innerStyle={styles.patientRow}
          >
            <View style={[styles.patientAccent, { backgroundColor: colors.danger }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.patientName}>Anjali Mishra</Text>
              <Text style={styles.patientMeta}>ID: PT-49201 | Caries Segmented (Tooth 36)</Text>
            </View>
            <Badge badge="urgent" label="Urgent Care" />
          </PressableScale>
          <PressableScale
            onPress={() => onSelectPatient('Ramesh Kumar')}
            scaleTo={0.98}
            innerStyle={[styles.patientRow, { marginBottom: 0 }]}
          >
            <View style={[styles.patientAccent, { backgroundColor: colors.warning }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.patientName}>Ramesh Kumar</Text>
              <Text style={styles.patientMeta}>ID: PT-39185 | Follow-up Roster planner</Text>
            </View>
            <Badge badge="pending" label="Pending" />
          </PressableScale>
        </GlassCard>
      </FadeSlideIn>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, paddingTop: 50, paddingBottom: 24 },
  orbA: {
    position: 'absolute', top: -40, right: -60, width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(99,102,241,0.16)',
  },
  orbB: {
    position: 'absolute', top: 160, left: -80, width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(6,182,212,0.10)',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  eyebrow: {
    fontSize: 11, fontWeight: '800', letterSpacing: 1.4, color: colors.cyanLight,
    marginBottom: spacing.sm, textTransform: 'uppercase',
  },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { color: colors.textMuted, fontSize: typography.body.fontSize, marginTop: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: '#fff', fontWeight: '800', fontSize: 13 },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  heroCard: { overflow: 'hidden', position: 'relative', padding: spacing.xl, marginBottom: spacing.xl },
  heroFill: { ...StyleSheet.absoluteFillObject },
  heroGlyph: { position: 'absolute', right: -20, bottom: -30 },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: radii.pill,
    paddingHorizontal: spacing.md, paddingVertical: 5, marginBottom: spacing.md,
  },
  heroBadgeTxt: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 8 },
  heroDesc: { color: 'rgba(255,255,255,0.9)', fontSize: typography.body.fontSize, lineHeight: 20, marginBottom: spacing.xl, maxWidth: '85%' },
  heroBtnPressable: { alignSelf: 'flex-start' },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#fff',
    borderRadius: radii.sm,
    paddingVertical: 12,
    paddingHorizontal: spacing.xl,
  },
  heroBtnTxt: { color: '#4338ca', fontWeight: '800', fontSize: typography.body.fontSize },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  quickCardPressable: {
    flexGrow: 1,
    flexBasis: '45%',
    minWidth: 150,
  },
  quickCard: {
    alignSelf: 'stretch',
    overflow: 'hidden',
    backgroundColor: colors.glassFill,
    borderWidth: 1.5,
    borderRadius: radii.md,
    padding: spacing.lg,
    gap: spacing.md,
  },
  quickIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 4,
  },
  quickLabel: { color: colors.textPrimary, fontWeight: '700', fontSize: typography.body.fontSize },
  cardTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.md },
  patientRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.glassFillStrong,
    borderRadius: radii.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  patientAccent: { width: 4, alignSelf: 'stretch', borderRadius: 2 },
  patientName: { color: colors.textPrimary, fontWeight: '700', fontSize: typography.body.fontSize },
  patientMeta: { color: colors.textMuted, fontSize: typography.caption.fontSize, marginTop: 2 },
});
