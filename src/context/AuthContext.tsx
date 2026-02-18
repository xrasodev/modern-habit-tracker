import { createContext, useContext } from "react";

export interface AuthContextType {
  userId: string | null;
  isAuthReady: boolean;
  isAuthLoading: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// --- AUTH HOOK ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth has to be used inside an AuthProvider");
  }
  return context;
};
