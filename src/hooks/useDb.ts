import { useEffect, useState } from 'react';
import { database, connectDb } from '../db';

export function useDb() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function connect() {
      try {
        await connectDb();
        setIsConnected(true);
      } catch (err) {
        setError(err as Error);
      }
    }

    connect();
  }, []);

  return { db: database, isConnected, error };
}