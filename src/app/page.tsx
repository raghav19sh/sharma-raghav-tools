import Link from "next/link";
import {ArrowRight,Braces,Calculator,FileImage,FileText,RefreshCw,ShieldCheck,Sparkles} from "lucide-react";
import {categories,tools} from "@/lib/tools";
import AdSlot from "@/components/AdSlot";

const Icon=({id}:{id:string})=>id==="image"?<FileImage size={19}/>:id==="pdf"?<FileText size={19}/>:id==="calc"?<Calculator size={19}/>:id==="convert"?<RefreshCw size={19}/>:id==="text"?<Braces size={19}/>:<Sparkles size={19}/>;

export default function Home(){
 const popular=["compress-image","merge-pdf","pdf-to-word","pdf-to-docs","word-to-pdf","edit-pdf","scan-pdf","scan-image","ats-resume-score","emi-calculator","json-formatter","qr-generator","password-generator","extract-text-image"].map(s=>tools.find(t=>t.slug===s)!).filter(Boolean);
 return <div className="site">
  <header className="topbar"><div className="container nav"><Link className="brand" href="/"><span className="mark">SR</span><span>Sharma-Raghav Tools</span></Link><nav className="navlinks"><Link href="#tools">All tools</Link><Link href="/privacy">Privacy</Link><Link href="/contact">Contact</Link></nav></div></header>
  <main>
   <section className="hero container"><span className="eyebrow"><Sparkles size={13}/> Browser-first utility toolkit</span><h1>Useful tools.<br/>No clutter.</h1><p>Fast, focused tools for images, PDFs, calculations, conversions, text and everyday tasks. No account required, with browser-first processing whenever practical.</p><div className="actions"><a className="btn primary" href="#tools">Explore tools <ArrowRight size={16}/></a><Link className="btn" href="/privacy"><ShieldCheck size={16}/> Privacy first</Link></div><div className="trust"><span>• No account</span><span>• Most file tools process locally in your browser</span><span>• No permanent file library</span></div></section>
   <section className="section container"><AdSlot/></section>
   <section className="section container" id="tools"><div className="sectionhead"><div><h2>Browse by category</h2><p>Open a dedicated page for any task.</p></div></div><div className="grid3">
    {categories.map(c=><Link className="card cat" key={c.id} href={"#"+c.id}><span className="caticon"><Icon id={c.id}/></span><h3>{c.name}</h3><p>{c.description}</p><span className="count">{tools.filter(t=>t.category===c.id).length} tools →</span></Link>)}
   </div></section>
   <section className="section container"><div className="sectionhead"><div><h2>Popular tools</h2><p>Common jobs, one click away.</p></div></div><div className="list">
    {popular.map(t=><Link className="card tool" href={"/"+t.slug} key={t.slug}><div className="toolmain"><span className="toolicon"><Icon id={t.category}/></span><div><h3>{t.name}</h3><p>{t.short}</p></div></div><ArrowRight className="arrow" size={17}/></Link>)}
   </div></section>
   {categories.map(c=><section className="section container" id={c.id} key={c.id}><div className="sectionhead"><div><h2>{c.name}</h2><p>{c.description}</p></div></div><div className="list">{tools.filter(t=>t.category===c.id).map(t=><Link className="card tool" href={"/"+t.slug} key={t.slug}><div className="toolmain"><span className="toolicon"><Icon id={c.id}/></span><div><h3>{t.name}</h3><p>{t.short}</p></div></div><ArrowRight className="arrow" size={17}/></Link>)}</div></section>)}
  </main>
  <footer className="footer"><div className="container foot"><span>© {new Date().getFullYear()} Sharma-Raghav Tools</span><div className="footlinks"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link></div></div></footer>
 </div>
}