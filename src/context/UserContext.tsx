import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { UserProfile } from "@/src/types/account";
import { getToken } from "@/api/Storage";
import { getProfile } from "@/src/api/authApi";

interface UserContextType {
  user: UserProfile | null;
  balance: number;
  token: string | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  updateBalance: (newBalance: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetches the user's profile from the API
   * This is called on mount and can be called manually to refresh
   */
  const refreshProfile = async () => {
    try {
      setIsLoading(true);
      const currentToken = await getToken();
      if (currentToken) {
        setToken(currentToken);
        const profile = await getProfile();
        setUser(profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Updates the balance in the user object
   * Called after successful deposit/withdraw/transfer operations
   */
  const updateBalance = (newBalance: number) => {
    if (user) {
      setUser({ ...user, balance: newBalance });
    }
  };

  // Fetch profile when component mounts
  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        balance: user?.balance || 0,
        token,
        isLoading,
        refreshProfile,
        updateBalance,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

/**
 * Hook to access user context
 * Must be used within UserProvider
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
