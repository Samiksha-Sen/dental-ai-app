import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MotiView } from 'moti';
import { LayoutDashboard, ScanLine, Users, MessageCircle, Settings } from 'lucide-react-native';
import { colors, spacing, typography } from '../theme/tokens';

const TABS = [
  { key: 'dashboard', label: 'Dash', Icon: LayoutDashboard },
  { key: 'scan', label: 'Scan', Icon: ScanLine },
  { key: 'patients', label: 'Patients', Icon: Users },
  { key: 'chat', label: 'AI Chat', Icon: MessageCircle },
  { key: 'settings', label: 'Settings', Icon: Settings },
];

export default function TabBar({ activeTab, onChange }) {
  return (
    <View style={styles.tray}>
      {TABS.map(({ key, label, Icon }) => {
        const active = activeTab === key;
        return (
          <Pressable key={key} onPress={() => onChange(key)} style={styles.tabNode}>
            {({ pressed }) => (
              <MotiView
                animate={{ scale: pressed ? 0.9 : 1 }}
                transition={{ type: 'spring', damping: 14, stiffness: 220 }}
                style={styles.tabInner}
              >
                <Icon color={active ? colors.cyanLight : colors.textMuted} size={22} strokeWidth={active ? 2.4 : 2} />
                <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
                {active && (
                  <MotiView
                    from={{ opacity: 0, scaleX: 0.4 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ type: 'spring', damping: 14, stiffness: 200 }}
                    style={styles.activeDot}
                  />
                )}
              </MotiView>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tray: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  tabNode: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    fontWeight: '600',
  },
  labelActive: {
    color: colors.cyanLight,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.cyanLight,
    marginTop: 1,
  },
});
