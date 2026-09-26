import { migrate } from 'drizzle-orm/neon-http/migrator';
import {getDb} from '../db';
await migrate(getDb(), { migrationsFolder: './drizzle-neon' });
console.log('Migraciones aplicadas');
