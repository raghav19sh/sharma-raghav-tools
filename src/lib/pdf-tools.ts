import {readImage,toBlob} from "./image-tools";

const pdfBlob=(x:Uint8Array)=>new Blob([x as unknown as BlobPart],{type:"application/pdf"});
const textBlob=(x:string)=>new Blob([x],{type:"text/plain;charset=utf-8"});

const withTimeout=<T>(promise:Promise<T>,ms:number,message:string)=>new Promise<T>((resolve,reject)=>{
 let timer=window.setTimeout(()=>reject(Error(message)),ms);
 promise.then(value=>{window.clearTimeout(timer);resolve(value)},error=>{window.clearTimeout(timer);reject(error)});
});

async function loadPdf(data:ArrayBuffer){
 const pdfjs=await import("pdfjs-dist/legacy/build/pdf.mjs");
 if(typeof window!=="undefined"){
  pdfjs.GlobalWorkerOptions.workerSrc=new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs",import.meta.url).toString();
 }
 const task=pdfjs.getDocument({data});
 try{
  return await withTimeout(task.promise,30000,"The PDF could not be opened within 30 seconds. Try a smaller or non-corrupted PDF.");
 }catch(error){
  try{await task.destroy()}catch{}
  throw error;
 }
}

async function pdfPageToPng(pg:any,scale=2){
 const viewport=pg.getViewport({scale});
 const canvas=document.createElement("canvas");
 const ctx=canvas.getContext("2d");
 if(!ctx)throw Error("Canvas unavailable.");
 canvas.width=Math.ceil(viewport.width);
 canvas.height=Math.ceil(viewport.height);
 const task=pg.render({canvasContext:ctx,canvas,viewport});
 await withTimeout(task.promise,30000,"PDF page rendering timed out.");
 const blob=await toBlob(canvas,"image/png");
 const data=new Uint8Array(await blob.arrayBuffer());
 const widthPt=viewport.width/scale;
 const heightPt=viewport.height/scale;
 canvas.width=1;canvas.height=1;
 try{pg.cleanup()}catch{}
 return{data,widthPt,heightPt};
}

async function pdfToDocxPages(data:ArrayBuffer){
 const doc=await loadPdf(data);
 const{Document,Packer,Paragraph,ImageRun,SectionType}=await import("docx");
 const sections=[];
 for(let i=1;i<=doc.numPages;i++){
  const pg=await withTimeout(doc.getPage(i),20000,"PDF page "+i+" could not be read in time.");
  const page=await pdfPageToPng(pg,2);
  const width=Math.max(1,Math.floor((page.widthPt-2)*96/72));
  const height=Math.max(1,Math.floor((page.heightPt-2)*96/72));
  sections.push({
   properties:{
    type:i===1?undefined:SectionType.NEXT_PAGE,
    page:{
     size:{width:Math.round(page.widthPt*20),height:Math.round(page.heightPt*20)},
     margin:{top:0,right:0,bottom:0,left:0,header:0,footer:0,gutter:0}
    }
   },
   children:[
    new Paragraph({
     spacing:{before:0,after:0},
     children:[new ImageRun({
      type:"png",
      data:page.data,
      transformation:{width,height},
      altText:{name:"PDF page "+i,title:"PDF page "+i,description:"Rendered page "+i+" from the source PDF"}
     })]
    })
   ]
  });
 }
 const word=new Document({sections});
 return{doc,pages:doc.numPages,blob:await Packer.toBlob(word)};
}

async function extractPdfText(data:ArrayBuffer){
 const doc=await loadPdf(data);
 const texts:string[]=[];
 for(let i=1;i<=doc.numPages;i++){
  const pg=await withTimeout(doc.getPage(i),20000,"PDF page "+i+" could not be read in time.");
  const ct=await withTimeout(pg.getTextContent(),20000,"PDF text extraction timed out on page "+i+".");
  texts.push(ct.items.map(x=>"str" in x?x.str:"").join(" ").trim());
 }
 return{doc,texts};
}

export async function runPdf(slug:string,files:File[],page:string,edit={operation:"text",text:"",x:"50",y:"50",size:"14"},scanMode="bw"){
 if(!files.length)throw Error("Choose a file.");
 const {PDFDocument,StandardFonts,degrees,rgb}=await import("pdf-lib");

 if(slug==="merge-pdf"){
  if(files.length<2)throw Error("Choose at least two PDFs.");
  const out=await PDFDocument.create();
  for(const f of files){
   const doc=await PDFDocument.load(await f.arrayBuffer());
   (await out.copyPages(doc,doc.getPageIndices())).forEach(p=>out.addPage(p));
  }
  return{blob:pdfBlob(await out.save()),name:"merged.pdf",message:"Merged "+files.length+" PDFs."};
 }

 if(slug==="screenshot-to-pdf"||slug==="images-to-pdf"){
  const out=await PDFDocument.create();
  for(const f of files){
   if(!f.type.startsWith("image/"))throw Error("Choose image files only.");
   const im=await readImage(f);
   const canvas=document.createElement("canvas");
   const ctx=canvas.getContext("2d");
   if(!ctx)throw Error("Canvas unavailable.");
   canvas.width=im.naturalWidth;
   canvas.height=im.naturalHeight;
   ctx.drawImage(im,0,0);
   const jpg=await toBlob(canvas,"image/jpeg",.92);
   const emb=await out.embedJpg(await jpg.arrayBuffer());
   const p=out.addPage([im.naturalWidth,im.naturalHeight]);
   p.drawImage(emb,{x:0,y:0,width:im.naturalWidth,height:im.naturalHeight});
  }
  return{blob:pdfBlob(await out.save()),name:"images.pdf",message:"Created PDF with "+files.length+" image page"+(files.length===1?"":"s")+" in the selected sequence."};
 }

 if(slug==="scan-pdf"){
  const doc=await loadPdf(await files[0].arrayBuffer());
  const out=await PDFDocument.create();
  for(let i=1;i<=doc.numPages;i++){
   const pg=await doc.getPage(i);
   const baseViewport=pg.getViewport({scale:1});
   const renderViewport=pg.getViewport({scale:1.6});
   const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");
   if(!ctx)throw Error("Canvas unavailable.");
   canvas.width=Math.ceil(renderViewport.width);canvas.height=Math.ceil(renderViewport.height);
   await pg.render({canvasContext:ctx,canvas,viewport:renderViewport}).promise;
   const d=ctx.getImageData(0,0,canvas.width,canvas.height);
   for(let p=0;p<d.data.length;p+=4){
    const gray=.299*d.data[p]+.587*d.data[p+1]+.114*d.data[p+2];
    const boosted=Math.max(0,Math.min(255,(gray-128)*1.35+128));
    const v=scanMode==="grayscale"?boosted:(boosted>178?255:0);
    d.data[p]=v;d.data[p+1]=v;d.data[p+2]=v;
   }
   ctx.putImageData(d,0,0);
   const jpg=await toBlob(canvas,"image/jpeg",.94);
   const emb=await out.embedJpg(await jpg.arrayBuffer());
   const p=out.addPage([baseViewport.width,baseViewport.height]);
   p.drawImage(emb,{x:0,y:0,width:baseViewport.width,height:baseViewport.height});
   canvas.width=1;canvas.height=1;
  }
  return{blob:pdfBlob(await out.save()),name:"scanned.pdf",message:"Created a "+(scanMode==="grayscale"?"grayscale":"black-and-white")+" image-only scanned PDF with "+doc.numPages+" page"+(doc.numPages===1?"":"s")+"."};
 }

 if(slug==="edit-pdf"){
  const source=await PDFDocument.load(await files[0].arrayBuffer());
  const i=Math.max(1,Number(page)||1)-1;
  if(i>=source.getPageCount())throw Error("That page does not exist.");
  const target=source.getPage(i);

  if(edit.operation==="rotate"){
   const current=target.getRotation().angle||0;
   target.setRotation(degrees((current+90)%360));
   return{blob:pdfBlob(await source.save()),name:"edited.pdf",message:"Rotated page "+(i+1)+" by 90°."};
  }
  if(edit.operation==="delete"){
   source.removePage(i);
   return{blob:pdfBlob(await source.save()),name:"edited.pdf",message:"Deleted page "+(i+1)+"."};
  }

  const value=edit.text.trim();
  const x=Math.max(0,Number(edit.x)||50);
  const y=Math.max(0,Number(edit.y)||50);
  const size=Math.max(6,Math.min(72,Number(edit.size)||14));
  if(!value)throw Error("Enter the text to add.");
  const font=await source.embedFont(StandardFonts.Helvetica);
  const maxWidth=Math.max(40,target.getWidth()-x-8);
  const words=value.split(/\s+/).filter(Boolean);
  const lines:string[]=[];
  let line="";
  for(const word of words){
   const next=line?line+" "+word:word;
   if(!line||font.widthOfTextAtSize(next,size)<=maxWidth)line=next;
   else{lines.push(line);line=word;}
  }
  if(line)lines.push(line);
  lines.slice(0,12).forEach((line,index)=>{
   target.drawText(line,{x,y:Math.max(8,y-size*1.25*index),size,font,color:rgb(0,0,0)});
  });
  return{blob:pdfBlob(await source.save()),name:"edited.pdf",message:"Added text to page "+(i+1)+"."};
 }

 if(slug==="pdf-to-word"||slug==="pdf-to-docs"){
  const x=await pdfToDocxPages(await files[0].arrayBuffer());
  return{
   blob:x.blob,
   name:slug==="pdf-to-docs"?"google-docs-compatible.docx":"converted.docx",
   message:"Created a layout-preserving DOCX with "+x.pages+" page"+(x.pages===1?"":"s")+". Each PDF page is preserved as a full-page image so tables, Hindi text, images and positioning remain intact."
  };
 }

 if(slug==="word-to-pdf"){
  const mammoth=(await import("mammoth")).default;
  const raw=await mammoth.extractRawText({arrayBuffer:await files[0].arrayBuffer()});
  const out=await PDFDocument.create();
  const font=await out.embedFont(StandardFonts.Helvetica);
  const size=11,margin=50,lineHeight=15,maxWidth=495;
  const wrap=(line:string)=>{
   const words=line.split(/\s+/).filter(Boolean);
   if(!words.length)return[""];
   const rows:string[]=[];
   let cur="";
   for(const word of words){
    const next=cur?cur+" "+word:word;
    if(font.widthOfTextAtSize(next,size)<=maxWidth)cur=next;
    else{if(cur)rows.push(cur);cur=word;}
   }
   if(cur)rows.push(cur);
   return rows;
  };
  let p=out.addPage(),y=p.getHeight()-margin;
  for(const rawLine of raw.value.split(/\r?\n/)){
   for(const line of wrap(rawLine)){
    if(y<margin){p=out.addPage();y=p.getHeight()-margin;}
    p.drawText(line,{x:margin,y,size,font,color:rgb(0,0,0)});
    y-=lineHeight;
   }
  }
  return{blob:pdfBlob(await out.save()),name:"converted.pdf",message:"Created a text-based PDF from the Word document."};
 }

 const source=await PDFDocument.load(await files[0].arrayBuffer());

 if(slug==="extract-pdf-page"){
  const i=Math.max(1,Number(page)||1)-1;
  if(i>=source.getPageCount())throw Error("That page does not exist.");
  const out=await PDFDocument.create();
  out.addPage((await out.copyPages(source,[i]))[0]);
  return{blob:pdfBlob(await out.save()),name:"extracted-page.pdf",message:"Exported page "+(i+1)+"."};
 }

 if(slug==="remove-blank-pages-pdf"){
  const {doc,texts}=await extractPdfText(await files[0].arrayBuffer());
  const keep=texts.map((x,i)=>x?i:-1).filter(i=>i>=0);
  if(!keep.length)throw Error("No selectable-text pages found. Image-only scans need OCR.");
  const out=await PDFDocument.create();
  (await out.copyPages(source,keep)).forEach(p=>out.addPage(p));
  return{blob:pdfBlob(await out.save()),name:"without-blank-pages.pdf",message:"Kept "+keep.length+" of "+doc.numPages+" pages."};
 }

 throw Error("Unsupported PDF tool.");
}
