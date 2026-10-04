import {readImage,toBlob} from "./image-tools";

const pdfBlob=(x:Uint8Array)=>new Blob([x as unknown as BlobPart],{type:"application/pdf"});
const textBlob=(x:string)=>new Blob([x],{type:"text/plain;charset=utf-8"});

async function loadPdf(data:ArrayBuffer){
 const pdfjs=await import("pdfjs-dist/legacy/build/pdf.mjs");
 return await pdfjs.getDocument({data,disableWorker:true}).promise;
}

async function extractPdfText(data:ArrayBuffer){
 const doc=await loadPdf(data);
 const texts:string[]=[];
 for(let i=1;i<=doc.numPages;i++){
  const pg=await doc.getPage(i),ct=await pg.getTextContent();
  texts.push(ct.items.map(x=>"str" in x?x.str:"").join(" ").trim());
 }
 return{doc,texts};
}

async function scanPdfText(data:ArrayBuffer){
 const doc=await loadPdf(data);
 const {createWorker}=await import("tesseract.js");
 const worker=await createWorker("eng");
 const texts:string[]=[];
 try{
  for(let i=1;i<=doc.numPages;i++){
   const pg=await doc.getPage(i);
   const viewport=pg.getViewport({scale:1.5});
   const canvas=document.createElement("canvas");
   const ctx=canvas.getContext("2d");
   if(!ctx)throw Error("Canvas unavailable.");
   canvas.width=Math.ceil(viewport.width);
   canvas.height=Math.ceil(viewport.height);
   await pg.render({canvasContext:ctx,viewport}).promise;
   const result=await worker.recognize(canvas);
   texts.push(result.data.text.trim());
   canvas.width=1;
   canvas.height=1;
  }
 }finally{
  await worker.terminate();
 }
 return{doc,texts};
}

export async function runPdf(slug:string,files:File[],page:string,edit={operation:"text",text:"",x:"50",y:"50",size:"14"}){
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
  const {doc,texts}=await scanPdfText(await files[0].arrayBuffer());
  const body=texts.map((value,index)=>"PAGE "+(index+1)+"\n"+(value||"No readable text detected.")).join("\n\n");
  return{
   blob:textBlob(body),
   name:"scanned-pdf-text.txt",
   message:"OCR scanned "+doc.numPages+" PDF page"+(doc.numPages===1?"":"s")+" and downloaded the extracted text."
  };
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
  const {doc,texts}=await extractPdfText(await files[0].arrayBuffer());
  if(!texts.some(Boolean))throw Error("No selectable text found. Scanned/image-only PDFs need OCR first.");
  const {Document,Packer,Paragraph,TextRun}=await import("docx");
  const word=new Document({sections:[{children:texts.map(x=>new Paragraph({children:[new TextRun(x||" ")]}))}]});
  return{
   blob:await Packer.toBlob(word),
   name:slug==="pdf-to-docs"?"google-docs-compatible.docx":"converted.docx",
   message:"Created DOCX from "+doc.numPages+" PDF pages."
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
