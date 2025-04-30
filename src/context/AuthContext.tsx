import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase'; 

// User type
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt?: { seconds: number } | string;
}

// Context type
interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Check for stored user data in local storage when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Firestore login logic
  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      // Access Firestore collection of users
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email), where('password', '==', password)); // Query based on email and password

      // Get the documents matching the query
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // If a user is found, retrieve the user data from Firestore
        const doc = snapshot.docs[0];
        const foundUser: User = {
          id: doc.id,
          ...doc.data(),
        } as User;

        // Store the user in state and localStorage
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        console.log("Login Done");
        return { success: true };
      } else {
        // If no user is found with matching credentials
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      // Error handling if Firestore query fails
      console.error('Login error:', error);
      return { success: false, message: 'Something went wrong during login.' };
    }
  };

  // Logout function to clear user data
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
