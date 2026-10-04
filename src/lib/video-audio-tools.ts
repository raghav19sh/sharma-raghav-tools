import type {FFmpeg} from "@ffmpeg/ffmpeg";

export type AudioFormat="mp3"|"wav"|"m4a"|"aac"|"flac"|"ogg"|"opus";

let ffmpeg:FFmpeg|null=null;
let loading:Promise<void>|null=null;
let progressHandler:((progress:number)=>void)|null=null;

const CORE_BASE="https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";

async function getFFmpeg(){
 if(ffmpeg)return ffmpeg;
 if(!loading){
  loading=(async()=>{
   const [{FFmpeg},{toBlobURL}]=await Promise.all([
    import("@ffmpeg/ffmpeg"),
    import("@ffmpeg/util")
   ]);
   const instance=new FFmpeg();
   const [coreURL,wasmURL,workerURL]=await Promise.all([
    toBlobURL(CORE_BASE+"/ffmpeg-core.js","text/javascript"),
    toBlobURL(CORE_BASE+"/ffmpeg-core.wasm","application/wasm"),
    toBlobURL(CORE_BASE+"/ffmpeg-core.worker.js","text/javascript")
   ]);
   await instance.load({coreURL,wasmURL,workerURL});
   instance.on("progress",({progress})=>{if(progressHandler)progressHandler(Math.max(0,Math.min(1,progress)))});
   ffmpeg=instance;
  })();
 }
 await loading;
 loading=null;
 if(!ffmpeg)throw Error("Could not load the browser video converter.");
 return ffmpeg;
}

const extFromName=(name:string)=>{
 const m=name.toLowerCase().match(/\.([a-z0-9]{1,10})$/);
 return m?.[1]||"mp4";
};

const settings:Record<AudioFormat,{codec:string[];mime:string}> = {
 mp3:{codec:["-c:a","libmp3lame","-q:a","2"],mime:"audio/mpeg"},
 wav:{codec:["-c:a","pcm_s16le"],mime:"audio/wav"},
 m4a:{codec:["-c:a","aac","-b:a","192k"],mime:"audio/mp4"},
 aac:{codec:["-c:a","aac","-b:a","192k"],mime:"audio/aac"},
 flac:{codec:["-c:a","flac"],mime:"audio/flac"},
 ogg:{codec:["-c:a","libvorbis","-q:a","5"],mime:"audio/ogg"},
 opus:{codec:["-c:a","libopus","-b:a","128k"],mime:"audio/ogg"}
};

export async function convertVideoToAudio(file:File,format:AudioFormat,onProgress?:(progress:number)=>void){
 progressHandler=onProgress??null;
 const engine=await getFFmpeg();
 const stamp=String(Date.now());
 const input="input-"+stamp+"."+extFromName(file.name);
 const output="output-"+stamp+"."+format;
 try{
  const {fetchFile}=await import("@ffmpeg/util");
  await engine.writeFile(input,await fetchFile(file));
  const ret=await engine.exec(["-i",input,"-vn","-map","0:a:0?",...settings[format].codec,output]);
  if(ret!==0)throw Error("FFmpeg could not extract an audio stream from this video.");
  const data=await engine.readFile(output);
  if(typeof data==="string")throw Error("The converter returned an invalid audio result.");
  return {
   blob:new Blob([data],{type:settings[format].mime}),
   name:file.name.replace(/\.[^/.]+$/,"")+"."+format
  };
 }finally{
  try{await engine.deleteFile(input)}catch{}
  try{await engine.deleteFile(output)}catch{}
  progressHandler=null;
 }
}
