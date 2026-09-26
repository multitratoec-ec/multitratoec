import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

let db: ReturnType<typeof drizzle<typeof schema>> | undefined;
export function getDb() {
  if (!db) {
    const url = process.env.DATABASE_URL || process.env["almacenamientomultitrato_DATABASE_URL"];
    if (!url) throw new Error('DATABASE_URL is required');
    db = drizzle(neon(url), { schema });
  }
  return db;
}
