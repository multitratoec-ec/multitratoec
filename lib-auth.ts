import { betterAuth } from 'better-auth';
import { getDb } from './db';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';


export function getAuth() {
  return betterAuth({
    database:drizzleAdapter(getDb(),{provider:'pg'}),
    secret:process.env.BETTER_AUTH_SECRET,
    baseURL:process.env.BETTER_AUTH_URL,
    emailAndPassword: { enabled: true },
  });
}
export async function getSessionUser(req:Request) {
  const session=await getAuth().api.getSession({headers:req.headers});
  return session?.user || null;
}
export async function getUserId(req:Request) {return (await getSessionUser(req))?.id||null;}
