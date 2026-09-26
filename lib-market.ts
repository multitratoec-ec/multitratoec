export const categories: Record<string,string[]> = {
 Productos:["Vehículos","Materiales para reformas de casa","Productos de mascotas","Electrodomésticos","Tecnología","Artículos deportivos","Artículos para el hogar","Herramientas","Otros"],
 Servicios:["Servicio técnico","Mantenimiento","Construcción","Limpieza","Cuidado de mascotas","Otros"],
 Alquileres:["Maquinaria","Herramientas","Inmuebles","Vehículos","Artículos para el hogar","Otros"],
};
export const cities=["Guayaquil","Quito","Cuenca","Samborondón","Durán","Otra ciudad"];
export const units=["precio","desde","por día","por hora","por servicio"];
export function cleanText(value:unknown,max=200){return typeof value==="string"?value.trim().slice(0,max):""}
export function validPhone(value:string){return /^09\d{8}$/.test(value)}
export function finiteCoord(value:unknown,limit:number){if(value===null||value===undefined||value==="")return null;const n=Number(value);return Number.isFinite(n)&&Math.abs(n)<=limit?Math.round(n*100)/100:null}
