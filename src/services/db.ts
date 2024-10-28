import {
  ref,
  set,
  get,
  remove,
  query,
  orderByChild,
  equalTo,
  push,
  update,
  DatabaseReference
} from 'firebase/database';
import { db } from '../config/firebase';

export async function createData(path: string, data: any): Promise<string> {
  try {
    const newRef = push(ref(db, path));
    await set(newRef, {
      ...data,
      id: newRef.key,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return newRef.key as string;
  } catch (error) {
    console.error('Error creating data:', error);
    throw error;
  }
}

export async function updateData(path: string, id: string, data: any): Promise<void> {
  try {
    const updates: { [key: string]: any } = {};
    updates[`${path}/${id}`] = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    await update(ref(db), updates);
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
}

export async function getData(path: string): Promise<any> {
  try {
    const snapshot = await get(ref(db, path));
    return snapshot.val();
  } catch (error) {
    console.error('Error getting data:', error);
    throw error;
  }
}

export async function removeData(path: string): Promise<void> {
  try {
    await remove(ref(db, path));
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
}

export async function queryData(path: string, field: string, value: any): Promise<any> {
  try {
    const queryRef = query(
      ref(db, path),
      orderByChild(field),
      equalTo(value)
    );
    const snapshot = await get(queryRef);
    return snapshot.val();
  } catch (error) {
    console.error('Error querying data:', error);
    throw error;
  }
}