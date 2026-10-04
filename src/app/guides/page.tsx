import type {Metadata} from "next";
import Link from "next/link";
import {guides} from "@/lib/guides";

export const metadata:Metadata={
 title:"Practical Guides",
 description:"Practical guides for image compression, PDF conversion, scanned PDFs, PDF editing and ATS resumes.",
 alternates:{canonical:"/guides"},
 openGraph:{title:"Practical Guides | Sharma-Raghav Tools",description:"Practical guides for common image, PDF and resume tasks.",url:"https://tools.sharma-raghav.com/guides"}
};

export default function Guides(){
 return <div className="site">
  <header className="topbar"><div className="container nav"><Link className="brand" href="/"><span className="mark">SR</span><span>Sharma-Raghav Tools</span></Link><nav className="navlinks"><Link href="/">All tools</Link><Link href="/privacy">Privacy</Link><Link href="/contact">Contact</Link></nav></div></header>
  <main className="container guidepage"><div className="crumbs"><Link href="/">Home</Link><span>›</span><span>Guides</span></div><section className="toolhero"><span className="eyebrow">Practical guides</span><h1>Helpful answers for common file tasks.</h1><p>Step-by-step guidance for compressing images, converting PDFs, creating scanned documents, editing PDFs and improving resumes. Each guide links directly to the relevant Sharma-Raghav tool.</p></section>
  <section className="grid3">{guides.map(g=><Link className="card cat" key={g.slug} href={"/guides/"+g.slug}><span className="eyebrow">Guide</span><h2>{g.title}</h2><p>{g.description}</p><span className="count">Read guide →</span></Link>)}</section></main>
  <footer className="footer"><div className="container foot"><span>© {new Date().getFullYear()} Sharma-Raghav Tools</span><div className="footlinks"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link></div></div></footer>
 </div>
}