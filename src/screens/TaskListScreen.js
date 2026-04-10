/**
 * Lavender hero, search, filters, sectioned list, bottom bar + FAB.
 */
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  RefreshControl,
  SectionList,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  ActivityIndicator,
  FAB,
  IconButton,
  Menu,
  Searchbar,
  Text,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FilterBar from '../components/FilterBar';
import TaskCard from '../components/TaskCard';
import { useTasks } from '../context/TaskContext';
import { logOut } from '../services/firebase';
import { lavender, purple, screenBg, textMuted } from '../theme/theme';
import { buildTaskSections, getDueDate } from '../utils/taskSections';

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default function TaskListScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const {
    filteredTasks,
    filter,
    setFilter,
    deleteTask,
    toggleComplete,
    tasksLoading,
  } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [weekOnly, setWeekOnly] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Light icons over lavender hero (main stack screens also set this on focus)
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(lavender);
      }
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const displayTasks = useMemo(() => {
    let list = filteredTasks;

    if (weekOnly) {
      const start = startOfDay(new Date());
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      end.setHours(23, 59, 59, 999);
      list = list.filter((t) => {
        const d = getDueDate(t);
        if (!d) return false;
        return d >= start && d <= end;
      });
    }

    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (t) =>
        (t.title || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
    );
  }, [filteredTasks, weekOnly, searchQuery]);

  const sections = useMemo(() => buildTaskSections(displayTasks), [displayTasks]);

  const headerDateLabel = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
    []
  );

  const confirmDelete = (task) => {
    Alert.alert('Delete task', `Delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTask(task.id).catch(() => {}),
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <TaskCard
      task={item}
      onEdit={(t) => navigation.navigate('EditTask', { task: t })}
      onDelete={() => confirmDelete(item)}
      onToggleComplete={(t) => toggleComplete(t.id, t.completed)}
    />
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text variant="titleSmall" style={styles.sectionHeader}>
      {title}
    </Text>
  );

  const listEmpty =
    !tasksLoading && sections.length === 0 ? (
      <Text style={styles.empty} variant="bodyLarge">
        {searchQuery.trim()
          ? 'No tasks match your search.'
          : 'No tasks yet. Tap + to add your first one.'}
      </Text>
    ) : null;

  return (
    <View style={styles.root}>
      {/* Hero header */}
      <View style={[styles.hero, { paddingTop: insets.top + 8 }]}>
        <View style={styles.heroRow}>
          <IconButton
            icon="view-grid-outline"
            iconColor="#FFFFFF"
            onPress={() => setSearchQuery('')}
            accessibilityLabel="Clear search"
          />
          <Searchbar
            placeholder="Search tasks"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchbar}
            inputStyle={styles.searchInput}
            elevation={1}
            iconColor={textMuted}
          />
          <Menu
            visible={menuOpen}
            onDismiss={() => setMenuOpen(false)}
            anchor={
              <IconButton
                icon="dots-horizontal"
                iconColor="#FFFFFF"
                onPress={() => setMenuOpen(true)}
                accessibilityLabel="More options"
              />
            }
            contentStyle={styles.menuContent}
          >
            <Menu.Item
              leadingIcon="logout"
              onPress={() => {
                setMenuOpen(false);
                Alert.alert('Sign out', 'Are you sure you want to sign out?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Sign out', style: 'destructive', onPress: () => logOut() },
                ]);
              }}
              title="Sign out"
            />
          </Menu>
        </View>
        <Text style={styles.heroDate}>{headerDateLabel}</Text>
        <Text style={styles.heroTitle}>My tasks</Text>
      </View>

      {/* Sheet body */}
      <View style={[styles.sheet, { paddingBottom: 100 + insets.bottom }]}>
        <FilterBar filter={filter} onChange={setFilter} />

        {tasksLoading && displayTasks.length === 0 ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={purple} />
            <Text style={styles.loadingText}>Loading tasks…</Text>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            stickySectionHeadersEnabled
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={listEmpty}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Bottom nav */}
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <IconButton
          icon="format-list-bulleted"
          iconColor={purple}
          size={26}
          accessibilityLabel="Task list"
        />
        <View style={styles.fabSpacer} />
        <IconButton
          icon="calendar-month-outline"
          iconColor={weekOnly ? purple : textMuted}
          size={26}
          onPress={() => setWeekOnly((w) => !w)}
          accessibilityLabel={
            weekOnly ? 'Show all dates' : 'Show tasks due in the next 7 days'
          }
        />
      </View>

      <FAB
        icon="plus"
        color="#FFFFFF"
        size="large"
        style={[styles.fab, { bottom: 28 + insets.bottom }]}
        onPress={() => navigation.navigate('AddTask')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: lavender,
  },
  hero: {
    paddingHorizontal: 4,
    paddingBottom: 28,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchbar: {
    flex: 1,
    marginHorizontal: 0,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowOpacity: 0.08,
  },
  searchInput: {
    minHeight: 40,
    fontSize: 15,
  },
  heroDate: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 14,
    marginTop: 12,
    marginLeft: 16,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginLeft: 16,
    marginTop: 4,
  },
  sheet: {
    flex: 1,
    backgroundColor: screenBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -12,
    paddingTop: 8,
    overflow: 'hidden',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 6,
    color: '#5C5C6E',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 24,
  },
  loadingBox: {
    paddingTop: 48,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: textMuted,
  },
  empty: {
    textAlign: 'center',
    marginTop: 48,
    paddingHorizontal: 36,
    color: textMuted,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E8EF',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  fabSpacer: {
    width: 56,
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: purple,
    elevation: 8,
  },
  menuContent: {
    marginTop: 8,
  },
});
