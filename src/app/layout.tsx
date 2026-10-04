import type {Metadata} from "next";
import Script from "next/script";
import "./globals.css";

const site="https://tools.sharma-raghav.com";
export const metadata:Metadata={
  metadataBase:new URL(site),
  title:{default:"Sharma-Raghav Tools — Free Online Tools",template:"%s | Sharma-Raghav Tools"},
  description:"Free browser-first tools for images, PDFs, calculations, conversions, text and everyday utilities.",
  keywords:["online tools","free tools","image compressor","PDF tools","calculators","JSON formatter","QR generator"],
  alternates:{canonical:"/"},
  robots:{index:true,follow:true},
  openGraph:{type:"website",url:site,title:"Sharma-Raghav Tools",description:"Useful tools. No clutter."}
};
export default function RootLayout({children}:{children:React.ReactNode}){
  const client=process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return <html lang="en"><body>
    {client?<Script async strategy="afterInteractive" src={"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="+encodeURIComponent(client)} crossOrigin="anonymous"/>:null}
    {children}
  </body></html>;
}