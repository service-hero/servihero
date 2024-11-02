import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { User } from '../types';
import type { UserRole } from '../types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to seed initial admin user if it doesn't exist
async function seedAdminUser() {
  try {
    // Check if admin user exists
    const adminEmail = 'admin@demo.com';
    
    try {
      // Try to sign in with admin credentials
      await signInWithEmailAndPassword(auth, adminEmail, 'admin123');
    } catch (error) {
      // If admin doesn't exist, create it
      const { user: adminUser } = await createUserWithEmailAndPassword(
        auth,
        adminEmail,
        'admin123'
      );

      // Create admin account document
      const accountRef = doc(collection(db, 'accounts'));
      const accountId = accountRef.id;
      await setDoc(accountRef, {
        name: 'Demo Agency',
        type: 'agency',
        industry: 'Technology',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Create admin user document with role
      await setDoc(doc(db, 'users', adminUser.uid), {
        name: 'Admin User',
        email: adminEmail,
        role: 'admin' as UserRole,
        accountType: 'agency',
        accountId: accountId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Update Firebase profile
      await updateFirebaseProfile(adminUser, {
        displayName: 'Admin User'
      });
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed admin user on initial load
    seedAdminUser();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get the user document from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              ...userData,
              role: userData.role as UserRole,
              createdAt: userData.createdAt?.toDate(),
              updatedAt: userData.updatedAt?.toDate()
            } as User);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setUser({
        id: firebaseUser.uid,
        ...userData,
        role: userData.role as UserRole,
        createdAt: userData.createdAt?.toDate(),
        updatedAt: userData.updatedAt?.toDate()
      } as User);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const register = async (userData: Partial<User>, password: string) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(
      auth,
      userData.email!,
      password
    );

    // Create account document
    const accountRef = doc(collection(db, 'accounts'));
    const accountId = accountRef.id;
    await setDoc(accountRef, {
      name: `${userData.name}'s Account`,
      type: userData.accountType || 'client',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Create user document with role
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userRole: UserRole = userData.role || 'admin';
    await setDoc(userRef, {
      name: userData.name,
      email: userData.email,
      role: userRole,
      accountType: userData.accountType || 'client',
      accountId: accountId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Update Firebase profile
    await updateFirebaseProfile(firebaseUser, {
      displayName: userData.name
    });

    setUser({
      id: firebaseUser.uid,
      ...userData,
      role: userRole,
      accountId,
      createdAt: new Date(),
      updatedAt: new Date()
    } as User);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    if (data.name) {
      await updateFirebaseProfile(auth.currentUser as FirebaseUser, {
        displayName: data.name,
      });
    }

    setUser({ ...user, ...data });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      login, 
      logout, 
      register, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}