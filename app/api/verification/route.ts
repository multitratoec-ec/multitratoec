import { getUserId } from "../../../lib-auth";
import { NextRequest,NextResponse } from "next/server";
import { getDb } from "../../../db";
import { profiles } from "../../../db/schema";
import { eq } from "drizzle-orm";
export const dynamic="force-dynamic";
export async function POST(req:NextRequest){const uid=await getUserId(req);if(!uid)return NextResponse.json({error:"Inicia sesión"},{status:401});try{const db=getDb(),p=(await db.select().from(profiles).where(eq(profiles.userId,uid)).limit(1))[0];if(!p||p.accountType!=="empresa")return NextResponse.json({error:"Completa un perfil de empresa para solicitar revisión"},{status:400});if(p.verifiedAt)return NextResponse.json({error:"Tu empresa ya está verificada"},{status:400});await db.update(profiles).set({verificationRequestedAt:new Date().toISOString()}).where(eq(profiles.userId,uid));return NextResponse.json({ok:true})}catch(e){console.error("verification request",e);return NextResponse.json({error:"No se pudo solicitar la revisión"},{status:503})}}
