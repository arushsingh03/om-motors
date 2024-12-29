import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { TruckDetails } from '../types';

export const addTruckDetails = async (truckDetails: Omit<TruckDetails, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
        const docRef = await addDoc(collection(db, 'trucks'), {
            ...truckDetails,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return docRef.id;
    } catch (error) {
        throw error;
    }
};

export const updateTruckDetails = async (id: string, updates: Partial<TruckDetails>) => {
    try {
        const truckRef = doc(db, 'trucks', id);
        await updateDoc(truckRef, {
            ...updates,
            updatedAt: new Date()
        });
    } catch (error) {
        throw error;
    }
};

export const deleteTruckDetails = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'trucks', id));
    } catch (error) {
        throw error;
    }
};

export const getTruckDetails = async (id: string) => {
    try {
        const truckRef = doc(db, 'trucks', id);
        const truckSnap = await getDoc(truckRef);
        return truckSnap.data() as TruckDetails;
    } catch (error) {
        throw error;
    }
};

export const getAllTrucks = async () => {
    try {
        const trucksRef = collection(db, 'trucks');
        const querySnapshot = await getDocs(trucksRef);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as TruckDetails[];
    } catch (error) {
        throw error;
    }
};