/* eslint-disable react-refresh/only-export-components */

import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "../firebase";
import { getUserProfile, saveUserProfile } from "../services/api";

export const AuthContext = createContext(null);

const emptyProfile = { name: "", address: "", role: "customer" };
const LOCAL_SESSION_KEY = "local-auth-session";
const LOCAL_USERS_KEY = "local-users";

const getStoredSession = () => {
  try {
    const stored = localStorage.getItem(LOCAL_SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveStoredSession = (userData, profileData, adminState) => {
  localStorage.setItem(
    LOCAL_SESSION_KEY,
    JSON.stringify({
      user: userData,
      profile: profileData,
      isAdmin: adminState,
    }),
  );
};

const clearStoredSession = () => {
  localStorage.removeItem(LOCAL_SESSION_KEY);
};

const readLocalUsers = () => {
  try {
    const stored = localStorage.getItem(LOCAL_USERS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed && typeof parsed === "object" ? parsed : {};
    }
  } catch {
    // ignore
  }

  return {};
};

const writeLocalUsers = (users) => {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  return users;
};

const findLocalUser = (email) => {
  const users = readLocalUsers();
  const normalized = email.toLowerCase();

  return Object.values(users).find((entry) => entry.email?.toLowerCase() === normalized) || null;
};

const resolveProfile = (profileData = {}, fallbackName = "") => ({
  name: profileData.name || fallbackName || "",
  address: profileData.address || "",
  role: profileData.role || "customer",
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = getStoredSession();
    return stored?.user || null;
  });
  const [profile, setProfile] = useState(() => {
    const stored = getStoredSession();
    return stored?.profile || emptyProfile;
  });
  const [isAdmin, setIsAdmin] = useState(() => Boolean(getStoredSession()?.isAdmin));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedSession = getStoredSession();
    if (storedSession?.user) {
      setUser(storedSession.user);
      setProfile(storedSession.profile || emptyProfile);
      setIsAdmin(Boolean(storedSession.isAdmin));
      setLoading(false);
      return undefined;
    }

    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setProfile(emptyProfile);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const profileResult = await getUserProfile(firebaseUser.uid);
      const profileData = profileResult?.data || {};
      const resolved = resolveProfile(profileData, firebaseUser.displayName || "");

      setProfile(resolved);
      setIsAdmin(
        resolved.role === "admin" ||
          firebaseUser.email?.toLowerCase() ===
            import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase(),
      );
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const applyLocalSession = (localUser, profileData) => {
    const resolved = resolveProfile(profileData, localUser.displayName || localUser.email || "");
    const adminStatus = resolved.role === "admin" || localUser.email?.toLowerCase() === import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase();

    setUser(localUser);
    setProfile(resolved);
    setIsAdmin(adminStatus);
    saveStoredSession(localUser, resolved, adminStatus);
    return { success: true, user: localUser };
  };

  const login = async (email, password) => {
    const localUser = findLocalUser(email);

    if (!isFirebaseConfigured || !auth) {
      if (localUser && localUser.password === password) {
        return applyLocalSession(
          { uid: localUser.uid, email: localUser.email, displayName: localUser.profile?.name || localUser.email },
          localUser.profile || emptyProfile,
        );
      }

      return { success: false, error: "Invalid email or password." };
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const profileResult = await getUserProfile(result.user.uid);
      const profileData = profileResult?.data || {};
      const resolved = resolveProfile(profileData, result.user.displayName || "");
      setUser(result.user);
      setProfile(resolved);
      setIsAdmin(
        resolved.role === "admin" ||
          result.user.email?.toLowerCase() === import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase(),
      );
      saveStoredSession(result.user, resolved, resolved.role === "admin" || result.user.email?.toLowerCase() === import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase());
      return { success: true, user: result.user };
    } catch (error) {
      if (localUser && localUser.password === password) {
        return applyLocalSession(
          { uid: localUser.uid, email: localUser.email, displayName: localUser.profile?.name || localUser.email },
          localUser.profile || emptyProfile,
        );
      }

      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, extraProfile = {}) => {
    if (findLocalUser(email)) {
      return { success: false, error: "That email is already registered." };
    }

    if (!isFirebaseConfigured || !auth || !db) {
      const uid = `local-${Date.now()}`;
      const profileData = {
        name: extraProfile.name || "",
        address: extraProfile.address || "",
        role: "customer",
      };
      const users = readLocalUsers();
      users[uid] = { uid, email: email.toLowerCase(), password, profile: profileData };
      writeLocalUsers(users);
      return applyLocalSession({ uid, email: email.toLowerCase(), displayName: profileData.name || email }, profileData);
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const initialProfile = {
        name: extraProfile.name || "",
        address: extraProfile.address || "",
        role: "customer",
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", result.user.uid), initialProfile);
      const resolved = resolveProfile(initialProfile, result.user.displayName || "");
      setUser(result.user);
      setProfile(resolved);
      setIsAdmin(false);
      saveStoredSession(result.user, resolved, false);
      return { success: true, user: result.user };
    } catch (error) {
      const uid = `local-${Date.now()}`;
      const profileData = {
        name: extraProfile.name || "",
        address: extraProfile.address || "",
        role: "customer",
      };
      const users = readLocalUsers();
      users[uid] = { uid, email: email.toLowerCase(), password, profile: profileData };
      writeLocalUsers(users);
      return applyLocalSession({ uid, email: email.toLowerCase(), displayName: profileData.name || email }, profileData);
    }
  };

  const logout = async () => {
    clearStoredSession();

    if (!auth) {
      setUser(null);
      setProfile(emptyProfile);
      setIsAdmin(false);
      return { success: true };
    }

    try {
      await signOut(auth);
      setUser(null);
      setProfile(emptyProfile);
      setIsAdmin(false);
      return { success: true };
    } catch (error) {
      setUser(null);
      setProfile(emptyProfile);
      setIsAdmin(false);
      return { success: false, error: error.message };
    }
  };

  const updateUserProfile = async (updates) => {
    if (!user) {
      return { success: false, error: "Please sign in first." };
    }

    try {
      const profileData = { ...updates, updatedAt: serverTimestamp() };
      await saveUserProfile(user.uid, profileData);
      setProfile((prev) => ({ ...prev, ...updates }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteAccount = async () => {
    if (!user) {
      return { success: false, error: "Please sign in first." };
    }

    try {
      const users = readLocalUsers();
      delete users[user.uid];
      writeLocalUsers(users);
      clearStoredSession();

      if (auth && db) {
        await deleteDoc(doc(db, "users", user.uid));
        await deleteUser(auth.currentUser);
      }

      setUser(null);
      setProfile(emptyProfile);
      setIsAdmin(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, login, register, logout, updateUserProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}