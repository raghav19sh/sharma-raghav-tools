import {readImage} from "./image-tools";
const pdfBlob=(x:Uint8Array)=>new Blob([x as unknown as BlobPart],{type:"application/pdf"});
export async function runPdf(slug:string,files:File[],page:string){
 if(!files.length)throw Error("Choose a file.");
 const {PDFDocument}=await import("pdf-lib");
 if(slug==="merge-pdf"){
  if(files.length<2)throw Error("Choose at least two PDFs.");
  const out=await PDFDocument.create();
  for(const f of files){const doc=await PDFDocument.load(await f.arrayBuffer());(await out.copyPages(doc,doc.getPageIndices())).forEach(p=>out.addPage(p))}
  return{blob:pdfBlob(await out.save()),name:"merged.pdf",message:"Merged "+files.length+" PDFs."};
 }
 const source=await PDFDocument.load(await files[0].arrayBuffer());
 if(slug==="extract-pdf-page"){
  const i=Math.max(1,Number(page)||1)-1;
  if(i>=source.getPageCount())throw Error("That page does not exist.");
  const out=await PDFDocument.create();out.addPage((await out.copyPages(source,[i]))[0]);
  return{blob:pdfBlob(await out.save()),name:"extracted-page.pdf",message:"Exported page "+(i+1)+"."};
 }
 if(slug==="screenshot-to-pdf"){
  const f=files[0],im=await readImage(f),out=await PDFDocument.create();
  const emb=f.type==="image/png"?await out.embedPng(await f.arrayBuffer()):await out.embedJpg(await f.arrayBuffer());
  const p=out.addPage([im.naturalWidth,im.naturalHeight]);p.drawImage(emb,{x:0,y:0,width:im.naturalWidth,height:im.naturalHeight});
  return{blob:pdfBlob(await out.save()),name:"screenshot.pdf",message:"Created PDF from screenshot."};
 }
 const pdfjs=await import("pdfjs-dist/legacy/build/pdf.mjs"),data=await files[0].arrayBuffer();
 const doc=await pdfjs.getDocument({data}).promise,texts:string[]=[];
 for(let i=1;i<=doc.numPages;i++){const pg=await doc.getPage(i),ct=await pg.getTextContent();texts.push(ct.items.map(x=>"str" in x?x.str:"").join(" ").trim())}
 if(slug==="remove-blank-pages-pdf"){
  const keep=texts.map((x,i)=>x?i:-1).filter(i=>i>=0);
  if(!keep.length)throw Error("No selectable-text pages found. Image-only scans need OCR.");
  const out=await PDFDocument.create();(await out.copyPages(source,keep)).forEach(p=>out.addPage(p));
  return{blob:pdfBlob(await out.save()),name:"without-blank-pages.pdf",message:"Kept "+keep.length+" of "+source.getPageCount()+" pages."};
 }
 const {Document,Packer,Paragraph,TextRun}=await import("docx");
 const word=new Document({sections:[{children:texts.map(x=>new Paragraph({children:[new TextRun(x||" ")]}))}]});
 return{blob:await Packer.toBlob(word),name:"converted.docx",message:"Created DOCX from "+doc.numPages+" pages."};
}