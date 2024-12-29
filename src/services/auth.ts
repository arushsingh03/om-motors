import { auth, db } from './firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { User } from '../types';

export const signUp = async (
    email: string,
    password: string,
    name: string,
    role: User['role']
): Promise<User> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user: User = {
            id: userCredential.user.uid,
            email,
            name,
            role,
            createdAt: new Date(),
        };

        await setDoc(doc(db, 'users', user.id), user);
        return user;
    } catch (error) {
        throw error;
    }
};

export const signIn = async (email: string, password: string) => {
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        throw error;
    }
};

export const logOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
};