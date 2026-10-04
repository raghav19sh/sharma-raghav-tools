"use client";
import {useEffect} from "react";
declare global{interface Window{adsbygoogle?:unknown[]}}
export default function AdSlot(){
 const client=process.env.NEXT_PUBLIC_ADSENSE_CLIENT,slot=process.env.NEXT_PUBLIC_ADSENSE_SLOT;
 useEffect(()=>{if(client&&slot)try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch{}},[client,slot]);
 if(!client||!slot)return <div className="ad">ADVERTISEMENT</div>;
 return <div className="ad"><ins className="adsbygoogle" style={{display:"block",width:"100%"}} data-ad-client={client} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true"/></div>;
}