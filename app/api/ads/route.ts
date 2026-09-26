import { getUserId } from "../../../lib-auth";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../db";
import { ads, photos, profiles, reviews, savedSearches, notifications } from "../../../db/schema";
import { desc, eq, inArray, isNull } from "drizzle-orm";
import { categories,cities,units,cleanText,validPhone,finiteCoord } from "../../../lib-market";
import { matches } from "../../../lib-discovery";
export const dynamic="force-dynamic";
export async function GET(){try{
 const db=getDb();const rows=await db.select().from(ads).where(isNull(ads.hiddenAt)).orderBy(desc(ads.createdAt)).limit(150);
 const ids=rows.map(x=>x.id),owners=[...new Set(rows.map(x=>x.owner))];
 const allPhotos=ids.length?await db.select().from(photos).where(inArray(photos.adId,ids)):[];
 const allProfiles=owners.length?await db.select().from(profiles).where(inArray(profiles.userId,owners)):[];
 const allReviews=owners.length?await db.select().from(reviews).where(inArray(reviews.subjectId,owners)):[];
 return NextResponse.json({ads:rows.map(({owner,createdAt,...ad})=>({ ...ad,ownerId:owner,createdAt,photos:allPhotos.filter(p=>p.adId===ad.id).map(p=>`/api/photos/${p.id}`),seller:allProfiles.find(p=>p.userId===owner)?.displayName||"Anunciante",verifiedCompany:!!allProfiles.find(p=>p.userId===owner&&p.accountType==="empresa"&&p.verifiedAt),rating:(()=>{const r=allReviews.filter(x=>x.subjectId===owner);return r.length?Math.round(r.reduce((sum,x)=>sum+x.stars,0)/r.length*10)/10:null})()}))})
 }catch(e){console.error("ads read",e);return NextResponse.json({error:"Anuncios no disponibles"},{status:503})}}
export async function POST(req:NextRequest){
 const owner=await getUserId(req);if(!owner)return NextResponse.json({error:"Inicia sesión para publicar."},{status:401});
 let body:Record<string,unknown>;try{body=await req.json()}catch{return NextResponse.json({error:"Datos inválidos."},{status:400})}
 const kind=cleanText(body.kind),title=cleanText(body.title,91),category=cleanText(body.category),city=cleanText(body.city),unit=cleanText(body.unit),description=cleanText(body.description,1501),contact=cleanText(body.contact),price=Number(body.price),condition=cleanText(body.condition)||"no_aplica";
 if(!categories[kind]?.includes(category)||!cities.includes(city)||!units.includes(unit)||title.length<8||title.length>90||description.length<20||description.length>1500||!validPhone(contact)||!Number.isFinite(price)||price<0||price>1000000||!(kind==="Productos"?["nuevo","usado"].includes(condition):condition==="no_aplica"))return NextResponse.json({error:"Revisa los datos del anuncio."},{status:400});
 const latitude=finiteCoord(body.latitude,90),longitude=finiteCoord(body.longitude,180),reachKm=Number(body.reachKm??30);
 if((latitude===null)!==(longitude===null)||!Number.isInteger(reachKm)||reachKm<2||reachKm>100)return NextResponse.json({error:"Ubicación inválida."},{status:400});
 try{const db=getDb(),now=new Date().toISOString();const [row]=await db.insert(ads).values({owner,kind,title,category,city,unit,description,contact,price,latitude,longitude,reachKm,condition,createdAt:now}).returning({id:ads.id});
  try{const rules=await db.select().from(savedSearches).limit(500);const ratings=await db.select({stars:reviews.stars}).from(reviews).where(eq(reviews.subjectId,owner));const rating=ratings.length?Math.round(ratings.reduce((n,r)=>n+r.stars,0)/ratings.length*10)/10:null;const recipients=[...new Set(rules.filter(s=>s.userId!==owner&&matches({title,description,kind,category,city,price,condition,latitude,longitude,reachKm,rating},s)).map(s=>s.userId))];for(const recipientId of recipients)await db.insert(notifications).values({recipientId,type:"alerta",actorId:owner,adId:row.id,createdAt:now})}catch(e){console.error("saved search alerts",e)}
  return NextResponse.json({id:row.id},{status:201})}catch(e){console.error("ads write",e);return NextResponse.json({error:"No se pudo guardar el anuncio."},{status:503})}
}
