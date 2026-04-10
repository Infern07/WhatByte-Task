# Gig Worker Task Management (Expo)

A simple React Native app for gig workers to manage tasks with **Firebase Authentication** (email/password) and **Cloud Firestore**, **React Navigation** stacks, **React Native Paper** UI, and **React Context** for state.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) via `npx` (included when you run scripts below)
- A [Firebase](https://console.firebase.google.com/) project

## 1. Firebase setup

### Create project

1. Go to [Firebase Console](https://console.firebase.google.com/) → **Add project** (or use an existing one).

### Authentication (email/password)

1. Open **Build** → **Authentication** → **Get started**.
2. Under **Sign-in method**, enable **Email/Password**.

### Firestore

1. Open **Build** → **Firestore Database** → **Create database**.
2. For development you can start in **test mode** (time-limited open rules). For a real app, use rules like below.

### Web app config

1. Open **Project settings** (gear) → **Your apps** → add a **Web** app if you don’t have one.
2. Copy the `firebaseConfig` object values.

### Update this project (API key in `.env`)

The **Web API key** is read from a root `.env` file (loaded by [`app.config.js`](app.config.js) and passed into the app via `expo-constants`). Other Firebase fields stay in [`src/services/firebase.js`](src/services/firebase.js).

1. Copy [`.env.example`](.env.example) to `.env` in the project root.
2. Set `EXPO_PUBLIC_API_KEY` to the **apiKey** from Firebase → **Project settings** → **Your apps** → Web app (same project as `projectId` in `firebase.js`).
3. After any `.env` change, restart Metro with a clean cache: `npx expo start -c`

**Note:** `EXPO_PUBLIC_*` values are still embedded in the client bundle (that is normal for Firebase Web keys). The `.env` file mainly keeps keys out of source control—`.env` is listed in `.gitignore`.

### Firestore security rules (recommended)

In **Firestore** → **Rules**, restrict data to the signed-in user:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Publish the rules after editing.

### Firestore index

Tasks are queried with `orderBy('dueDate', 'asc')`. If the console asks for a **composite index**, click the link in the error message to create it, or add a single-field index on `dueDate` under **Firestore** → **Indexes** if needed.

## 2. Install and run

From the project folder:

```bash
npm install
npm start
```

Then:

- Press **`a`** for Android emulator / device (with Expo Go or dev client)
- Press **`w`** for web (if supported by your setup)
- Scan the QR code with **Expo Go** on a phone

Common scripts:

| Command        | Description              |
| -------------- | ------------------------ |
| `npm start`    | Start Metro / Expo       |
| `npm run android` | Start on Android     |
| `npm run ios`  | Start on iOS (macOS)     |
| `npm run web`  | Start web                |

## 3. Project structure

```
src/
  screens/          Login, Register, Task list, Add/Edit task
  components/       TaskCard, FilterBar
  navigation/       Auth + main stack
  services/firebase.js
  context/TaskContext.js
```

## Features

- Register / login with email and password (Firebase Auth)
- Tasks stored under `users/{uid}/tasks` in Firestore
- Fields: title, description, due date, priority (low / medium / high), completed
- Sort by due date (earliest first) via Firestore query
- Priority colors: high = red, medium = yellow, low = green
- Completed tasks shown with strike-through
- Filter by priority and completion status
- Add, edit, delete, toggle complete

## Troubleshooting

- **`Cannot find module 'babel-preset-expo'`**: Babel loads presets from the project root. Run `npx expo install babel-preset-expo` so it is listed in `package.json` (already included in this template after that install).
- **Firebase errors on startup**: Double-check `firebaseConfig` in `src/services/firebase.js`.
- **Permission denied in Firestore**: Update security rules and ensure the user is signed in.
- **Blank list after login**: Confirm Firestore is created in the same project as Auth.

## License

Use and modify freely for learning or your own projects.
