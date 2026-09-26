import { getUserId } from "../../../../lib-auth";
import { NextRequest,NextResponse } from "next/server";
import { getDb } from "../../../../db";
import { savedSearches } from "../../../../db/schema";
import { eq,and } from "drizzle-orm";
export const dynamic="force-dynamic";
export async function DELETE(req:NextRequest,{params}:{params:Promise<{id:string}>}){const uid=await getUserId(req),id=Number((await params).id);if(!uid)return NextResponse.json({error:"Inicia sesión"},{status:401});if(!Number.isSafeInteger(id))return NextResponse.json({error:"Búsqueda inválida"},{status:400});try{await getDb().delete(savedSearches).where(and(eq(savedSearches.id,id),eq(savedSearches.userId,uid)));return NextResponse.json({ok:true})}catch(e){console.error("saved search delete",e);return NextResponse.json({error:"No se pudo quitar"},{status:503})}}
