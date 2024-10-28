import { ref, get, set, update, remove } from 'firebase/database';
import { db } from '../../config/firebase';
import { Experiment } from '../../types/researchDevelopment';

export async function getAllExperiments(): Promise<Experiment[]> {
  try {
    const snapshot = await get(ref(db, 'experiments'));
    if (!snapshot.exists()) return [];
    return Object.values(snapshot.val());
  } catch (error) {
    console.error('Error fetching experiments:', error);
    throw error;
  }
}

export async function getExperimentById(id: string): Promise<Experiment | null> {
  try {
    const snapshot = await get(ref(db, `experiments/${id}`));
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error fetching experiment:', error);
    throw error;
  }
}

export async function createExperiment(experiment: Omit<Experiment, 'id'>): Promise<Experiment> {
  try {
    const id = crypto.randomUUID();
    const newExperiment = {
      ...experiment,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await set(ref(db, `experiments/${id}`), newExperiment);
    return newExperiment;
  } catch (error) {
    console.error('Error creating experiment:', error);
    throw error;
  }
}

export async function updateExperiment(id: string, experiment: Partial<Experiment>): Promise<Experiment> {
  try {
    const updates = {
      ...experiment,
      updatedAt: new Date().toISOString(),
    };

    await update(ref(db, `experiments/${id}`), updates);
    const updated = await getExperimentById(id);
    if (!updated) throw new Error('Failed to update experiment');
    return updated;
  } catch (error) {
    console.error('Error updating experiment:', error);
    throw error;
  }
}

export async function deleteExperiment(id: string): Promise<void> {
  try {
    await remove(ref(db, `experiments/${id}`));
  } catch (error) {
    console.error('Error deleting experiment:', error);
    throw error;
  }
}

// Batch operations
export async function updateExperimentBatch(updates: Partial<Experiment>[]): Promise<void> {
  try {
    const batchUpdates: { [key: string]: any } = {};
    updates.forEach(update => {
      if (!update.id) throw new Error('Missing experiment ID for batch update');
      batchUpdates[`experiments/${update.id}`] = {
        ...update,
        updatedAt: new Date().toISOString(),
      };
    });

    await update(ref(db), batchUpdates);
  } catch (error) {
    console.error('Error updating experiment batch:', error);
    throw error;
  }
}