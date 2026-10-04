import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {getGuide,guides} from "@/lib/guides";
import {getTool} from "@/lib/tools";

export function generateStaticParams(){return guides.map(g=>({slug:g.slug}))}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;const g=getGuide(slug);if(!g)return{};
 return{title:g.title,description:g.description,alternates:{canonical:"/guides/"+g.slug},openGraph:{type:"article",title:g.title,description:g.description,url:"https://tools.sharma-raghav.com/guides/"+g.slug}};
}

export default async function GuidePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const g=getGuide(slug);if(!g)notFound();
 const articleLd={"@context":"https://schema.org","@type":"Article",headline:g.title,description:g.description,author:{"@type":"Person",name:"Raghav Sharma"},publisher:{"@type":"Organization",name:"Sharma-Raghav Tools"},mainEntityOfPage:"https://tools.sharma-raghav.com/guides/"+g.slug};
 return <div className="site">
  <header className="topbar"><div className="container nav"><Link className="brand" href="/"><span className="mark">SR</span><span>Sharma-Raghav Tools</span></Link><nav className="navlinks"><Link href="/#tools">All tools</Link><Link href="/guides">Guides</Link><Link href="/privacy">Privacy</Link></nav></div></header>
  <main className="container guidepage">
   <div className="crumbs"><Link href="/">Home</Link><span>›</span><Link href="/guides">Guides</Link><span>›</span><span>{g.title}</span></div>
   <article className="guidearticle">
    <span className="eyebrow">Practical guide</span>
    <h1>{g.title}</h1>
    <p className="lead">{g.description}</p>
    <p className="byline">Written for Sharma-Raghav Tools by Raghav Sharma.</p>
    <p>{g.intro}</p>
    {g.sections.map(s=><section key={s.heading}><h2>{s.heading}</h2><p>{s.body}</p></section>)}
    <section><h2>Use the related tools</h2><div className="list guide-tools">{g.toolSlugs.map(slug=>{const t=getTool(slug);return t?<Link className="card tool" key={slug} href={"/"+slug}><div className="toolmain"><div><h3>{t.name}</h3><p>{t.short}</p></div></div><span className="arrow">→</span></Link>:null})}</div></section>
   </article>
  </main>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(articleLd)}}/>
  <footer className="footer"><div className="container foot"><span>© {new Date().getFullYear()} Sharma-Raghav Tools</span><div className="footlinks"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link></div></div></footer>
 </div>
}
