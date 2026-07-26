import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText, AnimatePresence } from 'moti';
import { Activity } from 'lucide-react-native';
import { colors, gradients, radii, spacing, typography } from '../theme/tokens';

const { width, height } = Dimensions.get('window');

const BOOT_LINES = [
  'Initializing secure clinical environment...',
  'Loading MobileNetV2 feature extractor...',
  'Calibrating caries diagnostic engine...',
  'Establishing encrypted Supabase link...',
  'Ready.',
];

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * width,
  y: Math.random() * height,
  size: 2 + Math.random() * 3,
  delay: Math.random() * 1200,
  duration: 2200 + Math.random() * 1600,
}));

export default function Splash({ onDone, duration = 2200 }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const lineTimer = setInterval(() => {
      setLineIdx((i) => Math.min(i + 1, BOOT_LINES.length - 1));
    }, duration / BOOT_LINES.length);

    const start = Date.now();
    const progressTimer = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / duration) * 100);
      setProgress(pct);
    }, 60);

    const done = setTimeout(() => {
      clearInterval(lineTimer);
      clearInterval(progressTimer);
      onDone && onDone();
    }, duration);

    return () => {
      clearInterval(lineTimer);
      clearInterval(progressTimer);
      clearTimeout(done);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.wrapper}>
      <LinearGradient colors={gradients.bg} style={StyleSheet.absoluteFillObject} />

      {PARTICLES.map((p) => (
        <MotiView
          key={p.id}
          from={{ opacity: 0, translateY: p.y + 20 }}
          animate={{ opacity: [0, 0.6, 0], translateY: p.y - 40 }}
          transition={{ type: 'timing', duration: p.duration, delay: p.delay, loop: true }}
          style={{
            position: 'absolute',
            left: p.x,
            width: p.size,
            height: p.size,
            borderRadius: p.size / 2,
            backgroundColor: colors.cyanLight,
          }}
        />
      ))}

      <View style={styles.center}>
        <MotiView
          from={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 9, stiffness: 120 }}
          style={styles.logoBadge}
        >
          <LinearGradient colors={gradients.primary} style={StyleSheet.absoluteFillObject} />
          <Activity color="#fff" size={30} />
        </MotiView>

        <MotiText
          from={{ opacity: 0, translateY: 8 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 200 }}
          style={styles.brand}
        >
          DENTAL.AI
        </MotiText>
        <Text style={styles.tagline}>Clinical Attestation Diagnostic System</Text>

        <View style={styles.bootBox}>
          <AnimatePresence exitBeforeEnter>
            <MotiText
              key={lineIdx}
              from={{ opacity: 0, translateY: 6 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -6 }}
              transition={{ type: 'timing', duration: 260 }}
              style={styles.bootText}
            >
              {BOOT_LINES[lineIdx]}
            </MotiText>
          </AnimatePresence>
        </View>

        <View style={styles.progressTrack}>
          <MotiView
            animate={{ width: `${progress}%` }}
            transition={{ type: 'timing', duration: 80 }}
            style={styles.progressFill}
          >
            <LinearGradient colors={gradients.cyan} style={StyleSheet.absoluteFillObject} />
          </MotiView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.bg },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  brand: {
    ...typography.h1,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  tagline: {
    color: colors.textMuted,
    fontSize: typography.body.fontSize,
    marginTop: 6,
    marginBottom: spacing.xxl,
  },
  bootBox: {
    height: 20,
    marginBottom: spacing.lg,
  },
  bootText: {
    color: colors.textSecondary,
    fontSize: typography.caption.fontSize,
    letterSpacing: 0.3,
  },
  progressTrack: {
    width: 200,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.glassFillStrong,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
});
