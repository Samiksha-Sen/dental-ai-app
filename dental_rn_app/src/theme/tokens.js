export const colors = {
  bg: '#020617',
  bgElevated: '#08101F',
  bgCard: '#0B1220',

  primary: '#6366F1',
  primaryViolet: '#7C3AED',
  primaryPurple: '#8B5CF6',

  cyan: '#06B6D4',
  cyanLight: '#22D3EE',

  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',

  glassFill: 'rgba(255,255,255,0.05)',
  glassFillStrong: 'rgba(255,255,255,0.08)',
  glassBorder: 'rgba(255,255,255,0.10)',

  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#64748B',

  successBg: 'rgba(16,185,129,0.12)',
  warningBg: 'rgba(245,158,11,0.12)',
  dangerBg: 'rgba(239,68,68,0.12)',
};

export const gradients = {
  primary: [colors.primary, colors.primaryPurple],
  violet: [colors.primaryViolet, colors.primaryPurple],
  cyan: [colors.cyan, colors.cyanLight],
  success: [colors.success, '#059669'],
  danger: [colors.danger, '#B91C1C'],
  bg: [colors.bgCard, colors.bg],
};

export const badgeColors = {
  urgent: { color: '#F87171', bg: colors.dangerBg, border: 'rgba(239,68,68,0.25)' },
  pending: { color: '#FBBF24', bg: colors.warningBg, border: 'rgba(245,158,11,0.25)' },
  cleared: { color: '#34D399', bg: colors.successBg, border: 'rgba(16,185,129,0.25)' },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '800' },
  h2: { fontSize: 22, fontWeight: '800' },
  h3: { fontSize: 17, fontWeight: '700' },
  body: { fontSize: 14, fontWeight: '400' },
  label: { fontSize: 12, fontWeight: '600' },
  caption: { fontSize: 11, fontWeight: '500' },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  glow: (color) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  }),
};
