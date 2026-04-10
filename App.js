/**
 * Root: gesture root, safe areas, Material theme, task context, navigation.
 */
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';

import { TaskProvider } from './src/context/TaskContext';
import AppNavigator from './src/navigation/AppNavigator';
import { appPaperTheme } from './src/theme/theme';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={appPaperTheme}>
          <TaskProvider>
            <AppNavigator />
          </TaskProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
