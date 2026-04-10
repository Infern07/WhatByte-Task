/**
 * Edit an existing task (same fields as add).
 */
import React, { useCallback, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';

import { useTasks } from '../context/TaskContext';
import { inputFill, purple, screenBg, textMuted, textPrimary } from '../theme/theme';

function taskToDueDate(task) {
  if (!task?.dueDate) return new Date();
  return task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate);
}

export default function EditTaskScreen({ route, navigation }) {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(purple);
      }
    }, [])
  );

  const { task } = route.params || {};
  const { updateTask } = useTasks();

  const initialDue = useMemo(() => taskToDueDate(task), [task]);

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(initialDue);
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [completed, setCompleted] = useState(!!task?.completed);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!task?.id) {
    return (
      <View style={styles.flex}>
        <Text style={styles.centerMsg}>Missing task.</Text>
        <Button onPress={() => navigation.goBack()} textColor={purple}>
          Go back
        </Button>
      </View>
    );
  }

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleSave = async () => {
    setError('');
    if (!title.trim()) {
      setError('Please enter a title.');
      return;
    }

    setLoading(true);
    try {
      await updateTask(task.id, {
        title,
        description,
        dueDate,
        priority,
        completed,
      });
      navigation.goBack();
    } catch (e) {
      setError(e?.message || 'Could not update task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.inner}>
          <Text variant="labelLarge" style={styles.label}>
            TITLE
          </Text>
          <TextInput
            mode="flat"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
          />

          <Text variant="labelLarge" style={[styles.label, styles.labelSpacer]}>
            DESCRIPTION
          </Text>
          <TextInput
            mode="flat"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.inputMultiline]}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
          />

          <Text variant="labelLarge" style={styles.label}>
            DUE DATE
          </Text>
          <Button
            mode="contained-tonal"
            onPress={() => setShowDatePicker(true)}
            style={styles.dateBtn}
            textColor={textPrimary}
            buttonColor={inputFill}
          >
            {dueDate.toLocaleDateString(undefined, {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Button>
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
            />
          )}
          {Platform.OS === 'ios' && showDatePicker && (
            <Button mode="text" textColor={purple} onPress={() => setShowDatePicker(false)}>
              Done
            </Button>
          )}

          <Text variant="labelLarge" style={[styles.label, styles.labelSpacer]}>
            PRIORITY
          </Text>
          <SegmentedButtons
            value={priority}
            onValueChange={setPriority}
            buttons={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
            style={styles.segmented}
          />

          <Text variant="labelLarge" style={[styles.label, styles.labelSpacer]}>
            STATUS
          </Text>
          <SegmentedButtons
            value={completed ? 'completed' : 'active'}
            onValueChange={(v) => setCompleted(v === 'completed')}
            buttons={[
              { value: 'active', label: 'Active' },
              { value: 'completed', label: 'Completed' },
            ]}
            style={styles.segmented}
          />

          {!!error && (
            <Text style={styles.error} variant="bodySmall">
              {error}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            style={styles.save}
            contentStyle={styles.saveContent}
            buttonColor={purple}
          >
            Save changes
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: screenBg },
  scroll: { padding: 20, paddingBottom: 40 },
  inner: { maxWidth: 560, width: '100%', alignSelf: 'center' },
  label: {
    color: textMuted,
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  labelSpacer: { marginTop: 16 },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  inputMultiline: {
    minHeight: 100,
    paddingTop: 12,
  },
  dateBtn: {
    borderRadius: 14,
    marginTop: 4,
  },
  segmented: { marginBottom: 8, marginTop: 4 },
  error: { color: '#C62828', marginBottom: 8, marginTop: 8 },
  save: {
    marginTop: 20,
    borderRadius: 28,
  },
  saveContent: { paddingVertical: 8 },
  centerMsg: { textAlign: 'center', margin: 24, color: textMuted },
});
