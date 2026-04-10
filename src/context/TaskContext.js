/**
 * Global task state: Firestore sync + filters + CRUD helpers.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const TaskContext = createContext(undefined);

/** @typedef {'all' | 'low' | 'medium' | 'high'} PriorityFilter */
/** @typedef {'all' | 'active' | 'completed'} StatusFilter */

const defaultFilters = {
  /** @type {PriorityFilter} */
  priority: 'all',
  /** @type {StatusFilter} */
  status: 'all',
};

export function TaskProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [filter, setFilter] = useState(defaultFilters);

  // Track signed-in user for Firestore path users/{uid}/tasks
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Live tasks for current user, ordered by due date (earliest first)
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return undefined;
    }

    setTasksLoading(true);
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    const q = query(tasksRef, orderBy('dueDate', 'asc'));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setTasks(list);
        setTasksLoading(false);
      },
      () => setTasksLoading(false)
    );

    return () => unsub();
  }, [user]);

  /** Apply priority + completion filters; list is already sorted by due date from query */
  const filteredTasks = useMemo(() => {
    let list = tasks;

    if (filter.priority !== 'all') {
      list = list.filter((t) => t.priority === filter.priority);
    }

    if (filter.status === 'active') {
      list = list.filter((t) => !t.completed);
    } else if (filter.status === 'completed') {
      list = list.filter((t) => t.completed);
    }

    return list;
  }, [tasks, filter]);

  const addTask = useCallback(
    async ({ title, description, dueDate, priority }) => {
      if (!user) throw new Error('Not signed in');
      await addDoc(collection(db, 'users', user.uid, 'tasks'), {
        title: title.trim(),
        description: (description || '').trim(),
        dueDate: Timestamp.fromDate(dueDate),
        priority,
        completed: false,
        createdAt: serverTimestamp(),
      });
    },
    [user]
  );

  const updateTask = useCallback(
    async (taskId, { title, description, dueDate, priority, completed }) => {
      if (!user) throw new Error('Not signed in');
      const ref = doc(db, 'users', user.uid, 'tasks', taskId);
      const payload = {};
      if (title !== undefined) payload.title = title.trim();
      if (description !== undefined) payload.description = (description || '').trim();
      if (dueDate !== undefined) payload.dueDate = Timestamp.fromDate(dueDate);
      if (priority !== undefined) payload.priority = priority;
      if (completed !== undefined) payload.completed = completed;
      await updateDoc(ref, payload);
    },
    [user]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      if (!user) throw new Error('Not signed in');
      await deleteDoc(doc(db, 'users', user.uid, 'tasks', taskId));
    },
    [user]
  );

  const toggleComplete = useCallback(
    async (taskId, completed) => {
      if (!user) throw new Error('Not signed in');
      await updateDoc(doc(db, 'users', user.uid, 'tasks', taskId), {
        completed: !completed,
      });
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      authLoading,
      tasksLoading,
      tasks,
      filteredTasks,
      filter,
      setFilter,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
    }),
    [
      user,
      authLoading,
      tasksLoading,
      tasks,
      filteredTasks,
      filter,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return ctx;
}
