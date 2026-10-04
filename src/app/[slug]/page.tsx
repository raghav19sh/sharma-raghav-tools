import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {getTool,tools} from "@/lib/tools";
import ToolRunner from "@/components/ToolRunner";
import AdSlot from "@/components/AdSlot";

export function generateStaticParams(){return tools.map(t=>({slug:t.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;const t=getTool(slug);if(!t)return{};
 return{title:t.name,description:t.description,keywords:t.name.split(" "),alternates:{canonical:"/"+t.slug},openGraph:{title:t.name,description:t.description,url:"https://tools.sharma-raghav.com/"+t.slug}};
}
export default async function ToolPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const t=getTool(slug);if(!t)notFound();
 const cat=t.category==="image"?"Image tools":t.category==="pdf"?"PDF tools":t.category==="calc"?"Calculators":t.category==="convert"?"Converters":t.category==="text"?"Text & developer":t.category==="utility"?"Utilities":"Career tools";
 const ld={"@context":"https://schema.org","@type":"WebApplication",name:t.name,description:t.description,applicationCategory:"UtilityApplication",operatingSystem:"Any",url:"https://tools.sharma-raghav.com/"+t.slug};
 return <div className="site"><header className="topbar"><div className="container nav"><Link className="brand" href="/"><span className="mark">SR</span><span>Sharma-Raghav Tools</span></Link><nav className="navlinks"><Link href="/">All tools</Link><Link href="/privacy">Privacy</Link><Link href="/contact">Contact</Link></nav></div></header>
 <main className="container"><section className="toolhero"><div className="crumbs"><Link href="/">Home</Link><span>›</span><span>{cat}</span><span>›</span><span>{t.name}</span></div><h1>{t.name}</h1><p>{t.description}</p></section>
 <section className="section" style={{paddingTop:0}}><AdSlot/></section>
 <section className="toolgrid"><ToolRunner tool={t}/><aside className="tips"><div className="card info"><h3>How to use</h3><ol>{t.steps.map(s=><li key={s}>{s}</li>)}</ol></div><div className="card info"><h3>Common use cases</h3><ul>{t.uses.map(s=><li key={s}>{s}</li>)}</ul></div><div className="card info"><h3>Privacy note</h3><p>Browser-first where practical. This site does not keep a permanent file library. Tools using external providers are identified in their interface.</p></div></aside></section>
 <section className="section prose"><h2>About this tool</h2><p>Use the tool above, download or copy the result, and close the page when finished. For financial, identity or other important decisions, verify results against the relevant authoritative source.</p></section></main>
 <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld)}}/>
 <footer className="footer"><div className="container foot"><span>© {new Date().getFullYear()} Sharma-Raghav Tools</span><div className="footlinks"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link></div></div></footer></div>
}