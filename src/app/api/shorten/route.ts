import {NextResponse} from "next/server";
export async function POST(req:Request){
 try{
  const body=await req.json(),url=typeof body?.url==="string"?body.url.trim():"";
  const u=new URL(url);if(!["http:","https:"].includes(u.protocol))throw Error();
  const api=new URL("https://is.gd/create.php");api.searchParams.set("format","simple");api.searchParams.set("url",u.toString());
  const r=await fetch(api,{cache:"no-store",headers:{"User-Agent":"Sharma-Raghav-Tools/1.0"}}),x=(await r.text()).trim();
  if(!r.ok||!x.startsWith("http"))return NextResponse.json({error:x||"Shortening service failed."},{status:502});
  return NextResponse.json({shortUrl:x});
 }catch{return NextResponse.json({error:"Enter a valid http or https URL."},{status:400})}
}