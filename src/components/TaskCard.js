/**
 * Task row: white card, checkbox, title, date, priority tag; swipe to delete.
 */
import React, { useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { priorityTags, textMuted, textPrimary } from '../theme/theme';

function formatShortDate(dueDate) {
  if (!dueDate) return '';
  const d = dueDate.toDate ? dueDate.toDate() : new Date(dueDate);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

export default function TaskCard({ task, onEdit, onDelete, onToggleComplete }) {
  const swipeRef = useRef(null);
  const tag = priorityTags[task.priority] || priorityTags.medium;
  const done = !!task.completed;

  const closeSwipe = () => swipeRef.current?.close();

  const renderRight = () => (
    <View style={styles.deletePane}>
      <Pressable
        style={styles.deletePress}
        onPress={() => {
          closeSwipe();
          onDelete(task);
        }}
        accessibilityLabel="Delete task"
      >
        <MaterialCommunityIcons name="trash-can-outline" size={26} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRight}
      overshootRight={false}
      friction={2}
    >
      <View style={styles.card}>
        <Pressable
          onPress={() => onToggleComplete(task)}
          style={styles.checkboxWrap}
          hitSlop={8}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
        >
          <View style={[styles.checkbox, done && styles.checkboxOn]}>
            {done ? (
              <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
            ) : null}
          </View>
        </Pressable>

        <Pressable
          onPress={() => onEdit(task)}
          style={styles.middlePress}
          accessibilityLabel="Edit task"
        >
          <View style={styles.middle}>
            <Text numberOfLines={2} style={[styles.title, done && styles.titleDone]}>
              {task.title || '(Untitled)'}
            </Text>
            <Text style={[styles.dateLine, done && styles.metaDone]}>
              {formatShortDate(task.dueDate)}
            </Text>
            {!!task.description && (
              <Text numberOfLines={1} style={[styles.snippet, done && styles.metaDone]}>
                {task.description}
              </Text>
            )}
          </View>
        </Pressable>

        <View style={[styles.tag, { backgroundColor: tag.bg }]}>
          <Text style={[styles.tagText, { color: tag.text }]}>{tag.label}</Text>
        </View>
      </View>
    </Swipeable>
  );
}

/** @deprecated use priorityTags from theme */
export const PRIORITY_COLORS = {
  high: '#E53935',
  medium: '#FFB300',
  low: '#43A047',
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  checkboxWrap: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C5C5D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: '#7E57C2',
    borderColor: '#7E57C2',
  },
  middlePress: {
    flex: 1,
    minWidth: 0,
  },
  middle: {
    paddingRight: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: textPrimary,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: textMuted,
    fontWeight: '500',
  },
  dateLine: {
    marginTop: 4,
    fontSize: 13,
    color: textMuted,
  },
  snippet: {
    marginTop: 2,
    fontSize: 12,
    color: textMuted,
  },
  metaDone: {
    opacity: 0.65,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 6,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  deletePane: {
    justifyContent: 'center',
    marginRight: 16,
    marginVertical: 6,
  },
  deletePress: {
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    width: 72,
    minHeight: 88,
    borderRadius: 16,
  },
});
