import { getUserId } from "../../../lib-auth";
import { NextRequest,NextResponse } from "next/server";
import { getDb } from "../../../db";
import { notifications,profiles } from "../../../db/schema";
import { eq,desc,inArray,and,isNull } from "drizzle-orm";
export const dynamic="force-dynamic";
export async function GET(req:NextRequest){const uid=await getUserId(req);if(!uid)return NextResponse.json({error:"Inicia sesión"},{status:401});try{const db=getDb(),rows=await db.select().from(notifications).where(eq(notifications.recipientId,uid)).orderBy(desc(notifications.id)).limit(50),actors=[...new Set(rows.map(r=>r.actorId))],users=actors.length?await db.select().from(profiles).where(inArray(profiles.userId,actors)):[];return NextResponse.json({notifications:rows.map(r=>({...r,actorName:users.find(u=>u.userId===r.actorId)?.displayName||"Alguien"})),unread:rows.filter(x=>!x.readAt).length})}catch(e){console.error("notifications",e);return NextResponse.json({error:"Notificaciones no disponibles"},{status:503})}}
export async function POST(req:NextRequest){const uid=await getUserId(req);if(!uid)return NextResponse.json({error:"Inicia sesión"},{status:401});try{await getDb().update(notifications).set({readAt:new Date().toISOString()}).where(and(eq(notifications.recipientId,uid),isNull(notifications.readAt)));return NextResponse.json({ok:true})}catch(e){console.error("notification read",e);return NextResponse.json({error:"No se pudo actualizar"},{status:503})}}
