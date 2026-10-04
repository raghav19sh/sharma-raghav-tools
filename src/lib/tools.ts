export type CategoryId="image"|"pdf"|"calc"|"convert"|"text"|"utility"|"career"|"cyber";
export type ToolKind="image"|"pdf"|"calc"|"convert"|"timezone"|"text"|"url"|"qr"|"password"|"ocr"|"resume"|"video-audio"|"cyber";
export type Tool={slug:string;name:string;short:string;description:string;category:CategoryId;kind:ToolKind;steps:string[];uses:string[]};

const rows:Array<[string,string,string,CategoryId,ToolKind]>=[
["http-security-header-analyzer","HTTP Security Header Analyzer","Analyze CSP, HSTS, X-Frame-Options, cookies and other HTTP security headers.","cyber","cyber"],["jwt-analyzer","JWT Analyzer","Decode JWT header and payload, inspect claims, algorithm and expiry.","cyber","cyber"],["hash-generator","Hash Generator","Generate SHA-1, SHA-256, SHA-384 and SHA-512 hashes.","cyber","cyber"],["hash-identifier","Hash Identifier","Identify likely hash families from hexadecimal length and format.","cyber","cyber"],["base64-url-hex","Base64 / URL / Hex Encoder","Encode and decode Base64 and hexadecimal data.","cyber","cyber"],["url-domain-analyzer","URL / Domain Analyzer","Inspect protocol, hostname, port, path, query and origin.","cyber","cyber"],["password-strength-analyzer","Password Strength Analyzer","Estimate password strength, entropy and common weakness signals.","cyber","cyber"],["regex-security-tester","Regex Security Tester","Validate regex patterns and flag common ReDoS risk patterns.","cyber","cyber"],["csp-generator","CSP Generator","Build a Content-Security-Policy header interactively.","cyber","cyber"],["security-txt-generator","Security.txt Generator","Generate a security.txt file for vulnerability disclosure.","cyber","cyber"],["ip-cidr-calculator","IP / CIDR Calculator","Calculate network, broadcast, mask and usable host ranges.","cyber","cyber"],["dns-record-analyzer","DNS Record Analyzer","Look up A, AAAA, CNAME, MX, TXT and NS records.","cyber","cyber"],["tls-ssl-analyzer","TLS/SSL Analyzer","Inspect TLS protocol, cipher and peer certificate details.","cyber","cyber"],["whois-rdap-lookup","WHOIS/RDAP Lookup","Look up domain registration events, status and nameservers.","cyber","cyber"],["file-hash-calculator","File Hash Calculator","Calculate SHA-256 and other cryptographic hashes for a file.","cyber","cyber"],["exif-metadata-viewer","Exif/Metadata Viewer","Inspect image metadata and basic JPEG EXIF segments locally.","cyber","cyber"],["qr-security-analyzer","QR Security Analyzer","Inspect a QR destination and flag common suspicious URL characteristics.","cyber","cyber"],["ioc-analyzer","IOC Analyzer","Classify and normalize IP, domain and hash indicators.","cyber","cyber"],["yara-rule-tester","YARA Rule Tester","Test simple quoted YARA string indicators against a local file.","cyber","cyber"],["log-analyzer","Log Analyzer","Analyze logs for brute-force, error, SQLi and XSS indicators.","cyber","cyber"],["pcap-analyzer","PCAP Analyzer","Summarize packets and basic TCP, UDP and ICMP counts from PCAP files.","cyber","cyber"],
["security-report-generator","Security Report Generator","Generate a combined domain security report covering HTTP headers, DNS, TLS and RDAP.","cyber","cyber"],
["universal-security-analyzer","Universal Security Analyzer","Automatically identify URLs, domains, IPs, hashes and JWTs and show relevant security signals.","cyber","cyber"],
["file-forensics","File Forensics","Inspect local file type, hashes, entropy, strings and basic metadata without uploading the file.","cyber","cyber"],
["ioc-extractor","IOC Extractor","Extract IPs, domains, URLs, hashes, CVEs and common indicators from text or incident logs.","cyber","cyber"],
["stix-ioc-exporter","STIX IOC Exporter","Convert extracted indicators into a STIX 2.1 bundle for threat-intelligence workflows.","cyber","cyber"],
["entropy-calculator","Shannon Entropy Calculator","Calculate Shannon entropy for text or file bytes and inspect randomness signals.","cyber","cyber"],
["cvss-calculator","CVSS v3.1 Calculator","Calculate a CVSS v3.1 base score from the standard metric choices.","cyber","cyber"],
["port-range-calculator","Port Range Calculator","Calculate the number of ports and enumerate a bounded TCP or UDP port range.","cyber","cyber"],
["chmod-calculator","Linux chmod Calculator","Convert Linux file permissions between symbolic, numeric and chmod notation.","cyber","cyber"],
["json-to-typescript","JSON to TypeScript","Generate TypeScript interfaces from a JSON object for developer workflows.","cyber","cyber"],
["json-to-csv","JSON to CSV Converter","Convert an array of JSON objects into CSV for analysis and spreadsheets.","cyber","cyber"],
["unix-timestamp-converter","Unix Timestamp Converter","Convert Unix timestamps to readable UTC dates and convert dates back to timestamps.","cyber","cyber"],
["cron-expression-helper","Cron Expression Helper","Validate five-field cron expressions and explain their fields.","cyber","cyber"],
["compress-image","Compress image to target size","Compress an image to a size you choose, such as 100KB or 500KB.","image","image"],
["resize-image","Resize image to exact size","Resize an image to precise pixel dimensions.","image","image"],
["remove-background","Remove background from image","Create a transparent-background PNG.","image","image"],
["heic-to-jpg","Convert HEIC to JPG","Convert HEIC images to widely supported JPG.","image","image"],
["passport-photo","Make passport photo","Crop a portrait to a common 35×45mm ratio.","image","image"],
["photo-smaller","Make photo smaller without losing quality","Downsize a photo while preserving visual quality.","image","image"],
["signature-image","Create signature image","Turn a photographed signature into a clean PNG.","image","image"],
["scan-image","Scan image to document","Turn a photo of a document into a clean scanned-style image.","image","image"],
["merge-pdf","Merge two PDFs","Combine two or more PDFs into one.","pdf","pdf"],
["remove-blank-pages-pdf","Remove blank pages from PDF","Remove pages with no selectable text.","pdf","pdf"],
["extract-pdf-page","Extract one page from PDF","Export one chosen PDF page as a new PDF.","pdf","pdf"],
["pdf-to-word","Convert PDF to Word","Extract selectable PDF text into DOCX.","pdf","pdf"],
["screenshot-to-pdf","Turn screenshot into PDF","Create a PDF from one or more PNG or JPG screenshots.","pdf","pdf"],
["images-to-pdf","Images to sequenced PDF","Combine many images into one PDF in the order you select them.","pdf","pdf"],
["pdf-to-docs","Convert PDF to Google Docs","Convert selectable PDF text into a DOCX file you can open in Google Docs.","pdf","pdf"],
["word-to-pdf","Convert Word to PDF","Convert a DOCX Word document into a text-based PDF.","pdf","pdf"],
["scan-pdf","Make a scanned PDF","Rasterize PDF pages into a scanned-style, image-only PDF.","pdf","pdf"],
["edit-pdf","Edit PDF","Add text, rotate pages, or delete pages from a PDF.","pdf","pdf"],
["ats-resume-score","ATS Resume Score Checker","Score a PDF or DOCX resume for ATS readability, sections, impact and job-keyword alignment.","career","resume"],
["days-between-dates","How many days between two dates?","Count calendar days between two dates.","calc","calc"],
["day-of-date","What day was 15 August 2004?","Find the weekday for any date.","calc","calc"],
["percentage-increase","Calculate percentage increase","Calculate percentage change from old to new.","calc","calc"],
["discount-calculator","Calculate discount","Find discount amount and final price.","calc","calc"],
["emi-calculator","Calculate EMI","Estimate a monthly loan payment.","calc","calc"],
["age-calculator","Calculate age","Find age in years, months and days.","calc","calc"],
["cgpa-to-percentage","Convert CGPA to percentage","Convert CGPA with a configurable multiplier.","calc","calc"],
["split-bill","Split bill between 5 people","Split a bill evenly between a group.","calc","calc"],
["tip-calculator","Calculate tip","Calculate tip amount and final total.","calc","calc"],
["fuel-cost","Calculate fuel cost","Estimate litres used and trip fuel cost.","calc","calc"],
["salary-after-tax","Calculate salary after tax","Estimate take-home pay with a flat rate.","calc","calc"],
["sip-calculator","Calculate SIP returns","Estimate future value of a monthly SIP.","calc","calc"],
["celsius-to-fahrenheit","Convert Celsius to Fahrenheit","Convert Celsius and Fahrenheit.","convert","convert"],
["kg-to-pounds","Convert kg to pounds","Convert kilograms and pounds.","convert","convert"],
["feet-to-cm","Convert feet to cm","Convert feet and centimetres.","convert","convert"],
["mb-to-gb","Convert MB to GB","Convert storage values using decimal or binary units.","convert","convert"],
["time-zones","Convert time zones","Convert a wall-clock time between IANA zones.","convert","timezone"],
["json-validator","Check if JSON is valid","Validate JSON instantly.","text","text"],
["json-formatter","Format JSON","Pretty-print or minify JSON.","text","text"],
["compare-text","Compare two texts","Compare two text blocks line by line.","text","text"],
["word-counter","Count words","Count words, characters and lines.","text","text"],
["remove-duplicate-lines","Remove duplicate lines","Keep one copy of each repeated line.","text","text"],
["remove-spaces","Remove spaces from text","Remove spaces, tabs or all whitespace.","text","text"],
["uppercase-text","Convert text to uppercase","Change text to uppercase.","text","text"],
["url-shortener","Make a URL shorter","Create a short shareable URL using an external service.","text","url"],
["qr-generator","Generate QR code","Create a downloadable QR code locally.","utility","qr"],
["password-generator","Generate strong password","Generate random passwords with Web Crypto.","utility","password"],
["extract-text-image","Extract text from image","Run OCR on an image in your browser.","utility","ocr"],
["video-to-audio","Convert video to audio","Extract audio from video files in your browser and export it as MP3, WAV, M4A, AAC, FLAC, OGG or OPUS.","utility","video-audio"]
];

const stepsBy:Record<CategoryId,string[]>={
image:["Choose a file.","Set the requested options.","Run the tool and download the result."],
pdf:["Choose your PDF or image input.","Set the requested page or options.","Run the tool and download the result."],
calc:["Enter the values.","Check the assumptions shown by the tool.","Run the calculation and read the result."],
convert:["Enter a value.","Choose the conversion direction or unit.","Read or copy the converted value."],
text:["Paste or enter your text.","Choose any available mode.","Run the tool and copy the result."],
utility:["Enter or choose your input.","Run the utility.","Copy or download the result."],
career:["Choose your resume.","Optionally paste the target job description.","Run the checker and review the score and recommendations."],
cyber:["Enter or choose your security input.","Run the analysis.","Review the findings and verify important results."]
};

const usesBy:Record<CategoryId,string[]>={
image:["Uploads and forms","Web publishing","Photos and documents"],
pdf:["Applications","Reports","Document cleanup"],
calc:["Planning","Budgeting","Everyday math"],
convert:["Travel","Work and study","Everyday measurements"],
text:["Development","Data cleanup","Writing and editing"],
utility:["Sharing","Security hygiene","Scans and screenshots"],
career:["Job applications","Resume tailoring","Career preparation"],
cyber:["Security testing","Incident analysis","Developer security"]
};

export const tools:Tool[]=rows.map(([slug,name,short,category,kind])=>({
slug,name,short,category,kind,
description:short+" Use this focused browser-first tool without an account.",
steps:stepsBy[category],uses:usesBy[category]
}));

export const categories=[
{id:"image" as const,name:"Image tools",description:"Compress, resize, convert and clean images."},
{id:"pdf" as const,name:"PDF tools",description:"Merge, extract and convert PDFs."},
{id:"calc" as const,name:"Calculators",description:"Fast everyday date, money and planning math."},
{id:"convert" as const,name:"Converters",description:"Units, temperatures, sizes and time zones."},
{id:"text" as const,name:"Text & developer",description:"JSON, comparison, counting and cleanup."},
{id:"utility" as const,name:"Utilities",description:"QR codes, passwords and OCR."},
{id:"career" as const,name:"Career tools",description:"Resume analysis and job-application helpers."},
{id:"cyber" as const,name:"Cybersecurity tools",description:"Web security, cryptography, DNS, forensics and defensive analysis."}
];

export function getTool(slug:string){return tools.find(t=>t.slug===slug);}
