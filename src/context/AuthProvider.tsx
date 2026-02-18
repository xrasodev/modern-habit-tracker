import React, { useState, useEffect, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  // Keep true at the start to show the SplashScreen
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // --- AUTH FUNCTIONS ---
  const loginUser = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    const handleCustomToken = async () => {
      if (typeof __initial_auth_token !== "undefined") {
        try {
          await signInWithCustomToken(auth, __initial_auth_token);
        } catch (error) {
          console.error("Firebase Auth Error con token custom:", error);
        }
      }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Set the UID
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }

      setIsAuthReady(true);
      setIsAuthLoading(false);
    });

    // Execute custom token logic at startup if applicable
    handleCustomToken();

    return () => unsubscribeAuth(); // Cleanup on unmount
  }, []); // Empty dependency array ensures it runs only on mount

  return (
    <AuthContext.Provider
      value={{
        userId,
        isAuthReady,
        isAuthLoading,
        loginUser,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
