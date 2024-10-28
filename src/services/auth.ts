import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  type UserCredential,
  type User
} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../config/firebase';

export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const registerUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile with default role
    await set(ref(db, `users/${userCredential.user.uid}`), {
      email: userCredential.user.email,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    return userCredential;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};