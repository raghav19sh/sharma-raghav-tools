import type {NextConfig} from "next";
import path from "node:path";

const nextConfig:NextConfig={
 webpack:(config,{isServer})=>{
  if(!isServer){
   config.resolve.alias={
    ...config.resolve.alias,
    "@ffmpeg/ffmpeg":path.join(process.cwd(),"node_modules/@ffmpeg/ffmpeg/dist/umd/ffmpeg.js")
   };
  }
  return config;
 }
};

export default nextConfig;
