const STOPWORDS=new Set("a an the and or but for to of in on with by from as at is are was were be been being this that these those your our their you we they it its into about over under after before during across through using use used have has had will would should can could may might must do does did not no if than then so such very more most less also all any each both other another".split(" "));

const SECTION_RULES=[
 ["summary","summary|objective|profile"],
 ["experience","experience|employment|work history|professional experience"],
 ["education","education|academic|qualification"],
 ["skills","skills|technical skills|technologies|competencies"],
 ["projects","projects|personal projects|academic projects"],
 ["certifications","certifications|certificates|licenses"],
 ["achievements","achievements|accomplishments|awards"],
 ["links","linkedin|github|portfolio|website"]
] as const;

const normalize=(s:string)=>s.toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9+#./%\-\s]/g," ").replace(/\s+/g," ").trim();
const words=(s:string)=>normalize(s).split(" ").filter(w=>w.length>=3&&!STOPWORDS.has(w));

async function extractPdfText(file:File){
 const pdfjs=await import("pdfjs-dist/legacy/build/pdf.mjs");
 if(typeof window!=="undefined")pdfjs.GlobalWorkerOptions.workerSrc=new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs",import.meta.url).toString();
 const doc=await pdfjs.getDocument({data:await file.arrayBuffer()}).promise;
 const pages:string[]=[];
 for(let i=1;i<=doc.numPages;i++){
  const pg=await doc.getPage(i);
  const ct=await pg.getTextContent();
  pages.push(ct.items.map(x=>"str" in x?x.str:"").join(" "));
 }
 return pages.join("\n");
}

async function extractDocxText(file:File){
 const mammoth=(await import("mammoth")).default;
 return (await mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()})).value;
}

async function extractText(file:File){
 const name=file.name.toLowerCase();
 if(name.endsWith(".docx"))return extractDocxText(file);
 if(name.endsWith(".pdf")||file.type==="application/pdf")return extractPdfText(file);
 throw Error("Upload a PDF or DOCX resume.");
}

const sectionPresent=(text:string,pattern:string)=>new RegExp("\\b(?:"+pattern+")\\b","i").test(text);

export async function scoreResume(file:File,jobDescription:string){
 const text=await extractText(file);
 const clean=normalize(text);
 if(clean.length<80)throw Error("Very little selectable text was found. This may be an image-only/scanned resume. Convert it to a text-based PDF or DOCX first.");
 const lower=text.toLowerCase();
 const scoreParts:{name:string;score:number;max:number;note:string}[]=[];

 let parsing=20;
 if(clean.length<500)parsing-=8;
 else if(clean.length<1000)parsing-=3;
 if((text.match(/[�]/g)||[]).length>2)parsing-=4;
 scoreParts.push(["ATS readability",Math.max(0,parsing),20,parsing===20?"Good selectable text and reasonable resume length.":"Text extraction is weak or unusually short."]);

 let contact=0;
 if(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}/i.test(text))contact+=3;
 if(/(?:\\+?\\d[\\d ()-]{7,}\\d)/.test(text))contact+=3;
 if(/linkedin\\.com\\/in\\/|\\blinkedin\\b/i.test(text))contact+=2;
 if(/github\\.com\\/|\\bgithub\\b/i.test(text))contact+=2;
 scoreParts.push(["Contact & links",contact,10,contact>=8?"Contact details are easy to detect.":"Add clearly written email, phone, LinkedIn and GitHub/portfolio links."]);

 let sections=0;
 const found:string[]=[];
 for(const [name,pattern] of SECTION_RULES){
  if(sectionPresent(text,pattern)){sections+=name==="links"?2:3;found.push(name)}
 }
 sections=Math.min(20,sections);
 scoreParts.push(["Sections",sections,20,found.length>=5?"Core ATS sections are present.":"Add standard headings such as Experience, Education, Skills and Projects."]);

 let impact=0;
 const quantified=(text.match(/\\b\\d+(?:\\.\\d+)?(?:%|\\+|x|k|m|b)?\\b|[$₹€£]\\s?\\d+/gi)||[]).length;
 const actionHits=(text.match(/\\b(built|developed|implemented|automated|optimized|reduced|increased|improved|led|designed|deployed|secured|analyzed|created|managed|delivered|migrated|tested)\\b/gi)||[]).length;
 impact=Math.min(15,Math.min(9,Math.floor(quantified/2)*3)+Math.min(6,Math.floor(actionHits/5)*2));
 scoreParts.push(["Impact & achievements",impact,15,impact>=10?"Good use of measurable outcomes and action verbs.":"Add measurable results: %, time saved, scale, users, revenue, accuracy, cost, incidents, etc."]);

 let formatting=15;
 const weird=(text.match(/[•▪◦●◆◇]/g)||[]).length;
 const veryLong=(text.split("\n").filter(x=>x.length>180).length);
 if(veryLong>4)formatting-=4;
 if(weird>80)formatting-=2;
 if(/\t{2,}/.test(text))formatting-=2;
 scoreParts.push(["ATS-friendly formatting",Math.max(0,formatting),15,formatting>=13?"Plain, parseable formatting signals detected.":"Simplify complex spacing, layouts and decorative formatting."]);

 let keywordScore=20;
 let keywordNote="No job description supplied; score reflects general ATS readiness.";
 if(jobDescription.trim()){
  const jdWords=Array.from(new Set(words(jobDescription))).filter(w=>w.length>=4);
  const resumeSet=new Set(words(text));
  const matches=jdWords.filter(w=>resumeSet.has(w));
  const ratio=jdWords.length?matches.length/jdWords.length:0;
  keywordScore=Math.round(Math.min(20,ratio*20));
  keywordNote=`Matched ${matches.length} of ${jdWords.length} important job-description terms (${Math.round(ratio*100)}%).`;
 }else keywordScore=12;
 scoreParts.push(["Job keyword match",keywordScore,20,keywordNote]);

 const total=Math.round(scoreParts.reduce((s,p)=>s+p[1],0));
 const missingSections=["experience","education","skills","projects"].filter(x=>!found.includes(x));
 const recommendations:string[]=[];
 if(missingSections.length)recommendations.push("Add standard sections: "+missingSections.map(x=>x[0].toUpperCase()+x.slice(1)).join(", ")+".");
 if(contact<8)recommendations.push("Make contact details and professional links plain text and easy to parse.");
 if(impact<10)recommendations.push("Rewrite bullets with action verb + task + measurable result.");
 if(jobDescription.trim()&&keywordScore<15)recommendations.push("Mirror relevant technical skills and role-specific terminology from the job description where truthful.");
 if(clean.length<900)recommendations.push("Add stronger evidence of projects, experience, skills and outcomes if applicable.");
 if(!recommendations.length)recommendations.push("Strong baseline. Tailor keywords and bullets to each job before applying.");

 const band=total>=85?"Strong ATS readiness":total>=70?"Good ATS readiness":total>=55?"Needs improvement":"High-risk for ATS parsing/matching";
 return {
  text,
  total,
  band,
  parts:scoreParts,
  recommendations,
  report:`ATS RESUME SCORE: ${total}/100
${band}

${scoreParts.map(p=>p[0]+": "+p[1]+"/"+p[2]+" — "+p[3]).join("\n")}

TOP IMPROVEMENTS
${recommendations.map((r,i)=>(i+1)+". "+r).join("\n")}

Note: This is a transparent heuristic checker, not a proprietary ATS vendor score. Different employers use different parsing and ranking systems.`
 };
}
