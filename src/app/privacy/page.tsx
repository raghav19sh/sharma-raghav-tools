import Link from "next/link";
const Header=()=> <header className="topbar"><div className="container nav"><Link className="brand" href="/"><span className="mark">SR</span><span>Sharma-Raghav Tools</span></Link><Link href="/">← All tools</Link></div></header>;

export default function Privacy(){return <div className="site"><Header/><main className="container legal"><h1>Privacy</h1><p>Last updated: October 5, 2026</p>
<h2>Privacy by design</h2>
<p>For most image and PDF tools, your selected file is processed locally in your browser on your own device. The file is read by the browser and local JavaScript libraries such as Canvas, PDF.js, pdf-lib, Mammoth and Tesseract.js to create the result. These tools do not upload your selected file to our server for processing, and we do not maintain a permanent file library.</p>
<h2>What “local” means</h2>
<p>Your original image, PDF or Word file stays in the browser session while the tool runs. The generated result is created on your device and downloaded directly from the browser. A normal internet connection is still required to load the website and its JavaScript libraries, and browser extensions, network tools or the browser itself may have their own data practices.</p>
<h2>External processing</h2>
<p>The URL shortener is different: the URL you enter is sent to an external shortening provider because that service must receive the URL to create a short link. Do not use that feature for URLs containing information you do not want to disclose to that provider.</p>
<h2>Advertising</h2>
<p>Google AdSense may be enabled after approval. Advertising providers may use cookies or similar technologies under their own policies and applicable consent requirements. Advertising does not require your uploaded file to be sent to our server for the browser-based file tools.</p>
<h2>Contact</h2>
<p>Questions can be sent to <a href="mailto:contact@sharma-raghav.com">contact@sharma-raghav.com</a>.</p></main></div>
}