import type {MetadataRoute} from "next";import {tools} from "@/lib/tools";import {guides} from "@/lib/guides";
export default function sitemap():MetadataRoute.Sitemap{const b="https://tools.sharma-raghav.com";return[
 {url:b,priority:1,changeFrequency:"weekly"},
 {url:b+"/guides",priority:.7,changeFrequency:"weekly"},
 {url:b+"/privacy",priority:.2,changeFrequency:"monthly"},
 {url:b+"/terms",priority:.2,changeFrequency:"monthly"},
 {url:b+"/contact",priority:.1,changeFrequency:"monthly"},
 ...tools.map(t=>({url:b+"/"+t.slug,priority:.8,changeFrequency:"monthly" as const})),
 ...guides.map(g=>({url:b+"/guides/"+g.slug,priority:.7,changeFrequency:"monthly" as const}))
]}