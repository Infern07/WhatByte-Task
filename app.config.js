/**
 * Expo config: loads root `.env` in Node (reliable on Windows + web),
 * then exposes values to the app via `expo-constants` → `extra`.
 */
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const appJson = require('./app.json');

module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      ...(appJson.expo.extra || {}),
      firebaseApiKey: (process.env.EXPO_PUBLIC_API_KEY || '').trim(),
    },
  },
};
