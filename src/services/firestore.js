import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/firebase.js';

function userDoc(userId) {
  return doc(db, 'users', userId);
}

function chatDoc(userId) {
  return doc(db, 'users', userId, 'chatSessions', 'default');
}

export async function getUserProfile(userId) {
  if (!isFirebaseConfigured || !userId) return null;

  const snapshot = await getDoc(userDoc(userId));
  return snapshot.exists() ? snapshot.data().profile || null : null;
}

export async function saveUserProfile(userId, profile) {
  if (!isFirebaseConfigured || !userId) return;

  await setDoc(
    userDoc(userId),
    {
      profile,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export function subscribeBookmarkedSchemes(userId, callback) {
  if (!isFirebaseConfigured || !userId) return () => {};

  return onSnapshot(userDoc(userId), (snapshot) => {
    callback(snapshot.exists() ? snapshot.data().bookmarkedSchemeIds || [] : []);
  });
}

export async function saveBookmarkedSchemes(userId, bookmarkedSchemeIds) {
  if (!isFirebaseConfigured || !userId) return;

  await setDoc(
    userDoc(userId),
    {
      bookmarkedSchemeIds,
      bookmarksUpdatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function getChatHistory(userId) {
  if (!isFirebaseConfigured || !userId) return null;

  const snapshot = await getDoc(chatDoc(userId));
  return snapshot.exists() ? snapshot.data().messages || null : null;
}

export async function saveChatHistory(userId, messages) {
  if (!isFirebaseConfigured || !userId) return;

  await setDoc(
    chatDoc(userId),
    {
      messages,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}
