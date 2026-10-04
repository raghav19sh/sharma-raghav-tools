import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {getTool,tools} from "@/lib/tools";
import {getToolSeo} from "@/lib/tool-seo";
import {getGuide} from "@/lib/guides";
import ToolRunner from "@/components/ToolRunner";
import AdSlot from "@/components/AdSlot";
import CyberToolRunner from "@/components/CyberToolRunner";

export function generateStaticParams(){return tools.map(t=>({slug:t.slug}))}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;const t=getTool(slug);if(!t)return{};
 const seo=getToolSeo(t);
 return{title:t.name,description:seo.metaDescription,keywords:seo.keywords,alternates:{canonical:"/"+t.slug},openGraph:{title:t.name,description:seo.metaDescription,url:"https://tools.sharma-raghav.com/"+t.slug}};
}

export default async function ToolPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const t=getTool(slug);if(!t)notFound();
 const seo=getToolSeo(t);
 const cat=t.category==="image"?"Image tools":t.category==="pdf"?"PDF tools":t.category==="calc"?"Calculators":t.category==="convert"?"Converters":t.category==="text"?"Text & developer":t.category==="utility"?"Utilities":t.category==="cyber"?"Cybersecurity tools":"Career tools";
 const appLd={"@context":"https://schema.org","@type":"SoftwareApplication",name:t.name,description:seo.metaDescription,applicationCategory:t.category==="cyber"?"SecurityApplication":t.category==="text"?"DeveloperApplication":t.category==="career"?"BusinessApplication":"UtilitiesApplication",operatingSystem:"Any",url:"https://tools.sharma-raghav.com/"+t.slug,offers:{"@type":"Offer",price:"0",priceCurrency:"USD"}};
 const faqLd={"@context":"https://schema.org","@type":"FAQPage",mainEntity:seo.faqs.map(f=>({"@type":"Question",name:f.q,acceptedAnswer:{"@type":"Answer",text:f.a}}))};
 const related=seo.relatedGuides.map(s=>getGuide(s)).filter(Boolean);
 return <div className="site"><header className="topbar"><div className="container nav"><Link className="brand" href="/"><span className="mark">SR</span><span>Sharma-Raghav Tools</span></Link><nav className="navlinks"><Link href="/#tools">All tools</Link><Link href="/guides">Guides</Link><Link href="/privacy">Privacy</Link><Link href="/contact">Contact</Link></nav></div></header>
 <main className="container"><section className="toolhero"><div className="crumbs"><Link href="/">Home</Link><span>›</span><span>{cat}</span><span>›</span><span>{t.name}</span></div><h1>{t.name}</h1><p>{seo.intro}</p></section>
 <section className="section" style={{paddingTop:0}}><AdSlot/></section>
 <section className="toolgrid">{t.kind==="cyber"?<CyberToolRunner tool={t}/>:<ToolRunner tool={t}/>}<aside className="tips"><div className="card info"><h3>How to use</h3><ol>{t.steps.map(s=><li key={s}>{s}</li>)}</ol></div><div className="card info"><h3>Common use cases</h3><ul>{t.uses.map(s=><li key={s}>{s}</li>)}</ul></div><div className="card info"><h3>Privacy note</h3><p>Browser-first where practical. This site does not keep a permanent file library. Tools using external providers are identified in their interface.</p></div></aside></section>
 <section className="section prose toolcontent"><h2>About {t.name}</h2><p>{seo.intro}</p>{seo.sections.map(s=><section key={s.heading}><h2>{s.heading}</h2><p>{s.body}</p></section>)}
  <section><h2>Frequently asked questions</h2><div className="faq">{seo.faqs.map(f=><details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div></section>
  {related.length>0?<section><h2>Related guides</h2><div className="list guide-tools">{related.map(g=><Link className="card tool" href={"/guides/"+g!.slug} key={g!.slug}><div><h3>{g!.title}</h3><p>{g!.description}</p></div><span className="arrow">→</span></Link>)}</div></section>:null}
 </section></main>
 <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(appLd)}}/>
 <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqLd)}}/>
 <footer className="footer"><div className="container foot"><span>© {new Date().getFullYear()} Sharma-Raghav Tools</span><div className="footlinks"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link></div></div></footer></div>
}
