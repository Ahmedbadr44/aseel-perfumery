"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  is_admin: boolean;
  created_at: Date | null;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  register: (email: string, password: string, display_name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (display_name: string) => Promise<void>;
  makeAdmin: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  async function fetchUserProfile(userId: string, email: string) {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const profile = { id: userDoc.id, ...userDoc.data() } as UserProfile;
        setUserProfile(profile);
        setIsAdmin(profile.is_admin || false);
      } else {
        setUserProfile({
          id: userId,
          email: email,
          display_name: null,
          is_admin: false,
          created_at: null,
        });
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        await fetchUserProfile(firebaseUser.uid, firebaseUser.email || "");
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string, display_name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: display_name });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        display_name: display_name,
        is_admin: false,
        created_at: serverTimestamp(),
      });

      await fetchUserProfile(userCredential.user.uid, email);
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const userEmail = firebaseUser.email || "";
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: userEmail,
          display_name: firebaseUser.displayName,
          is_admin: false,
          created_at: serverTimestamp(),
        });
      }
      
      await fetchUserProfile(firebaseUser.uid, userEmail);
    } catch (error: any) {
      console.error("Google sign in error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const updateUserProfile = async (display_name: string) => {
    if (!user) throw new Error("No user logged in");

    try {
      await updateProfile(user, { displayName: display_name });
      await setDoc(doc(db, "users", user.uid), { display_name }, { merge: true });
      await fetchUserProfile(user.uid, user.email || "");
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  const makeAdmin = async (email: string) => {
    console.warn("makeAdmin is disabled in client context", email);
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    isAdmin,
    register,
    login,
    googleSignIn,
    logout,
    updateUserProfile,
    makeAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
