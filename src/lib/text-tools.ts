export function runText(slug:string,a:string,b:string,mode:string){
 if(slug==="json-validator"){try{JSON.parse(a);return"Valid JSON"}catch(e){return"Invalid JSON: "+(e as Error).message}}
 if(slug==="json-formatter"){return mode==="pretty"?JSON.stringify(JSON.parse(a),null,2):JSON.stringify(JSON.parse(a))}
 if(slug==="compare-text"){const l=a.split(/\r?\n/),r=b.split(/\r?\n/),m=Math.max(l.length,r.length),o:string[]=[];for(let i=0;i<m;i++){if(l[i]===r[i])o.push("  "+(l[i]??""));else{if(l[i]!==undefined)o.push("- "+l[i]);if(r[i]!==undefined)o.push("+ "+r[i])}}return o.join("\n")}
 if(slug==="word-counter"){const w=a.trim()?a.trim().split(/\s+/).length:0;return w+" words • "+a.length+" characters • "+(a?a.split(/\r?\n/).length:0)+" lines"}
 if(slug==="remove-duplicate-lines")return[...new Set(a.split(/\r?\n/))].join("\n");
 if(slug==="remove-spaces")return mode==="all"?a.replace(/\s+/g,""):a.replace(/[ \t]+/g,"");
 return a.toUpperCase();
}