# SchemeWise AI

A modern AI-powered Government Scheme Finder web application built with React, Tailwind CSS, and React Router.

## Features

- Landing page with government-tech inspired hero
- Eligibility form for age, income, state, occupation, gender, and education
- Dashboard with AI-ranked recommended schemes
- Search and category filters
- Scheme details page with match reasons and document checklist
- AI chatbot assistant demo
- Firebase Authentication with anonymous sessions and Google sign-in
- Firestore user profiles, bookmarked schemes, and chatbot history
- Responsive navbar and dashboard sidebar
- Dark and light mode toggle
- Reusable component structure

## Run locally

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Then set your Gemini API key:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_MODEL=gemini-2.5-flash

VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Install and run:

```bash
npm install
npm run dev
```

Then open `http://127.0.0.1:5173`.

## Gemini Security Note

The key is read from environment variables and `.env` is ignored by Git. For production, route Gemini calls through a backend API so the key is never exposed to browser users.

## Firebase Setup

1. Create a Firebase project.
2. Enable Authentication providers:
   - Anonymous
   - Google
3. Create a Firestore database.
4. Add the Firebase web app config values to `.env`.
5. Publish the example rules from `firestore.rules` or copy the same structure into the Firebase console.

Firestore paths used by the app:

```text
users/{uid}
users/{uid}/chatSessions/default
```

User documents store:

```js
{
  profile: {},
  bookmarkedSchemeIds: []
}
```

Chat session documents store:

```js
{
  messages: [
    { role: 'user', text: '...' },
    { role: 'assistant', text: '...' }
  ]
}
```
