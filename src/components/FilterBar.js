/**
 * Compact filter chips (priority + completion) — purple selection like reference.
 */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';

import { purple, screenBg, textMuted } from '../theme/theme';

const PRIORITY_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'low', label: 'Low' },
  { key: 'medium', label: 'Med' },
  { key: 'high', label: 'High' },
];

const STATUS_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Done' },
];

export default function FilterBar({ filter, onChange }) {
  const setPriority = (priority) => {
    onChange({ ...filter, priority });
  };

  const setStatus = (status) => {
    onChange({ ...filter, status });
  };

  return (
    <View style={styles.wrap}>
      <Text variant="labelLarge" style={styles.sectionLabel}>
        Priority
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {PRIORITY_OPTIONS.map((opt) => {
          const on = filter.priority === opt.key;
          return (
            <Chip
              key={opt.key}
              selected={on}
              onPress={() => setPriority(opt.key)}
              style={[styles.chip, on && styles.chipOn]}
              textStyle={on ? styles.chipLabelOn : styles.chipLabelOff}
              mode="flat"
            >
              {opt.label}
            </Chip>
          );
        })}
      </ScrollView>

      <Text variant="labelLarge" style={[styles.sectionLabel, styles.sectionSpacer]}>
        Status
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {STATUS_OPTIONS.map((opt) => {
          const on = filter.status === opt.key;
          return (
            <Chip
              key={opt.key}
              selected={on}
              onPress={() => setStatus(opt.key)}
              style={[styles.chip, on && styles.chipOn]}
              textStyle={on ? styles.chipLabelOn : styles.chipLabelOff}
              mode="flat"
            >
              {opt.label}
            </Chip>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    backgroundColor: screenBg,
  },
  sectionLabel: {
    marginBottom: 8,
    marginLeft: 16,
    color: textMuted,
    fontWeight: '600',
  },
  sectionSpacer: {
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingHorizontal: 12,
    paddingBottom: 4,
    gap: 8,
  },
  chip: {
    marginRight: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E4E4EE',
  },
  chipOn: {
    backgroundColor: purple,
    borderColor: purple,
  },
  chipLabelOn: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  chipLabelOff: {
    color: textMuted,
  },
});
