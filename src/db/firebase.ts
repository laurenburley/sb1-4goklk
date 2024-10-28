import { getDatabase, ref, set, get, remove, type Database } from 'firebase/database';
import { app } from '../config/firebase';

const database: Database = getDatabase(app);

export async function setData(path: string, data: any): Promise<boolean> {
  try {
    await set(ref(database, path), data);
    return true;
  } catch (error) {
    console.error('Error setting data:', error);
    throw error;
  }
}

export async function getData(path: string): Promise<any> {
  try {
    const snapshot = await get(ref(database, path));
    return snapshot.val();
  } catch (error) {
    console.error('Error getting data:', error);
    throw error;
  }
}

export async function removeData(path: string): Promise<boolean> {
  try {
    await remove(ref(database, path));
    return true;
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
}

export { database };