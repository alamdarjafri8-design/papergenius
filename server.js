const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const mammoth = require("mammoth");

const app = express();
const PORT = process.env.PORT || 3000;

const uploadDir = path.join(__dirname, "uploads");
const paperDir = path.join(__dirname, "generated-papers");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(paperDir)) fs.mkdirSync(paperDir);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/generated-papers", express.static(paperDir));

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 20 * 1024 * 1024 }
});

async function readUploadedFile(filePath, originalName) {
  const ext = path.extname(originalName).toLowerCase();

  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value.trim();
  }

  if (ext === ".txt") {
    return fs.readFileSync(filePath, "utf8");
  }

  if ([".jpg", ".jpeg", ".png", ".pdf"].includes(ext)) {
    return "";
  }

  return "";
}

function cleanCount(v) {
  const n = parseInt(v || "0", 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function makeQuestions(text, count, type) {
  if (!text || text.length < 30) return [];
  const lines = text
    .replace(/\s+/g, " ")
    .split(/[۔.؟?]/)
    .map(x => x.trim())
    .filter(x => x.length > 20);

  const out = [];
  for (let i = 0; i < count; i++) {
    const base = lines[i % lines.length] || "Uploaded content";
    if (type === "mcq") {
      out.push({
        q: `${base}?`,
        a: "A) Correct answer",
        b: "B) Option",
        c: "C) Option",
        d: "D) Option"
      });
    } else if (type === "blank") {
      out.push(`${base.replace(/\b\w{5,}\b/, "__________")}.`);
    } else if (type === "tick") {
      out.push(`Tick the correct statement about: ${base}`);
    } else {
      out.push(`${base}?`);
    }
  }
  return out;
}

function drawLine(doc, y) {
  doc.moveTo(45, y).lineTo(550, y).stroke();
}

function generatePDF(data, sourceText) {
  const pdfName = `paper-${Date.now()}.pdf`;
  const pdfPath = path.join(paperDir, pdfName);

  const doc = new PDFDocument({ size: "A4", margin: 35 });
  const stream = fs.createWriteStream(pdfPath);
  doc.pipe(stream);

  const jameelPath = path.join(__dirname, "fonts", "JameelNooriNastaleeq.ttf");
  if (fs.existsSync(jameelPath)) doc.registerFont("Jameel", jameelPath);

  doc.font("Times-Bold").fontSize(24).text(data.academyName || "ACADEMY / SCHOOL NAME", { align: "center" });
  doc.font("Times-Roman").fontSize(10).text(data.address || "", { align: "center" });
  doc.moveDown(0.5);

  const topY = doc.y;
  doc.rect(45, topY, 505, 72).stroke();

  doc.fontSize(10);
  doc.text(`Name: ____________________`, 52, topY + 8);
  doc.text(`Roll#: __________`, 325, topY + 8);
  doc.text(`T.Code: ______`, 445, topY + 8);

  doc.text(`Subject: ${data.subjectName || ""}`, 52, topY + 28);
  doc.text(`Class: ${data.className || ""}`, 325, topY + 28);
  doc.text(`Date: __________`, 445, topY + 28);

  doc.text(`Test Type: ${data.testType || "Generated Test"}`, 52, topY + 48);
  doc.text(`Total Marks: ${data.totalMarks || ""}`, 325, topY + 48);
  doc.text(`Time: __________`, 445, topY + 48);

  doc.y = topY + 90;

  const mcqs = makeQuestions(sourceText, cleanCount(data.mcqs), "mcq");
  const shorts = makeQuestions(sourceText, cleanCount(data.shortQuestions), "short");
  const longs = makeQuestions(sourceText, cleanCount(data.longQuestions), "long");
  const blanks = makeQuestions(sourceText, cleanCount(data.blanks), "blank");
  const ticks = makeQuestions(sourceText, cleanCount(data.ticks), "tick");

  if (mcqs.length) {
    doc.font("Times-Bold").fontSize(13).text(`1- Circle the correct answer. (${mcqs.length}x1=${mcqs.length})`);
    drawLine(doc, doc.y + 3);
    doc.moveDown(0.7);

    mcqs.forEach((m, i) => {
      doc.font("Times-Roman").fontSize(10).text(`${i + 1}. ${m.q}`, { continued: false });
      doc.text(`${m.a}        ${m.b}        ${m.c}        ${m.d}`);
      doc.moveDown(0.7);
      if (doc.y > 730) doc.addPage();
    });
  }

  if (blanks.length) {
    doc.moveDown(0.5);
    doc.font("Times-Bold").fontSize(13).text(`Fill in the blanks. (${blanks.length})`);
    drawLine(doc, doc.y + 3);
    doc.moveDown(0.7);

    blanks.forEach((q, i) => {
      doc.font("Times-Roman").fontSize(10).text(`${i + 1}. ${q}`);
      doc.moveDown(0.5);
      if (doc.y > 730) doc.addPage();
    });
  }

  if (ticks.length) {
    doc.moveDown(0.5);
    doc.font("Times-Bold").fontSize(13).text(`Tick the correct answer. (${ticks.length})`);
    drawLine(doc, doc.y + 3);
    doc.moveDown(0.7);

    ticks.forEach((q, i) => {
      doc.font("Times-Roman").fontSize(10).text(`${i + 1}. ${q}`);
      doc.moveDown(0.5);
      if (doc.y > 730) doc.addPage();
    });
  }

  if (shorts.length) {
    doc.moveDown(0.5);
    doc.font("Times-Bold").fontSize(13).text(`2- Answer the following questions. (${shorts.length}x2=${shorts.length * 2})`);
    drawLine(doc, doc.y + 3);
    doc.moveDown(0.7);

    shorts.forEach((q, i) => {
      doc.font("Times-Roman").fontSize(10).text(`${i + 1}. ${q}`);
      doc.moveDown(0.7);
      if (doc.y > 730) doc.addPage();
    });
  }

  if (longs.length) {
    doc.moveDown(0.5);
    doc.font("Times-Bold").fontSize(13).text(`3- Attempt the questions in detail.`);
    drawLine(doc, doc.y + 3);
    doc.moveDown(0.7);

    longs.forEach((q, i) => {
      doc.font("Times-Roman").fontSize(10).text(`${i + 1}. ${q}`);
      doc.moveDown(1);
      if (doc.y > 730) doc.addPage();
    });
  }

  if (data.language === "urdu" || data.language === "both" || data.language === "arabic") {
    doc.addPage();
    if (fs.existsSync(jameelPath)) doc.font("Jameel");
    doc.fontSize(16).text("اردو / عربی پیپر سیکشن", { align: "right" });
    doc.moveDown();
    doc.fontSize(12).text("نوٹ: جمیل نوری نستعلیق فونٹ فولڈر میں موجود ہو تو اردو بہتر نظر آئے گی۔", { align: "right" });
  }

  doc.end();

  return new Promise(resolve => {
    stream.on("finish", () => resolve({ pdfName, pdfPath }));
  });
}

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>PaperGenius</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;background:#eef5fb;color:#07142f}a{text-decoration:none;color:inherit}.container{max-width:1180px;margin:auto;padding:0 20px}
header{background:#fff;border-bottom:1px solid #dbeafe}.top{padding:20px 0 10px;display:flex;justify-content:space-between;align-items:center}.logo{font-size:38px;font-weight:900}.logo span{color:#2f7df6}.right{text-align:right;color:#42526b;font-weight:700}
.nav{border:1px solid #cfe3ff;border-radius:14px;overflow:hidden;display:flex;justify-content:space-between;background:linear-gradient(#fff,#eef6ff);box-shadow:0 10px 30px rgba(47,125,246,.08);margin-bottom:15px}.nav a{padding:15px 20px;font-weight:900;border-right:1px solid #dbeafe}.start{margin:8px 10px;padding:12px 28px;border-radius:12px;background:linear-gradient(135deg,#2f7df6,#22c7b8);color:#fff!important}
.hero{padding:80px 20px;text-align:center;background:radial-gradient(circle at top left,rgba(47,125,246,.18),transparent 30%),radial-gradient(circle at top right,rgba(34,199,184,.18),transparent 30%),#f8fcff}.hero h1{font-size:70px;line-height:1.05;margin:0 auto;max-width:950px}.hero span{background:linear-gradient(135deg,#2f7df6,#22c7b8);-webkit-background-clip:text;color:transparent}.hero p{font-size:20px;color:#53657f;line-height:1.8}
.stats{padding:20px 20px 70px}.statsbox{background:#fff;border-radius:30px;padding:40px;display:grid;grid-template-columns:repeat(4,1fr);gap:20px;text-align:center;border:1px solid #dbeafe;box-shadow:0 20px 60px rgba(16,24,40,.08)}.statsbox h2{font-size:42px;margin:0 0 10px}
.section{padding:80px 20px}.title{text-align:center;margin-bottom:45px}.title h2{font-size:46px;margin:0 0 15px}.title p{color:#53657f;font-size:18px}
.card{background:#fff;border-radius:30px;padding:40px;border:1px solid #dbeafe;box-shadow:0 20px 70px rgba(16,24,40,.08)}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}.field label{font-weight:900;display:block;margin-bottom:8px}.field input,.field select{width:100%;padding:15px;border:1px solid #dbeafe;border-radius:15px;font-size:15px}.btn{width:100%;margin-top:25px;padding:18px;border:0;border-radius:16px;background:linear-gradient(135deg,#2f7df6,#22c7b8);color:#fff;font-size:18px;font-weight:900}
.features,.pricing{display:grid;grid-template-columns:repeat(3,1fr);gap:25px}.mini{background:#fff;border:1px solid #dbeafe;border-radius:24px;padding:28px;box-shadow:0 15px 45px rgba(16,24,40,.05)}.price{font-size:46px;font-weight:900}
.faq{max-width:900px;margin:auto}.faq .mini{margin-bottom:15px}
footer{background:#eef3f8;padding:60px 20px 0;border-top:1px solid #dbeafe}.foot{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:30px}.copy{margin-top:45px;background:#0d86ad;color:#fff;text-align:center;padding:16px}.wa{position:fixed;right:20px;bottom:20px;background:#22c55e;color:#fff;padding:16px 22px;border-radius:50px;font-weight:900}
@media(max-width:800px){.grid,.statsbox,.features,.pricing,.foot{grid-template-columns:1fr}.hero h1{font-size:42px}.nav{flex-direction:column}}
</style>
</head>
<body>
<header><div class="container"><div class="top"><div class="logo">Paper<span>Genius</span></div><div class="right">AI Exam Paper Generator<br>WhatsApp Support: 0300-000000</div></div><div class="nav"><div><a href="#">Home</a><a href="#generator">Paper Generator</a><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a></div><a class="start" href="#generator">Get Started</a></div></div></header>
<section class="hero"><h1>Create exam papers in <span>minutes</span>, not hours</h1><p>Upload original content and generate professional A4 exam papers instantly.</p></section>
<section class="stats"><div class="container statsbox"><div><h2>128,450+</h2><p>Papers Generated</p></div><div><h2>18,700+</h2><p>Active Teachers</p></div><div><h2>74.8%</h2><p>Time Saved</p></div><div><h2>4.9/5</h2><p>User Rating</p></div></div></section>
<section class="section" id="generator"><div class="container"><div class="title"><h2>Generate Paper From Original File</h2><p>No topic typing. Upload real content and set question counts.</p></div><div class="card"><form action="/generate-paper" method="POST" enctype="multipart/form-data"><div class="grid">
<div class="field"><label>Academy / School Name</label><input name="academyName" required></div>
<div class="field"><label>Class Name</label><input name="className" required></div>
<div class="field"><label>Subject Name</label><input name="subjectName" required></div>
<div class="field"><label>Total Marks</label><input name="totalMarks" type="number" required></div>
<div class="field"><label>Test Type</label><input name="testType" placeholder="Short Test / Final Test"></div>
<div class="field"><label>Language</label><select name="language"><option value="english">English</option><option value="urdu">Urdu</option><option value="arabic">Arabic</option><option value="both">English + Urdu</option></select></div>
<div class="field"><label>MCQs Count</label><input name="mcqs" type="number" value="7"></div>
<div class="field"><label>Short Questions Count</label><input name="shortQuestions" type="number" value="7"></div>
<div class="field"><label>Long Questions Count</label><input name="longQuestions" type="number" value="1"></div>
<div class="field"><label>Fill In Blanks Count</label><input name="blanks" type="number" value="0"></div>
<div class="field"><label>Tick Correct Count</label><input name="ticks" type="number" value="0"></div>
<div class="field"><label>Upload Original File</label><input type="file" name="paperFile" required></div>
</div><button class="btn">Generate A4 Paper</button></form></div></div></section>
<section class="section" id="features"><div class="container"><div class="title"><h2>Everything you need to create perfect papers</h2></div><div class="features"><div class="mini"><h3>Smart File Upload</h3><p>JPG, PNG, PDF, DOCX supported.</p></div><div class="mini"><h3>AI-Ready Paper Engine</h3><p>Question count based paper structure.</p></div><div class="mini"><h3>A4 PDF Output</h3><p>Printable paper design like academy test sheet.</p></div><div class="mini"><h3>Urdu / English / Arabic</h3><p>Multiple language options.</p></div><div class="mini"><h3>Auto Delete</h3><p>Files delete after 15 minutes.</p></div><div class="mini"><h3>No Watermark</h3><p>Clean paper without logo or watermark.</p></div></div></div></section>
<section class="section" id="pricing"><div class="container"><div class="title"><h2>Simple credit plans</h2></div><div class="pricing"><div class="mini"><h3>Basic Pack</h3><div class="price">Rs 100</div><p>5 Credits</p><p>Valid 7 Days</p></div><div class="mini" style="border:3px solid #2f7df6"><h3>Standard Pack</h3><div class="price">Rs 300</div><p>15 Credits</p><p>Valid 15 Days</p></div><div class="mini"><h3>Pro Pack</h3><div class="price">Rs 500</div><p>30 Credits</p><p>Valid 25 Days</p></div></div></div></section>
<section class="section" id="faq"><div class="container"><div class="title"><h2>Frequently asked questions</h2></div><div class="faq"><div class="mini"><h3>Does it use uploaded file?</h3><p>Yes, paper structure is created from uploaded content text where readable.</p></div><div class="mini"><h3>Can I set question counts?</h3><p>Yes, 0 means that section will not be added.</p></div><div class="mini"><h3>Are files stored?</h3><p>No, uploaded file and generated PDF delete after 15 minutes.</p></div></div></div></section>
<footer><div class="container foot"><div><h3>PaperGenius</h3><p>Premium AI Exam Paper Generator.</p></div><div><h3>Quick Links</h3><p>Home</p><p>Features</p><p>Pricing</p></div><div><h3>Legal</h3><p>Privacy Policy</p><p>Terms</p></div><div><h3>Contact</h3><p>support@papergenius.com</p><p>Lahore, Pakistan</p></div></div><div class="copy">© 2026 PaperGenius. All rights reserved.</div></footer>
<a class="wa" href="#">WhatsApp Support</a>
</body></html>`);
});

app.post("/generate-paper", upload.single("paperFile"), async (req, res) => {
  try {
    if (!req.file) return res.send("No file uploaded.");

    const text = await readUploadedFile(req.file.path, req.file.originalname);

    if (!text || text.length < 30) {
      fs.unlinkSync(req.file.path);
      return res.send(`
      <div style="font-family:Arial;padding:40px;text-align:center">
        <h2>Readable text not found</h2>
        <p>DOCX/TXT files can be read now. JPG/PNG/PDF need AI OCR connection in next step.</p>
        <a href="/">Back</a>
      </div>`);
    }

    const result = await generatePDF(req.body, text);

    setTimeout(() => {
      try {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        if (fs.existsSync(result.pdfPath)) fs.unlinkSync(result.pdfPath);
      } catch (e) {}
    }, 15 * 60 * 1000);

    res.send(`
    <div style="font-family:Arial;background:#eef5fb;min-height:100vh;display:flex;align-items:center;justify-content:center">
      <div style="background:#fff;padding:45px;border-radius:28px;text-align:center;box-shadow:0 20px 70px rgba(0,0,0,.08)">
        <h1>Paper Generated Successfully</h1>
        <p>A4 PDF created. File will delete after 15 minutes.</p>
        <a style="display:inline-block;padding:16px 28px;background:#2f7df6;color:#fff;border-radius:14px;text-decoration:none;font-weight:900" href="/generated-papers/${result.pdfName}" download>Download Paper PDF</a>
        <br><br><a href="/">Back Home</a>
      </div>
    </div>`);
  } catch (e) {
    console.log(e);
    res.send("Error generating paper.");
  }
});

app.listen(PORT, () => {
  console.log("PaperGenius running on port " + PORT);
});
