// Gesture handler must load before other imports (React Navigation)
import 'react-native-gesture-handler';

import { registerRootComponent } from 'expo';

import App from './App';

registerRootComponent(App);
