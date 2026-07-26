import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Platform, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import {
  CloudUpload,
  Camera,
  CheckCircle2,
  Save,
  Download,
  Share2,
  RotateCcw,
  Sparkles,
} from 'lucide-react-native';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import CircularGauge from '../components/CircularGauge';
import LaserScanLine from '../animations/LaserScanLine';
import FadeSlideIn from '../animations/FadeSlideIn';
import SuccessCheckmark from '../animations/SuccessCheckmark';
import { colors, gradients, radii, spacing, typography } from '../theme/tokens';

function ScannerRing() {
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 2600, easing: Easing.linear }), -1);
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));
  return (
    <Animated.View style={[styles.scannerRing, style]}>
      <LinearGradient
        colors={['transparent', colors.cyanLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.scannerRingFill}
      />
    </Animated.View>
  );
}

function ImageParticles() {
  const particles = React.useMemo(
    () => Array.from({ length: 8 }, (_, i) => ({
      id: i,
      angle: (i / 8) * 360,
      delay: i * 120,
    })),
    []
  );
  return (
    <>
      {particles.map((p) => (
        <MotiView
          key={p.id}
          from={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0], scale: 1 }}
          transition={{ type: 'timing', duration: 1800, delay: p.delay, loop: true }}
          style={[
            styles.particle,
            {
              left: `${50 + 46 * Math.cos((p.angle * Math.PI) / 180)}%`,
              top: `${50 + 46 * Math.sin((p.angle * Math.PI) / 180)}%`,
            },
          ]}
        />
      ))}
    </>
  );
}

export default function Scan({
  isScanning,
  scanProgress,
  scanStatusText,
  predictionCondition,
  predictionExtraction,
  predictionConfidence,
  activePatientName,
  selectedImage,
  selectedFile,
  patients,
  setActivePatientName,
  triggerUpload,
  takePhoto,
  fileInputRef,
  handleFileSelect,
  startScan,
  handleSaveScanToEHR,
  handleResetScan,
}) {
  const [saved, setSaved] = React.useState(false);
  const imageUri = selectedImage || selectedFile;
  const isCaries = predictionCondition === 'Caries Detected';

  const onSave = async () => {
    await handleSaveScanToEHR();
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const reportText = predictionCondition
    ? `DentalAI Diagnostic Report\nPatient: ${activePatientName}\nResult: ${predictionCondition}\nConfidence: ${predictionConfidence.toFixed(1)}%\nRecommendation: ${predictionExtraction}`
    : '';

  const onShare = () => {
    Share.share({ message: reportText, title: 'DentalAI Diagnostic Report' }).catch(() => {});
  };

  // --- Scanning state ---
  if (isScanning) {
    return (
      <View style={styles.centerWrap}>
        <Text style={styles.title}>AI Model Analysing X-Ray...</Text>
        <View style={styles.scanStage}>
          {imageUri && <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" blurRadius={1} />}
          <View style={styles.scanGridOverlay} />
          <LaserScanLine active />
          <ScannerRing />
        </View>
        <GlassCard style={{ alignItems: 'center' }}>
          <Sparkles color={colors.cyanLight} size={22} style={{ marginBottom: spacing.sm }} />
          <Text style={styles.statusTxt}>{scanStatusText}</Text>
          <View style={styles.progressTrack}>
            <MotiView
              animate={{ width: `${scanProgress}%` }}
              transition={{ type: 'timing', duration: 200 }}
              style={styles.progressFill}
            >
              <LinearGradient colors={gradients.cyan} style={StyleSheet.absoluteFillObject} />
            </MotiView>
          </View>
          <Text style={styles.progressPct}>{scanProgress}% Complete</Text>
        </GlassCard>
      </View>
    );
  }

  // --- Result state ---
  if (predictionCondition) {
    const accent = isCaries ? colors.danger : colors.success;
    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <FadeSlideIn>
          <Text style={styles.title}>AI Diagnostics Report</Text>
          <Text style={styles.patientLine}>
            Patient: <Text style={styles.patientLineName}>{activePatientName}</Text>
          </Text>
        </FadeSlideIn>

        <FadeSlideIn delay={80}>
          <View style={styles.imageFrame}>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.resultImage} resizeMode="contain" />}
          </View>
        </FadeSlideIn>

        <FadeSlideIn delay={140}>
          <GlassCard>
            <Text style={styles.label}>AI Diagnostic Outcome</Text>
            <View style={[styles.outcomeBadge, { backgroundColor: isCaries ? colors.dangerBg : colors.successBg }]}>
              {isCaries ? <Sparkles color={accent} size={14} /> : <CheckCircle2 color={accent} size={14} />}
              <Text style={[styles.outcomeTxt, { color: accent }]}>
                {isCaries ? 'Caries Found' : 'No Caries Detected'}
              </Text>
            </View>

            <Text style={styles.explainTxt}>
              {isCaries
                ? 'The AI model has detected demineralization layers on the crown surface. Urgent restoration or extraction is recommended.'
                : 'No significant demineralization or enamel erosion was detected. The tooth structural integrity is within standard parameters.'}
            </Text>

            <View style={styles.divider} />

            <View style={styles.statGrid}>
              <CircularGauge size={90} value={predictionConfidence} color={accent} />
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={styles.label}>Clinical Recommendation</Text>
                <Text style={[styles.recTxt, { color: accent }]}>{predictionExtraction}</Text>
              </View>
            </View>
          </GlassCard>
        </FadeSlideIn>

        <FadeSlideIn delay={200}>
          {saved ? (
            <View style={styles.savedWrap}>
              <SuccessCheckmark size={56} />
              <Text style={styles.savedTxt}>Saved to Patient EHR</Text>
            </View>
          ) : (
            <GradientButton
              title="Save to Patient EHR"
              icon={<Save color="#fff" size={17} />}
              onPress={onSave}
              colorsOverride={gradients.success}
              style={{ marginBottom: spacing.md }}
            />
          )}

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.ghostBtn} onPress={onShare}>
              <Share2 color={colors.cyanLight} size={16} />
              <Text style={styles.ghostBtnTxt}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghostBtn} onPress={onShare}>
              <Download color={colors.cyanLight} size={16} />
              <Text style={styles.ghostBtnTxt}>Download Report</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.resetBtn} onPress={handleResetScan}>
            <RotateCcw color={colors.primary} size={16} />
            <Text style={styles.resetBtnTxt}>Scan Another X-Ray</Text>
          </TouchableOpacity>
        </FadeSlideIn>
      </ScrollView>
    );
  }

  // --- Upload state ---
  return (
    <View style={styles.centerWrap}>
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingVertical: 10 }}>
        <FadeSlideIn>
          <Text style={styles.title}>Upload Dental X-Ray for AI Analysis</Text>
        </FadeSlideIn>

        <FadeSlideIn delay={60}>
          <GlassCard style={{ paddingVertical: spacing.md }}>
            <Text style={styles.label}>Select Patient for Scan</Text>
            <View style={styles.chipRow}>
              {patients.map((p) => {
                const active = activePatientName === p.name;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setActivePatientName(p.name)}
                  >
                    <Text style={[styles.chipTxt, active && styles.chipTxtActive]}>{p.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </GlassCard>
        </FadeSlideIn>

        <FadeSlideIn delay={120}>
          <TouchableOpacity style={styles.dropzone} onPress={triggerUpload}>
            <View style={styles.dropzoneIconWrap}>
              {(selectedImage || selectedFile) ? (
                <CheckCircle2 color={colors.success} size={30} />
              ) : (
                <CloudUpload color={colors.primary} size={30} />
              )}
            </View>
            <Text style={styles.dropzoneTitle}>
              {(selectedImage || selectedFile) ? 'X-Ray Selected — tap to change' : 'Select X-Ray Image'}
            </Text>
            <Text style={styles.dropzoneDesc}>
              {(selectedImage || selectedFile)
                ? 'Ready to analyse. Press the button below.'
                : 'Tap here to select PNG/JPG file from your device'}
            </Text>
            {(selectedImage || selectedFile) && (
              <View style={styles.previewWrap}>
                <Image source={{ uri: selectedImage || selectedFile }} style={styles.previewImg} />
                <ImageParticles />
              </View>
            )}
          </TouchableOpacity>
        </FadeSlideIn>

        {Platform.OS !== 'web' && (
          <FadeSlideIn delay={160}>
            <TouchableOpacity style={styles.cameraBtn} onPress={takePhoto}>
              <Camera color="#fff" size={18} />
              <Text style={styles.cameraBtnTxt}>Take Live Photo of X-Ray</Text>
            </TouchableOpacity>
          </FadeSlideIn>
        )}

        {Platform.OS === 'web' && (
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} />
        )}

        <FadeSlideIn delay={200}>
          {(selectedImage || selectedFile) ? (
            <GradientButton
              title="Analyse X-Ray with AI Model"
              icon={<Sparkles color="#fff" size={17} />}
              onPress={startScan}
              style={{ marginBottom: spacing.lg }}
            />
          ) : (
            <GlassCard style={{ alignItems: 'center', paddingVertical: spacing.md }}>
              <Text style={{ color: colors.textMuted, fontSize: typography.caption.fontSize }}>
                Select an X-Ray image above to enable analysis
              </Text>
            </GlassCard>
          )}
        </FadeSlideIn>

        <FadeSlideIn delay={240}>
          <GlassCard>
            <Text style={styles.label}>Model info</Text>
            <Text style={styles.specItem}>✓ Model: caries_model1.h5 (256×256 RGB)</Text>
            <Text style={styles.specItem}>✓ Output: Binary caries classification</Text>
            <Text style={styles.specItem}>✓ Recommendation: Surgical / Manual extraction</Text>
          </GlassCard>
        </FadeSlideIn>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centerWrap: { flex: 1, padding: spacing.xl, paddingTop: 50 },
  scroll: { padding: spacing.lg, paddingTop: 50, paddingBottom: 24 },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md },
  patientLine: { color: colors.textSecondary, fontSize: typography.body.fontSize, marginBottom: spacing.lg },
  patientLineName: { fontWeight: '700', color: colors.textPrimary },

  scanStage: {
    height: 240,
    borderRadius: radii.lg,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanGridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2,6,23,0.35)',
  },
  scannerRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerRingFill: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 45,
    opacity: 0.6,
  },
  statusTxt: { color: colors.textSecondary, fontSize: typography.body.fontSize, textAlign: 'center', marginBottom: spacing.md },
  progressTrack: { width: '100%', height: 6, borderRadius: 3, backgroundColor: colors.glassFillStrong, overflow: 'hidden', marginBottom: spacing.sm },
  progressFill: { height: '100%', borderRadius: 3, overflow: 'hidden' },
  progressPct: { color: colors.cyanLight, fontSize: typography.caption.fontSize, fontWeight: '700' },

  imageFrame: { alignItems: 'center', marginBottom: spacing.lg },
  resultImage: { width: '100%', height: 240, borderRadius: radii.md, borderWidth: 1, borderColor: colors.glassBorder },

  label: { ...typography.label, color: colors.textMuted, textTransform: 'uppercase', marginBottom: spacing.sm },
  outcomeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radii.sm, marginBottom: spacing.md,
  },
  outcomeTxt: { fontWeight: '800', fontSize: typography.body.fontSize },
  explainTxt: { color: colors.textSecondary, fontSize: 13, lineHeight: 18, marginBottom: spacing.lg },
  divider: { height: 1, backgroundColor: colors.glassBorder, marginBottom: spacing.lg },
  statGrid: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  recTxt: { fontWeight: '800', fontSize: 16, marginTop: 2 },

  savedWrap: { alignItems: 'center', paddingVertical: spacing.lg, marginBottom: spacing.md },
  savedTxt: { color: colors.success, fontWeight: '700', marginTop: spacing.sm },

  actionRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  ghostBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1, borderColor: colors.glassBorder, backgroundColor: colors.glassFill,
    borderRadius: radii.sm, paddingVertical: 12,
  },
  ghostBtnTxt: { color: colors.cyanLight, fontWeight: '700', fontSize: 13 },
  resetBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1, borderColor: 'rgba(99,102,241,0.4)', backgroundColor: 'rgba(99,102,241,0.1)',
    borderRadius: radii.md, paddingVertical: 14, marginBottom: 30,
  },
  resetBtnTxt: { color: colors.primary, fontWeight: '700', fontSize: 15 },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  chip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.sm,
    backgroundColor: colors.glassFill, borderWidth: 1, borderColor: colors.glassBorder,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: '#fff' },
  chipTxt: { color: '#fff', fontSize: 12 },
  chipTxtActive: { fontWeight: '700' },

  dropzone: {
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.glassBorder,
    borderRadius: radii.lg, alignItems: 'center', padding: spacing.xl, marginTop: spacing.lg, marginBottom: spacing.lg,
  },
  dropzoneIconWrap: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.glassFillStrong,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  dropzoneTitle: { color: colors.textPrimary, fontWeight: '700', fontSize: typography.body.fontSize, marginBottom: 4, textAlign: 'center' },
  dropzoneDesc: { color: colors.textMuted, fontSize: typography.caption.fontSize, textAlign: 'center' },
  previewWrap: { marginTop: spacing.md, width: 140, height: 140 },
  previewImg: { width: 140, height: 140, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.primary },
  particle: {
    position: 'absolute', width: 4, height: 4, borderRadius: 2, backgroundColor: colors.cyanLight,
  },

  cameraBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    backgroundColor: colors.glassFill, borderWidth: 1, borderColor: colors.glassBorder,
    borderRadius: radii.md, paddingVertical: 14, marginBottom: spacing.lg,
  },
  cameraBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },

  specItem: { color: colors.textMuted, fontSize: 12, marginBottom: 4 },
});
