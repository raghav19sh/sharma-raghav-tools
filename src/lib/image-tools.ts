export const saveBlob=(b:Blob,n:string)=>{const u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};
export const readImage=(f:File)=>new Promise<HTMLImageElement>((res,rej)=>{const u=URL.createObjectURL(f),i=new Image();i.onload=()=>{URL.revokeObjectURL(u);res(i)};i.onerror=()=>{URL.revokeObjectURL(u);rej(Error("Could not read image."))};i.src=u});
export const toBlob=(c:HTMLCanvasElement,t="image/jpeg",q=.9)=>new Promise<Blob>((res,rej)=>c.toBlob(x=>x?res(x):rej(Error("Image export failed.")),t,q));
async function bestJpeg(c:HTMLCanvasElement,goal:number){
 let lo=.05,hi=.95,best=await toBlob(c,"image/jpeg",lo);
 for(let i=0;i<10;i++){
  const q=(lo+hi)/2,z=await toBlob(c,"image/jpeg",q);
  if(Math.abs(z.size-goal)<Math.abs(best.size-goal))best=z;
  if(z.size>goal)hi=q;else lo=q;
 }
 return best;
}
export async function runImage(slug:string,file:File,target:string,width:string,height:string,threshold:string){
 if(!file)throw Error("Choose an image first.");
 if(slug==="heic-to-jpg"){const h=(await import("heic2any")).default,z=await h({blob:file,toType:"image/jpeg",quality:.9});return{blob:Array.isArray(z)?z[0]:z,name:"converted.jpg",message:"Converted HEIC to JPG."}}
 const im=await readImage(file),c=document.createElement("canvas"),ctx=c.getContext("2d");
 if(!ctx)throw Error("Canvas unavailable.");
 let w=im.naturalWidth,h=im.naturalHeight;
 if(slug==="resize-image"){w=Math.max(1,Number(width)||800);h=Math.max(1,Number(height)||800)}
 if(slug==="photo-smaller"){const m=Math.max(200,Number(width)||1200),s=Math.min(1,m/Math.max(w,h));w=Math.max(1,Math.round(w*s));h=Math.max(1,Math.round(h*s))}
 if(slug==="passport-photo"){w=413;h=531}
 c.width=w;c.height=h;ctx.fillStyle="#fff";if(slug==="passport-photo")ctx.fillRect(0,0,w,h);ctx.drawImage(im,0,0,w,h);
 if(slug==="remove-background"){const d=ctx.getImageData(0,0,w,h),sample=[0,0,0];for(const p of [0,w-1,(h-1)*w,h*w-1]){sample[0]+=d.data[p*4];sample[1]+=d.data[p*4+1];sample[2]+=d.data[p*4+2]}sample[0]/=4;sample[1]/=4;sample[2]/=4;const t=Math.max(10,Number(threshold)||55);for(let i=0;i<d.data.length;i+=4){const dist=Math.hypot(d.data[i]-sample[0],d.data[i+1]-sample[1],d.data[i+2]-sample[2]);d.data[i+3]=dist<t?0:Math.min(255,Math.max(0,(dist-t)*12))}ctx.putImageData(d,0,0);return{blob:await toBlob(c,"image/png"),name:"background-removed.png",message:"Downloaded transparent PNG. Best results are from images with a fairly plain background."}}
 if(slug==="signature-image"){const d=ctx.getImageData(0,0,w,h),t=Math.max(180,Math.min(255,Number(threshold)||235));for(let i=0;i<d.data.length;i+=4){const l=.299*d.data[i]+.587*d.data[i+1]+.114*d.data[i+2];d.data[i]=0;d.data[i+1]=0;d.data[i+2]=0;d.data[i+3]=l<t?Math.min(255,Math.max(0,(t-l)*8)):0}ctx.putImageData(d,0,0);return{blob:await toBlob(c,"image/png"),name:"signature.png",message:"Downloaded cleaned signature PNG."}}
 if(slug==="compress-image"){
  const goal=Math.max(10,Number(target)||100)*1024;
  let currentW=w,currentH=h,last=await toBlob(c,"image/jpeg",.05);
  for(let pass=0;pass<14;pass++){
   c.width=currentW;c.height=currentH;ctx.drawImage(im,0,0,currentW,currentH);
   const z=await bestJpeg(c,goal);
   if(z.size<=goal||pass===13)return{blob:z,name:"compressed-image.jpg",message:"Created "+Math.round(z.size/1024)+"KB JPEG for a "+Math.round(goal/1024)+"KB target."};
   currentW=Math.max(160,Math.round(currentW*.82));currentH=Math.max(160,Math.round(currentH*.82));last=z;
  }
  return{blob:last,name:"compressed-image.jpg",message:"Created compressed JPEG close to the requested size."};
 }
 const z=await toBlob(c,"image/jpeg",.9);return{blob:z,name:slug==="passport-photo"?"passport-photo.jpg":"resized-image.jpg",message:"Downloaded "+Math.round(z.size/1024)+"KB JPEG."};
}