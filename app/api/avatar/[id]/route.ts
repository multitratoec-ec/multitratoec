import { NextResponse } from "next/server";
import {putImage,deleteImage,getImage} from "../../../../lib-storage";
import { getDb } from "../../../../db";
import { profiles } from "../../../../db/schema";
import { eq } from "drizzle-orm";
export const dynamic="force-dynamic";
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;try{const profile=(await getDb().select({key:profiles.avatarKey}).from(profiles).where(eq(profiles.userId,id)).limit(1))[0];if(!profile?.key)return new Response("Not found",{status:404});const object=await getImage(profile.key);if(!object)return new Response("Not found",{status:404});return new Response(object.body,{headers:{"Content-Type":object.headers.get("Content-Type")||"image/jpeg","Cache-Control":"public, max-age=300","X-Content-Type-Options":"nosniff"}})}catch(e){console.error("avatar get",e);return NextResponse.json({error:"Foto no disponible"},{status:503})}}
