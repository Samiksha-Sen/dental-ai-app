import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { MotiView } from 'moti';
import { Grid3x3, CheckCircle2 } from 'lucide-react-native';
import GlassCard from '../components/GlassCard';
import CircularGauge from '../components/CircularGauge';
import FadeSlideIn from '../animations/FadeSlideIn';
import { colors, spacing, radii, typography } from '../theme/tokens';

const ROW_UPPER = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const ROW_LOWER = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

function ToothNode({ num, selected, decayed, onPress }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={[styles.toothNode, decayed && styles.nodeDecay, selected && styles.nodeSelected]}
    >
      {({ pressed }) => (
        <MotiView
          animate={{ scale: pressed ? 0.88 : hovered ? 1.08 : 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 220 }}
          style={styles.nodeInner}
        >
          <Grid3x3
            color={decayed ? colors.danger : selected ? colors.cyanLight : colors.textMuted}
            size={14}
          />
          <Text style={[styles.nodeNum, decayed && { color: colors.danger }]}>{num}</Text>
        </MotiView>
      )}
    </Pressable>
  );
}

export default function ToothMap({
  selectedTooth,
  setSelectedTooth,
  decayedTooth,
  scannedTooth,
  predictionCondition,
  predictionExtraction,
  predictionConfidence,
}) {
  const isCaries = predictionCondition === 'Caries Detected';
  const hasResult = selectedTooth === scannedTooth && !!predictionCondition;
  const accent = isCaries ? colors.danger : colors.success;

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <FadeSlideIn>
        <Text style={styles.title}>Attestation Panoramic Map</Text>
        <Text style={styles.hint}>Tap a molar quadrant node to display decay attenuation stats:</Text>
      </FadeSlideIn>

      <FadeSlideIn delay={80}>
        <GlassCard style={styles.gridCard}>
          <View style={styles.jawRow}>
            {ROW_UPPER.map((num) => (
              <ToothNode key={num} num={num} selected={selectedTooth === num} onPress={() => setSelectedTooth(num)} />
            ))}
          </View>
          <View style={styles.jawRow}>
            {ROW_LOWER.map((num) => (
              <ToothNode
                key={num}
                num={num}
                selected={selectedTooth === num}
                decayed={decayedTooth === num}
                onPress={() => setSelectedTooth(num)}
              />
            ))}
          </View>
        </GlassCard>
      </FadeSlideIn>

      <MotiView
        key={selectedTooth}
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 260 }}
        style={{ alignSelf: 'stretch' }}
      >
        <GlassCard>
          <Text style={styles.cardTitle}>Molar Tooth {selectedTooth} Diagnosis</Text>
          {hasResult ? (
            <View>
              <View style={[styles.badge, { backgroundColor: isCaries ? colors.dangerBg : colors.successBg }]}>
                <Text style={[styles.badgeTxt, { color: accent }]}>{predictionCondition}</Text>
              </View>
              <Text style={styles.desc}>
                {isCaries ? 'Caries found, go for surgical extraction.' : 'No caries detected, go for manual extraction.'}
              </Text>

              <View style={styles.statGrid}>
                <CircularGauge size={100} value={predictionConfidence} color={accent} />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.label}>Extraction recommendation</Text>
                  <Text style={[styles.recTxt, { color: accent }]}>{predictionExtraction}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View>
              <View style={[styles.badge, { backgroundColor: colors.successBg, flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
                <CheckCircle2 color={colors.success} size={14} />
                <Text style={[styles.badgeTxt, { color: colors.success }]}>Healthy Clear</Text>
              </View>
              <Text style={styles.desc}>Tissue density structures fall in standard parameters. Root stability confirmed.</Text>
            </View>
          )}
        </GlassCard>
      </MotiView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, paddingTop: 50, paddingBottom: 24 },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: 6 },
  hint: { color: colors.textMuted, fontSize: typography.caption.fontSize, marginBottom: spacing.lg },
  gridCard: { gap: spacing.sm },
  jawRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginBottom: spacing.sm },
  toothNode: {
    width: 36, height: 44, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.glassFillStrong, borderWidth: 1, borderColor: colors.glassBorder,
  },
  nodeInner: { alignItems: 'center', justifyContent: 'center', gap: 2 },
  nodeSelected: { borderColor: colors.cyanLight, backgroundColor: 'rgba(6,182,212,0.12)' },
  nodeDecay: { borderColor: colors.danger, backgroundColor: colors.dangerBg },
  nodeNum: { color: colors.textSecondary, fontSize: 10, fontWeight: '700' },
  cardTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.md },
  badge: { alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radii.sm, marginBottom: spacing.sm },
  badgeTxt: { fontWeight: '700', fontSize: 13 },
  desc: { color: colors.textSecondary, fontSize: 13, marginTop: 4, marginBottom: spacing.md },
  statGrid: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginTop: spacing.sm },
  label: { ...typography.label, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 4 },
  recTxt: { fontWeight: '800', fontSize: 15 },
});
