import { betterAuth } from 'better-auth';
import { APIError } from 'better-auth/api';
import { getDb } from './db';
import { profiles } from './db/schema';
import { cities } from './lib-market';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export function getAuth() {
  return betterAuth({
    database: drizzleAdapter(getDb(), { provider: 'pg' }),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: { enabled: true, minPasswordLength: 8, maxPasswordLength: 128 },
    databaseHooks: {
      user: {
        create: {
          before: async (user, context) => {
            const body = context?.body;
            if (!body || body.acceptTerms !== true || !cities.includes(body.city) ||
                !['persona', 'empresa'].includes(body.accountType) ||
                user.name.trim().length < 2 || user.name.trim().length > 60) {
              throw new APIError('BAD_REQUEST', { message: 'Completa nombre, ciudad, tipo de cuenta y acepta los términos.' });
            }
            return { data: { ...user, name: user.name.trim() } };
          },
          after: async (user, context) => {
            const now = new Date().toISOString();
            await getDb().insert(profiles).values({
              userId: user.id, displayName: user.name,
              city: context?.body?.city, accountType: context?.body?.accountType,
              joinedAt: user.createdAt.toISOString(), updatedAt: now,
            }).onConflictDoNothing();
          },
        },
      },
    },
  });
}
export async function getSessionUser(req: Request) {
  const session = await getAuth().api.getSession({ headers: req.headers });
  return session?.user || null;
}
export async function getUserId(req: Request) { return (await getSessionUser(req))?.id || null; }
