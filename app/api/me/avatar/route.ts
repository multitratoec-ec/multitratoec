import { getUserId } from "../../../../lib-auth";
import { NextRequest,NextResponse } from "next/server";
import {putImage,deleteImage,getImage} from "../../../../lib-storage";
import { getDb } from "../../../../db";
import { profiles } from "../../../../db/schema";
import { eq } from "drizzle-orm";
export const dynamic="force-dynamic";

function validImage(bytes:Uint8Array,type:string){
 if(type==="image/jpeg")return bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff;
 if(type==="image/png")return bytes.slice(0,8).every((n,i)=>n===[137,80,78,71,13,10,26,10][i]);
 if(type==="image/webp")return String.fromCharCode(...bytes.slice(0,4))==="RIFF"&&String.fromCharCode(...bytes.slice(8,12))==="WEBP";
 return false;
}
export async function POST(req:NextRequest){const userId=await getUserId(req);if(!userId)return NextResponse.json({error:"Inicia sesión."},{status:401});try{
 const form=await req.formData(),file=form.get("avatar");if(!(file instanceof File)||file.size>2*1024*1024||file.size<100||!(["image/jpeg","image/png","image/webp"].includes(file.type)))return NextResponse.json({error:"Elige una foto JPG, PNG o WebP de hasta 2 MB."},{status:400});
 const bytes=new Uint8Array(await file.arrayBuffer());if(!validImage(bytes,file.type))return NextResponse.json({error:"El archivo no parece una imagen válida."},{status:400});
 const db=getDb(),old=(await db.select().from(profiles).where(eq(profiles.userId,userId)).limit(1))[0];if(!old)return NextResponse.json({error:"Completa primero tu perfil."},{status:400});
 let key=`avatars/${crypto.randomUUID()}`;key=await putImage(key,bytes,file.type);try{await db.update(profiles).set({avatarKey:key,updatedAt:new Date().toISOString()}).where(eq(profiles.userId,userId));if(old.avatarKey)await deleteImage(old.avatarKey);return NextResponse.json({url:`/api/avatar/${encodeURIComponent(userId)}?v=${Date.now()}`})}catch(e){await deleteImage(key);throw e}
 }catch(e){console.error("avatar upload",e);return NextResponse.json({error:"No se pudo guardar la foto."},{status:503})}}
export async function DELETE(req:NextRequest){const userId=await getUserId(req);if(!userId)return NextResponse.json({error:"Inicia sesión."},{status:401});try{const db=getDb(),old=(await db.select().from(profiles).where(eq(profiles.userId,userId)).limit(1))[0];if(!old)return NextResponse.json({error:"Perfil no encontrado."},{status:404});await db.update(profiles).set({avatarKey:null,updatedAt:new Date().toISOString()}).where(eq(profiles.userId,userId));if(old.avatarKey)await deleteImage(old.avatarKey);return NextResponse.json({ok:true})}catch(e){console.error("avatar delete",e);return NextResponse.json({error:"No se pudo quitar la foto."},{status:503})}}
