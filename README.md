# Mini LMS Mobile App

A feature-rich Learning Management System mobile application built with React Native Expo, TypeScript, and NativeWind.

## Features

- **Authentication**: Secure Login/Register with JWT persistence (Expo SecureStore).
- **Course Catalog**: Browse courses with infinite scroll, search, and pull-to-refresh.
- **Bookmarks**: Save courses locally (AsyncStorage/Zustand persist).
- **Course Learning**: Embedded WebView for course content with bi-directional native communication.
- **Notifications**: Local notifications for study reminders and achievements.
- **UI/UX**: Modern design using NativeWind (Tailwind CSS).

## Tech Stack

- **Framework**: React Native Expo (SDK 50+)
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS)
- **Routing**: Expo Router
- **State Management**: Zustand (Global Store)
- **Networking**: Axios
- **Storage**: Expo SecureStore & AsyncStorage
- **WebView**: react-native-webview
- **Notifications**: expo-notifications

## Architecture

- **/app**: Contains all screen routes (Expo Router file-based routing).
- **/components**: Reusable UI components (Button, Input, CourseCard).
- **/services**: API configuration and endpoints.
- **/store**: Global state management (Auth and Course data).
- **/hooks**: Custom hooks for logic reuse (useCourses, useNotifications).

## Setup Instructions

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the app**:
    ```bash
    npx expo start
    ```
    - Press `i` for iOS simulator
    - Press `a` for Android emulator

## Key Decisions

- **State Management**: Chosen **Zustand** for its simplicity and minimal boilerplate compared to Redux.
- **Styling**: **NativeWind** allows rapid UI development with familiar Tailwind classes.
- **Navigation**: **Expo Router** provides a robust, filesystem-based routing similar to Next.js.

## Known Issues

- The "Random Products" API used for courses does not support filtering by ID natively, so deep linking assumes data availability or would require a refetch strategy in a real production environment.
- Profile picture uploads are simulated locally.

## Screenshots

| Home Screen | Course Details |
|---|---|
| ![Home](assets/screenshots/home.png) | ![Details](assets/screenshots/details.png) |

| Profile | Offline Mode |
|---|---|
| ![Profile](assets/screenshots/profile.png) | ![Offline](assets/screenshots/offline.png) |

## Configuration

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
EXPO_PUBLIC_API_URL=https://api.freeapi.app/api/v1
```
# house-of-edtech
