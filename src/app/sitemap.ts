import type {MetadataRoute} from "next";import {tools} from "@/lib/tools";import {guides} from "@/lib/guides";
export default function sitemap():MetadataRoute.Sitemap{
 const b="https://tools.sharma-raghav.com";
 const updated=new Date("2026-10-05T00:00:00.000Z");
 return[
  {url:b,lastModified:updated,priority:1,changeFrequency:"weekly"},
  {url:b+"/guides",lastModified:updated,priority:.7,changeFrequency:"weekly"},
  {url:b+"/privacy",priority:.2,changeFrequency:"monthly"},
  {url:b+"/terms",priority:.2,changeFrequency:"monthly"},
  {url:b+"/contact",priority:.1,changeFrequency:"monthly"},
  ...tools.map(t=>({url:b+"/"+t.slug,lastModified:updated,priority:.8,changeFrequency:"monthly" as const})),
  ...guides.map(g=>({url:b+"/guides/"+g.slug,lastModified:updated,priority:.7,changeFrequency:"monthly" as const}))
 ];
}