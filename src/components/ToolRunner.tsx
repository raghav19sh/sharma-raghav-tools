"use client";
import {useState} from "react";
import type {Tool} from "@/lib/tools";
import {calculate,convert} from "@/lib/calculators";
import {runText} from "@/lib/text-tools";
import {runImage,saveBlob} from "@/lib/image-tools";
import {runPdf} from "@/lib/pdf-tools";
import {zoned,qrCode,strongPassword,ocr} from "@/lib/utility-tools";

const stem=(name:string)=>name.replace(/\.[^/.]+$/,"");
const withSourceName=(source:string,output:string)=>{const dot=output.lastIndexOf(".");if(dot<0)return stem(source)+"-"+output;return stem(source)+"-"+output.slice(0,dot)+output.slice(dot);};
const saveText=(value:string,name:string)=>saveBlob(new Blob([value],{type:"text/plain;charset=utf-8"}),name);
const pause=(ms:number)=>new Promise<void>(resolve=>window.setTimeout(resolve,ms));

export default function ToolRunner({tool}:{tool:Tool}){
 const [file,setFile]=useState<File|null>(null),[files,setFiles]=useState<File[]>([]);
 const [a,setA]=useState(""),[b,setB]=useState(""),[c,setC]=useState(""),[page,setPage]=useState("1");
 const [mode,setMode]=useState("pretty"),[people,setPeople]=useState("5"),[from,setFrom]=useState("Asia/Kolkata"),[to,setTo]=useState("Europe/Paris");
 const [dt,setDt]=useState("2026-10-04T18:00"),[len,setLen]=useState("20"),[symbols,setSymbols]=useState(true);
 const [status,setStatus]=useState(""),[error,setError]=useState(""),[result,setResult]=useState(""),[short,setShort]=useState(""),[qr,setQr]=useState("");
 const field=(label:string,value:string,set:(v:string)=>void,type="text",placeholder="")=><div className="field"><label>{label}</label><input type={type} value={value} onChange={e=>set(e.target.value)} placeholder={placeholder}/></div>;
 const needFile=tool.kind==="image"||tool.kind==="ocr",needPdf=tool.kind==="pdf";
 const run=async()=>{
  setStatus("Working…");setError("");setResult("");setShort("");setQr("");
  try{
   if(tool.kind==="ocr"){
   const selected=files.length?files:(file?[file]:[]);
   if(!selected.length)throw Error("Choose at least one image first.");
   const outputs:string[]=[];
   for(let i=0;i<selected.length;i++){
    const f=selected[i];
    setStatus(selected.length>1?"Processing "+(i+1)+"/"+selected.length+"…":"Working…");
    const text=await ocr(f);
    outputs.push(f.name+":\n"+(text||"No readable text detected."));
    saveText(text||"No readable text detected.",withSourceName(f.name,"ocr.txt"));
    if(i<selected.length-1)await pause(100);
   }
   setResult(selected.length===1?outputs[0]:"Processed "+selected.length+" images. OCR text was downloaded for each file.\n\n"+outputs.join("\n\n---\n\n"));
  }
   else if(needFile){
   const selected=files.length?files:(file?[file]:[]);
   if(!selected.length)throw Error("Choose at least one file first.");
   const outputs:string[]=[];
   for(let i=0;i<selected.length;i++){
    const f=selected[i];
    setStatus(selected.length>1?"Processing "+(i+1)+"/"+selected.length+"…":"Working…");
    const x=await runImage(tool.slug,f,b,b,c,tool.slug==="signature-image"?c:page);
    saveBlob(x.blob,withSourceName(f.name,x.name));
    outputs.push(f.name+": "+x.message);
    if(i<selected.length-1)await pause(100);
   }
   setResult(selected.length===1?outputs[0]:"Processed "+selected.length+" images and downloaded "+selected.length+" results.\n\n"+outputs.join("\n"));
  }
   else if(needPdf){
   const selected=files.length?files:(file?[file]:[]);
   if(!selected.length)throw Error("Choose at least one file first.");
   if(tool.slug==="merge-pdf"||tool.slug==="screenshot-to-pdf"||tool.slug==="images-to-pdf"){
    setStatus("Processing "+selected.length+" files…");
    const x=await runPdf(tool.slug,selected,page);
    saveBlob(x.blob,x.name);
    setResult(x.message);
   }else{
    const outputs:string[]=[];
    for(let i=0;i<selected.length;i++){
     const f=selected[i];
     setStatus(selected.length>1?"Processing "+(i+1)+"/"+selected.length+"…":"Working…");
     const x=await runPdf(tool.slug,[f],page);
     saveBlob(x.blob,withSourceName(f.name,x.name));
     outputs.push(f.name+": "+x.message);
     if(i<selected.length-1)await pause(100);
    }
    setResult(selected.length===1?outputs[0]:"Processed "+selected.length+" files and downloaded "+selected.length+" results.\n\n"+outputs.join("\n"));
   }
  }
   else if(tool.kind==="calc")setResult(calculate(tool.slug,a,b,c,people))
   else if(tool.kind==="convert")setResult(convert(tool.slug,a,mode))
   else if(tool.kind==="timezone")setResult(new Intl.DateTimeFormat("en-GB",{timeZone:to,dateStyle:"full",timeStyle:"long"}).format(zoned(dt,from)))
   else if(tool.kind==="text")setResult(runText(tool.slug,a,b,mode))
   else if(tool.kind==="url"){const r=await fetch("/api/shorten",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:a})}),j=await r.json();if(!r.ok)throw Error(j.error||"Could not shorten URL.");setShort(j.shortUrl);setResult(j.shortUrl)}
   else if(tool.kind==="qr"){setQr(await qrCode(a));setResult("QR code generated.")}
   else if(tool.kind==="password")setResult(strongPassword(Number(len),symbols))
   else setResult(await ocr(file as File));
   setStatus("Done");
  }catch(e){setStatus("");setError(e instanceof Error?e.message:"Something went wrong.")}
 };
 return <div className="card runner">
  <div className="runnerhead"><div><h2>Use {tool.name}</h2><div className="sub">No account required. Browser-first where practical.</div></div><span className="pill">{tool.category.toUpperCase()}</span></div>
  {(needFile||needPdf)&&<div className="upload"><label htmlFor="tool-input" className="btn">{tool.slug==="word-to-pdf"?"Choose Word file(s)":needPdf?"Choose PDF file(s)":"Choose image file(s)"}</label><input id="tool-input" type="file" accept={tool.slug==="word-to-pdf"?".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document":tool.slug==="heic-to-jpg"?".heic,.heif":tool.slug==="screenshot-to-pdf"||tool.slug==="images-to-pdf"?"image/png,image/jpeg,image/webp":needPdf?".pdf":"image/*"} multiple={batchable} onChange={e=>{const x=Array.from(e.target.files||[]);setFile(x[0]||null);setFiles(x)}}/><div className="meta">{files.length?(files.length+" file"+(files.length===1?"":"s")+" selected: "+files.map(x=>x.name).join(" • ")):file?.name||"Select one or more files"}</div></div>}{batchable&&<div className="sub">Select multiple files to process them in one run.</div>}
  {tool.slug==="compress-image"&&<div className="form">{field("Target size (KB)",b,setB,"number","100")}<div className="presets"><button type="button" className="btn" onClick={()=>setB("100")}>100 KB</button><button type="button" className="btn" onClick={()=>setB("500")}>500 KB</button><button type="button" className="btn" onClick={()=>setB("1000")}>1 MB</button></div></div>}
  {tool.slug==="resize-image"&&<div className="form">{field("Width (px)",b,setB,"number","800")}{field("Height (px)",c,setC,"number","800")}</div>}
  {tool.slug==="photo-smaller"&&<div className="form">{field("Maximum dimension (px)",b,setB,"number","1200")}</div>}
  {tool.slug==="signature-image"&&<div className="form">{field("Cleanup threshold",c,setC,"number","235")}</div>}
  {tool.slug==="extract-pdf-page"&&<div className="form">{field("Page number",page,setPage,"number","1")}</div>}
  {tool.kind==="calc"&&<div className="form">
   {tool.slug==="days-between-dates"&&<>{field("Start date",a,setA,"date")}{field("End date",b,setB,"date")}</>}
   {tool.slug==="day-of-date"&&field("Date",a,setA,"date")}
   {tool.slug==="percentage-increase"&&<>{field("Old value",a,setA,"number")}{field("New value",b,setB,"number")}</>}
   {tool.slug==="discount-calculator"&&<>{field("Original price",a,setA,"number")}{field("Discount %",b,setB,"number","10")}</>}
   {tool.slug==="emi-calculator"&&<>{field("Principal (₹)",a,setA,"number")}{field("Annual interest %",b,setB,"number")}{field("Tenure (years)",c,setC,"number")}</>}
   {tool.slug==="age-calculator"&&<>{field("Date of birth",a,setA,"date")}{field("Calculate at",b,setB,"date")}</>}
   {tool.slug==="cgpa-to-percentage"&&<>{field("CGPA",a,setA,"number","8.2")}{field("Multiplier",b,setB,"number","9.5")}</>}
   {tool.slug==="split-bill"&&<>{field("Total bill",a,setA,"number")}{field("People",people,setPeople,"number","5")}</>}
   {tool.slug==="tip-calculator"&&<>{field("Bill",a,setA,"number")}{field("Tip %",b,setB,"number","10")}</>}
   {tool.slug==="fuel-cost"&&<>{field("Distance (km)",a,setA,"number")}{field("Mileage (km/L)",b,setB,"number")}{field("Fuel price / L",c,setC,"number")}</>}
   {tool.slug==="salary-after-tax"&&<>{field("Annual salary",a,setA,"number")}{field("Flat tax %",b,setB,"number","20")}</>}
   {tool.slug==="sip-calculator"&&<>{field("Monthly SIP",a,setA,"number")}{field("Return %",b,setB,"number")}{field("Years",c,setC,"number")}</>}
  </div>}
  {tool.kind==="convert"&&<div className="form">{field("Value",a,setA,"number")}<div className="field"><label>Direction</label><select value={mode} onChange={e=>setMode(e.target.value)}>
   {tool.slug==="celsius-to-fahrenheit"&&<><option value="c2f">Celsius → Fahrenheit</option><option value="f2c">Fahrenheit → Celsius</option></>}
   {tool.slug==="kg-to-pounds"&&<><option value="kg2lb">kg → lb</option><option value="lb2kg">lb → kg</option></>}
   {tool.slug==="feet-to-cm"&&<><option value="ft2cm">feet → cm</option><option value="cm2ft">cm → feet</option></>}
   {tool.slug==="mb-to-gb"&&<><option value="decimal">Decimal</option><option value="binary">Binary</option></>}
  </select></div></div>}
  {tool.kind==="timezone"&&<div className="form">{field("Date & time",dt,setDt,"datetime-local")}<div className="field"><label>From</label><select value={from} onChange={e=>setFrom(e.target.value)}><option>Asia/Kolkata</option><option>Europe/Paris</option><option>Europe/London</option><option>America/New_York</option><option>America/Los_Angeles</option><option>Asia/Tokyo</option><option>Asia/Singapore</option><option>Australia/Sydney</option><option>UTC</option></select></div><div className="field"><label>To</label><select value={to} onChange={e=>setTo(e.target.value)}><option>Europe/Paris</option><option>Asia/Kolkata</option><option>Europe/London</option><option>America/New_York</option><option>America/Los_Angeles</option><option>Asia/Tokyo</option><option>Asia/Singapore</option><option>Australia/Sydney</option><option>UTC</option></select></div></div>}
  {tool.kind==="text"&&<div className="form"><div className="field full"><label>{tool.slug==="compare-text"?"Text A":"Text"}</label><textarea value={a} onChange={e=>setA(e.target.value)} placeholder="Paste text here…"/></div>{tool.slug==="compare-text"&&<div className="field full"><label>Text B</label><textarea value={b} onChange={e=>setB(e.target.value)} placeholder="Paste second version…"/></div>}{tool.slug==="json-formatter"&&<div className="field"><label>Mode</label><select value={mode} onChange={e=>setMode(e.target.value)}><option value="pretty">Pretty</option><option value="minify">Minify</option></select></div>}{tool.slug==="remove-spaces"&&<div className="field"><label>Mode</label><select value={mode} onChange={e=>setMode(e.target.value)}><option value="spaces">Spaces / tabs</option><option value="all">All whitespace</option></select></div>}</div>}
  {tool.kind==="url"&&<div className="form">{field("Long URL",a,setA,"url","https://example.com/long-link")}</div>}
  {tool.kind==="qr"&&<div className="form">{field("Text or URL",a,setA,"text","https://example.com")}</div>}
  {tool.kind==="password"&&<div className="form">{field("Length",len,setLen,"number","20")}<div className="field"><label>Symbols</label><select value={symbols?"yes":"no"} onChange={e=>setSymbols(e.target.value==="yes")}><option value="yes">Include symbols</option><option value="no">Letters + numbers</option></select></div></div>}
  <div className="runactions"><button className="btn primary" onClick={()=>void run()}>{status||"Run tool"}</button>{(result||qr||error)&&<button className="btn" onClick={()=>{setStatus("");setError("");setResult("");setShort("");setQr("")}}>Clear</button>}</div>
  {error&&<div className="error">{error}</div>}
  {result&&<div className="result"><div className="resultlabel">Result</div><div className="resultvalue">{result.includes("\n")?<pre>{result}</pre>:result}</div></div>}
  {short&&<div className="result"><div className="resultlabel">Short URL</div><div className="resultvalue"><a href={short} target="_blank" rel="noreferrer">{short}</a></div></div>}
  {qr&&<div className="result"><div className="resultlabel">QR preview</div><img className="preview" src={qr} alt="Generated QR code"/><div className="runactions"><button className="btn" onClick={()=>{const x=document.createElement("a");x.href=qr;x.download="qr-code.png";x.click()}}>Download PNG</button></div></div>}
 </div>
}