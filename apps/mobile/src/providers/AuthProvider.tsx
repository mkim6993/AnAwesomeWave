import { createContext, useContext, useState, ReactNode } from 'react';

type AuthContextType = {
  userId: string;
  setUserId: (userId: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// const testUserId = 'cmwbfo5fx0001ydb60d11maix'; // outofit
const testUserId = 'cmwcrr2nr0000vcb6yr1ds4f2'; // Jokic

export function AuthProvider({ children }: { children: ReactNode }) {
  // Temporary hardcoded userId for testing
  // TODO: Replace with actual auth implementation using SecureStore
  const [userId, setUserId] = useState<string>(testUserId);

  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
