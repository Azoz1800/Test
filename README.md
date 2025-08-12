# Habit Tracker

A complete, professional, local-only Habit Tracker web app. This application is designed to be a Progressive Web App (PWA), making it installable on any device with offline-first capabilities. It also includes an optional desktop build using Electron.

## Features

*   **Local-First:** All data is stored locally in your browser using IndexedDB. No cloud account needed.
*   **PWA Ready:** Installable on desktop and mobile devices for a native-like experience. Works offline.
*   **Habit Management:** Create, edit, archive, and delete habits.
*   **Daily Tracking:** Mark habits as completed, skipped, or missed for each day.
*   **Calendar View:** Visualize your habit history on a full-page calendar.
*   **Secure Backups:** Export your data to a JSON file, with the option to encrypt it with a passphrase using AES-GCM encryption.
*   **Reminders:** Set daily reminders for your habits (requires the app to be open in a browser tab).
*   **Multi-Language Support:** Includes English and Arabic, with RTL support.
*   **Theming:** Light, dark, and system theme support.
*   **Electron Build (Optional):** Can be packaged as a desktop application with native notifications.

## Tech Stack

*   **Frontend:** React, TypeScript, Vite
*   **State Management:** Zustand
*   **Database:** Dexie.js (IndexedDB wrapper)
*   **Styling:** Tailwind CSS
*   **Date Handling:** date-fns
*   **Internationalization:** react-i18next
*   **Desktop:** Electron (optional)

## Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```

## Running the Application

### Development Mode

To run the application in development mode with hot-reloading:

```bash
npm run dev
```

This will start the Vite development server, typically at `http://localhost:5173`.

### Running the Electron App

To run the application in an Electron window during development:

```bash
npm run dev
```
*(The Vite dev server needs to be running. The Electron app will load the dev URL.)*

### Building for Production

To build the web app for production:

```bash
npm run build
```
*(Note: The build scripts are currently facing issues in the target environment. The command above is the intended way to run the build.)*

The production-ready files will be in the `dist` directory. The `electron-builder` part of the command will create desktop installers in the `release` directory.
