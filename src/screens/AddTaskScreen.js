/**
 * Create a new task with title, description, due date, priority.
 */
import React, { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';

import { useTasks } from '../context/TaskContext';
import { inputFill, purple, screenBg, textMuted, textPrimary } from '../theme/theme';

export default function AddTaskScreen({ navigation }) {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(purple);
      }
    }, [])
  );

  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState('medium');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      await addTask({
        title,
        description,
        dueDate,
        priority,
      });
      navigation.goBack();
    } catch (e) {
      setError(e?.message || 'Could not save task.');
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
            placeholder="What do you need to do?"
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
            placeholder="Add details (optional)"
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
            Save task
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
});
