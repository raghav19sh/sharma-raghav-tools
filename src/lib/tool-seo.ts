import type {Tool} from "@/lib/tools";

export type ToolSeo={
  metaDescription:string;
  keywords:string[];
  intro:string;
  sections:Array<{heading:string;body:string}>;
  faqs:Array<{q:string;a:string}>;
  relatedGuides:string[];
};

const custom:Record<string,ToolSeo>={ "video-to-audio":{
  metaDescription:"Convert video to MP3, WAV, M4A, AAC, FLAC, OGG or OPUS in your browser. Supports common video formats and uses MP3 by default.",
  keywords:["video to audio","video to MP3","video to WAV","convert video to audio","extract audio from video","MP4 to MP3","MOV to MP3","MKV to MP3"],
  intro:"Extract audio from a video file directly in your browser. MP3 is selected by default, with WAV, M4A, AAC, FLAC, OGG and OPUS available when you need another format.",
  sections:[
   {heading:"Convert video to MP3, WAV and other audio formats",body:"Choose a video, keep MP3 as the default output or select another audio format, then run the converter. The tool extracts the first available audio stream and downloads the result using the source filename."},
   {heading:"Supported video files",body:"The file picker accepts common containers such as MP4, M4V, MOV, WebM, MKV, AVI, FLV, WMV, MPEG, MPG, 3GP, TS, MTS, M2TS, VOB, OGV, RM, RMVB, DIVX and MXF. FFmpeg inspects file contents, so codec availability can still affect whether a particular file converts successfully."},
   {heading:"Choose the right audio format",body:"MP3 is the broadly compatible default. WAV is useful when you want uncompressed PCM audio. FLAC preserves lossless audio in a compressed container, while M4A/AAC, OGG and OPUS are useful when you want smaller encoded files."},
   {heading:"Browser-first processing",body:"Conversion runs inside the browser with FFmpeg WebAssembly. Large videos can take significant CPU time and memory, so keep the original file and verify the downloaded audio before deleting it."}
  ],
  faqs:[
   {q:"Is MP3 the default output?",a:"Yes. MP3 is selected by default, and you can switch to WAV, M4A, AAC, FLAC, OGG or OPUS."},
   {q:"Can I convert MP4 to MP3?",a:"Yes. MP4 is one of the common video containers accepted by the tool, provided the file contains an audio stream the converter can decode."},
   {q:"Can I convert MOV or MKV to MP3?",a:"Yes, common MOV and MKV files are accepted. The exact result depends on the codecs and whether an audio stream is present."},
   {q:"Are my videos uploaded?",a:"The conversion is performed locally in your browser. The site does not maintain a permanent file library for this tool."}
  ],
  relatedGuides:[]
 },

 "compress-image":{
  metaDescription:"Compress JPG, PNG and WebP images to 100KB, 500KB, 1MB or a custom target size in your browser.",
  keywords:["image compressor","compress image","compress JPG","compress PNG","compress WebP","reduce image size","compress image to 100KB","compress image to 500KB"],
  intro:"A browser-first image compressor for reducing JPG, PNG and WebP files to a smaller target size. Choose a preset such as 100KB or 500KB, or enter your own target, then download the result.",
  sections:[
   {heading:"Compress an image to 100KB, 500KB or a custom size",body:"Target-size compression is useful when a website, application form or email has a file-size limit. Start with a target that is realistic for the image: photographs generally tolerate JPEG/WebP compression better than screenshots or graphics with sharp text."},
   {heading:"JPG vs PNG vs WebP",body:"JPG is usually a practical choice for photographs. PNG preserves sharp edges and transparency but can produce larger files. WebP can often deliver a good balance of size and quality in modern browsers. The best format depends on the image and where you need to use it."},
   {heading:"What happens during compression?",body:"The tool works with the image in the browser and repeatedly adjusts encoding quality and dimensions until it approaches the requested size. A precise byte-for-byte target is not always possible because image codecs work with content-dependent output sizes."}
  ],
  faqs:[
   {q:"Can I compress an image to exactly 100KB?",a:"The tool aims for the requested target, but codec output depends on the image, format and dimensions, so the final file can be slightly above or below the target."},
   {q:"Does image compression change the dimensions?",a:"The tool is designed around file size. Depending on the source and target, quality and encoding settings are adjusted; check the generated file before publishing it."},
   {q:"Are my images uploaded?",a:"This tool is designed for browser-first processing, so the selected image is processed in your browser rather than stored in a permanent file library."}
  ],
  relatedGuides:["compress-image-to-100kb","reduce-jpg-below-500kb"]
 },
 "pdf-to-word":{
  metaDescription:"Convert a PDF to an editable Word DOCX file. Extract selectable PDF text directly in your browser with no account.",
  keywords:["PDF to Word","convert PDF to Word","PDF converter","PDF to DOCX","editable Word from PDF"],
  intro:"Convert a text-based PDF into a Word DOCX file you can edit. This browser-first converter is suited to PDFs with selectable text, where you need to reuse or revise the document in Word.",
  sections:[
   {heading:"PDF to Word works best with selectable text",body:"Text-based PDFs contain characters that can be extracted directly. Scanned PDFs are different: their pages are images, so text extraction may return little or no useful content. For scanned documents, use the scanned-PDF workflow or OCR instead."},
   {heading:"Why formatting can differ",body:"PDF is a fixed-layout format while DOCX is reflowable. Paragraph breaks, columns, fonts, tables and complex positioning may not map perfectly from one format to the other. Always review the DOCX before submitting or sharing it."},
   {heading:"A practical PDF to Word workflow",body:"Choose the source PDF, convert it, open the DOCX in Word or another compatible editor, then check headings, tables, page breaks and special characters. This final review is especially important for contracts, forms and other important documents."}
  ],
  faqs:[
   {q:"Can this convert scanned PDFs to Word?",a:"It is intended primarily for PDFs with selectable text. Image-only scans generally need OCR before their text can become editable."},
   {q:"Will the Word file look exactly like the PDF?",a:"Not always. PDF and DOCX use different layout models, so complex formatting may need manual cleanup."},
   {q:"Do you keep my PDF?",a:"The site is designed as a browser-first utility and does not maintain a permanent uploaded-file library."}
  ],
  relatedGuides:["convert-pdf-to-word-without-losing-text"]
 },
 "pdf-to-docs":{
  metaDescription:"Convert selectable PDF text into a DOCX file that you can open in Google Docs and edit.",
  keywords:["PDF to Google Docs","convert PDF to Google Docs","PDF to DOCX","open PDF in Google Docs","editable PDF"],
  intro:"Create a DOCX copy of a text-based PDF so it can be opened and edited in Google Docs or Microsoft Word.",
  sections:[
   {heading:"PDF to Google Docs: the practical route",body:"Google Docs can work with uploaded documents, but a DOCX intermediate file gives you a predictable editable format. This tool extracts selectable PDF text into DOCX so you can upload the result to Google Drive and open it with Google Docs."},
   {heading:"Check the result before sharing",body:"PDFs are fixed-layout documents, while Docs reflows content. Review headings, tables, lists and page breaks after conversion, especially when the source uses columns or unusual fonts."},
   {heading:"Scanned PDFs need OCR",body:"If the PDF contains photos of pages instead of selectable characters, text extraction may be limited. OCR is the appropriate next step for turning an image-based scan into searchable text."}
  ],
  faqs:[
   {q:"Is the result a real Google Docs file?",a:"The output is DOCX. Upload the DOCX to Google Drive and open it with Google Docs to create an editable Google Docs document."},
   {q:"Will tables and formatting be preserved?",a:"Simple layouts generally convert more predictably than complex multi-column or heavily designed PDFs. Review the output."}
  ],
  relatedGuides:["convert-pdf-to-word-without-losing-text"]
 },
 "word-to-pdf":{
  metaDescription:"Convert a Word DOCX document to a text-based PDF in your browser without creating an account.",
  keywords:["Word to PDF","DOCX to PDF","convert Word to PDF","Word document to PDF","online Word converter"],
  intro:"Convert a DOCX Word document into a text-based PDF for sharing, printing or submitting where a fixed document format is preferred.",
  sections:[
   {heading:"Why convert Word to PDF?",body:"PDF keeps a fixed page layout and is widely used for applications, reports and documents that should look consistent across devices. Converting from DOCX is useful after the editing stage is complete."},
   {heading:"Review fonts, spacing and page breaks",body:"A PDF reflects the document layout at conversion time. Before sending an important file, check page breaks, tables, headers, footers and special characters in the generated PDF."},
   {heading:"Best use cases",body:"Word to PDF is useful for job applications, invoices, assignments, forms, reports and documents that should not shift when opened on a different computer."}
  ],
  faqs:[
   {q:"Can I convert DOCX to PDF without an account?",a:"Yes. The tool is designed for browser-first use and does not require a site account."},
   {q:"Is the output searchable?",a:"The tool creates a text-based PDF, so text can remain selectable/searchable rather than being only an image."}
  ],
  relatedGuides:[]
 },
 "images-to-pdf":{
  metaDescription:"Combine JPG, PNG and other images into one ordered PDF. Select multiple images and create a sequenced PDF in your browser.",
  keywords:["images to PDF","JPG to PDF","photos to PDF","combine images into PDF","multiple images to one PDF","sequenced PDF"],
  intro:"Turn multiple images into one PDF in the order you choose. It is useful for photos, scanned pages, screenshots, receipts and other image-based documents.",
  sections:[
   {heading:"Create a PDF from multiple images",body:"Select the images you need, arrange the sequence, then run the tool to create one PDF. Keeping page order correct is especially important for scanned forms, assignments and multi-page submissions."},
   {heading:"Good source images produce better PDFs",body:"Use clear, correctly oriented source images. Very large photographs can create unnecessarily large PDFs, while tiny or blurry images may remain difficult to read after conversion."},
   {heading:"Common uses for a sequenced PDF",body:"A single PDF is easier to upload to portals, email as one attachment, print and archive than a folder of separate JPG or PNG files."}
  ],
  faqs:[
   {q:"Can I combine many photos into one PDF?",a:"Yes. The tool is designed for multi-image input and keeps the selected sequence."},
   {q:"Can I use screenshots?",a:"Yes. PNG and JPG screenshots are suitable sources for image-to-PDF conversion."}
  ],
  relatedGuides:[]
 },
 "scan-image":{
  metaDescription:"Turn a photo of a document into a clean scanned-style image with grayscale or black-and-white processing.",
  keywords:["scan image","photo to scanned document","image to scan","make image look scanned","document scanner"],
  intro:"Clean up a photographed document and turn it into a scanned-style image. This is useful when you only have a phone photo but need a more document-like result.",
  sections:[
   {heading:"Photo versus scanned-style document",body:"A phone photo can contain shadows, uneven lighting and color casts. Scan-style processing reduces visual distractions and improves the document-like appearance, especially for plain paper."},
   {heading:"When black and white helps",body:"Black-and-white output can make text stand out and can reduce file size. Grayscale can preserve more detail where stamps, signatures or faint marks matter."},
   {heading:"Check the edges and readability",body:"For official submissions, make sure the whole page is visible, text is readable and no important information was clipped before you upload the result."}
  ],
  faqs:[
   {q:"Does this OCR the document?",a:"No. Scan-style processing changes the image appearance; it does not by itself turn the page into editable text."},
   {q:"Can I use a phone photo?",a:"Yes. A clear, well-lit document photo is the intended input."}
  ],
  relatedGuides:["make-a-clean-scanned-pdf"]
 },
 "scan-pdf":{
  metaDescription:"Create a scanned-style image-only PDF from an existing PDF with grayscale or black-and-white processing.",
  keywords:["scan PDF","scanned PDF","make PDF look scanned","image-only PDF","document scan PDF"],
  intro:"Turn a PDF into a scanned-style, image-only PDF. This is useful when you need a page-by-page visual representation rather than the original selectable PDF layer.",
  sections:[
   {heading:"What makes a PDF look scanned?",body:"A scanned-style PDF represents each page as an image. That can make the document behave more like a physical scan, but it also means the original selectable text layer is not preserved in the same way."},
   {heading:"When to choose grayscale or black and white",body:"Grayscale keeps more visual detail; black and white can produce a simpler document appearance and sometimes smaller output. Choose based on stamps, signatures, handwriting and other details you need to retain."},
   {heading:"Important trade-off: image-only means less searchable",body:"Because the pages are rasterized, text may no longer be selectable. Keep the original PDF when you may need searchable text later."}
  ],
  faqs:[
   {q:"Does scan-PDF add OCR?",a:"No. It rasterizes the pages into scan-style images. OCR is a separate task."},
   {q:"Will the output stay as a PDF?",a:"Yes. The result is a new PDF containing rasterized page images."}
  ],
  relatedGuides:["make-a-clean-scanned-pdf"]
 },
 "edit-pdf":{
  metaDescription:"Edit a PDF online by adding text, rotating pages or deleting pages in your browser.",
  keywords:["edit PDF online","PDF editor","add text to PDF","rotate PDF pages","delete PDF pages"],
  intro:"Make simple PDF changes directly in your browser: add text, rotate pages or delete pages, then download the edited document.",
  sections:[
   {heading:"What this PDF editor is designed for",body:"The editor focuses on common structural and annotation-style tasks rather than full desktop-publishing replacement. It is useful for quick fixes such as removing a page, correcting orientation or adding a short text note."},
   {heading:"Review the final PDF",body:"After editing, open the generated file and verify page count, orientation, text placement and any pages you deleted. Important documents should always be reviewed before submission."},
   {heading:"When a different workflow is better",body:"For complex layout reconstruction, advanced form fields or full visual design, a dedicated desktop PDF editor may be more appropriate."}
  ],
  faqs:[
   {q:"Can I edit existing PDF paragraphs?",a:"This tool is intended for simple edits such as adding text, rotating pages and deleting pages rather than rewriting arbitrary existing PDF text."},
   {q:"Can I remove a page?",a:"Yes. The editor supports page deletion."}
  ],
  relatedGuides:[]
 },
 "ats-resume-score":{
  metaDescription:"Check an ATS resume score for PDF or DOCX resumes. Review ATS readability, sections, impact and job-keyword alignment.",
  keywords:["ATS resume checker","ATS score checker","resume ATS score","ATS resume score","resume scanner","resume keyword match"],
  intro:"Analyze a PDF or DOCX resume for ATS readability, contact details, sections, measurable impact and alignment with a target job description.",
  sections:[
   {heading:"What this ATS score means",body:"This is a transparent heuristic score, not a score from a proprietary recruiting system. It checks practical resume signals such as readable text, standard sections, contact information, achievement-oriented language and job-description keyword overlap."},
   {heading:"Why keywords matter",body:"A resume should reflect the skills and terminology that genuinely match the role. Compare the job description with your real experience and use relevant terms naturally rather than repeating keywords without evidence."},
   {heading:"Use the report as a review checklist",body:"A strong score does not guarantee an interview. Use the recommendations to improve clarity, evidence, formatting and relevance, then review the resume as a human reader would."}
  ],
  faqs:[
   {q:"Is this the same score used by ATS vendors?",a:"No. It is a transparent heuristic analysis and should be treated as a review aid, not a vendor's proprietary score."},
   {q:"Can I compare my resume with a job description?",a:"Yes. Paste the target job description to add a job-keyword alignment component to the analysis."},
   {q:"Does the checker upload my resume?",a:"The tool is designed for browser-first processing of the selected PDF or DOCX rather than maintaining a permanent file library."}
  ],
  relatedGuides:["how-ats-resume-scanners-work","improve-ats-resume-score"]
 }
};

function generic(t:Tool):ToolSeo{
 const categoryName=t.category==="image"?"image files":t.category==="pdf"?"PDF documents":t.category==="career"?"job applications":t.category==="calc"?"calculations":t.category==="convert"?"unit and time conversions":t.category==="text"?"text and developer tasks":"everyday utility tasks";
 const lead=t.description.replace(/\s+/g," ").trim();
 return {
  metaDescription:lead,
  keywords:[t.name,...t.name.toLowerCase().split(/\s+/).filter(Boolean)],
  intro:lead+" This focused browser-first tool is designed for quick results without an account.",
  sections:[
   {heading:"How to use "+t.name,body:"Start with the input shown above, choose the available options, run the tool and review the result before downloading or sharing it. The workflow is intentionally focused on one task."},
   {heading:"Common uses",body:"This tool is useful for "+t.uses.join(", ").toLowerCase()+". Use the result as a practical output and verify important information when accuracy matters."},
   {heading:"Browser-first processing",body:"Where practical, file processing happens in the browser instead of being stored in a permanent file library. Tools that require an external provider identify that behavior in their interface and privacy information."}
  ],
  faqs:[
   {q:"Do I need an account?",a:"No account is required to use the public tool interface."},
   {q:"What should I check before using the result?",a:"Review the generated output and verify important results before submitting, publishing or relying on them."}
  ],
  relatedGuides:[]
 };
}

export function getToolSeo(t:Tool){return custom[t.slug]??generic(t);}
