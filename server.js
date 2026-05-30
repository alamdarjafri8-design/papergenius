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

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use("/generated-papers", express.static(paperDir));

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 25 * 1024 * 1024 }
});

function count(v) {
  const n = parseInt(v || "0", 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

async function readFileText(file) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ path: file.path });
    return result.value || "";
  }

  if (ext === ".txt") {
    return fs.readFileSync(file.path, "utf8");
  }

  return "";
}

function splitText(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/[۔.؟?!]/)
    .map(x => x.trim())
    .filter(x => x.length > 15);
}

function getLine(lines, i) {
  return lines[i % lines.length] || "Question from uploaded document";
}
function romanNo(num) {
  const arr = ["i","ii","iii","iv","v","vi","vii","viii","ix","x"];
  return arr[num - 1] || num;
}
function translateToUrdu(text) {
  return text
    .replaceAll("Physics Chapter 10 - Simple Harmonic Motion", "فزکس باب 10 - سادہ ارتعاشی حرکت")
    .replaceAll("Simple harmonic motion", "سادہ ارتعاشی حرکت")
    .replaceAll("The SI unit of force is Newton", "قوت کی بین الاقوامی اکائی نیوٹن ہے")
    .replaceAll("time period", "دوری وقت")
    .replaceAll("simple pendulum", "سادہ پنڈولم")
    .replaceAll("depends upon its length", "اپنی لمبائی پر منحصر ہوتا ہے")
    .replaceAll("Wave motion transfers energy", "موجی حرکت توانائی منتقل کرتی ہے")
    .replaceAll("frequency", "فریکوئنسی")
    .replaceAll("Hertz", "ہرٹز")
    .replaceAll("force", "قوت")
    .replaceAll("wave", "موج")
    .replaceAll("motion", "حرکت")
    .replaceAll("energy", "توانائی");
}
function makePdf(data, sourceText) {
  return new Promise((resolve, reject) => {
    const pdfName = "papergenius-paper-" + Date.now() + ".pdf";
    const pdfPath = path.join(paperDir, pdfName);

    const doc = new PDFDocument({ size: "A4", margin: 25 });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    const urduFontPath = path.join(__dirname, "Jameel Noori Nastaleeq.ttf");
if (fs.existsSync(urduFontPath)) {
  doc.registerFont("UrduFont", urduFontPath);
}
    if (fs.existsSync(urduFontPath)) {
      doc.registerFont("UrduFont", urduFontPath);
    }

    const lines = splitText(sourceText);

    const pageW = 595.28;
    const pageH = 841.89;
    const left = 35;
    const right = 560;
    const width = right - left;

    function cleanLine(i) {
      return getLine(lines, i).replace(/\s+/g, " ").trim();
    }

    function useEnglishFont(size = 11.5, bold = false) {
      doc.font(bold ? "Times-Bold" : "Times-Roman").fontSize(size);
    }

    function useUrduFont(size = 13) {
      if (fs.existsSync(urduFontPath)) {
        doc.font("UrduFont").fontSize(size);
      } else {
        doc.font("Times-Roman").fontSize(size);
      }
    }

    function addBorder() {
      doc.lineWidth(1);
      doc.rect(25, 25, pageW - 50, pageH - 50).stroke();
      doc.rect(31, 31, pageW - 62, pageH - 62).stroke();
    }

    function checkPage(h = 80) {
      if (doc.y + h > 790) {
        doc.addPage();
        addBorder();
        doc.y = 45;
      }
    }

    function cell(x, y, w, h, text, opt = {}) {
      doc.rect(x, y, w, h).stroke();

      if (opt.urdu) {
        useUrduFont(opt.size || 13);
      } else {
        useEnglishFont(opt.size || 11.5, opt.bold || false);
      }

      doc.text(text || "", x + 5, y + 6, {
        width: w - 10,
        height: h - 10,
        align: opt.align || "left"
      });
    }

    function sectionBar(y, qNo, engTitle, marks, urduTitle) {
      cell(left, y, 55, 26, qNo, { bold: true, size: 12, align: "center" });
      cell(left + 55, y, 245, 26, engTitle, { bold: true, size: 12 });
      cell(left + 300, y, 80, 26, marks, { bold: true, size: 12, align: "center" });
      cell(left + 380, y, 145, 26, urduTitle, { urdu: true, size: 13, align: "right" });
      doc.y = y + 30;
    }

    addBorder();

    useEnglishFont(24, true);
    doc.text((data.academyName || "SCHOOL / ACADEMY NAME").toUpperCase(), left, 42, {
      width,
      align: "center"
    });

    useEnglishFont(11);
    doc.text("Exam Paper", left, 70, {
      width,
      align: "center"
    });

    const hy = 95;

    cell(left, hy, 130, 32, "Test # " + (data.testType || ""), { bold: true, size: 11.5 });
    cell(left + 130, hy, 180, 32, data.subjectName || "Subject", { bold: true, size: 12.5, align: "center" });
    cell(left + 310, hy, 215, 32, "Chapter / Syllabus: " + (data.syllabus || ""), { bold: true, size: 11.5 });

    cell(left, hy + 32, 130, 28, "Time: ________", { size: 11.5 });
    cell(left + 130, hy + 32, 180, 28, "Class: " + (data.className || ""), { bold: true, size: 11.5, align: "center" });
    cell(left + 310, hy + 32, 215, 28, "Date: ______ / ______ / ______", { size: 11.5 });

    cell(left, hy + 60, 275, 28, "Student Name", { bold: true, size: 11.5 });
    cell(left + 275, hy + 60, 125, 28, "Roll No", { bold: true, size: 11.5, align: "center" });
    cell(left + 400, hy + 60, 125, 28, "Total Marks: " + (data.totalMarks || ""), { bold: true, size: 11.5 });

    const mcqs = count(data.mcqs);
    const shorts = count(data.shortQuestions);
    const longs = count(data.longQuestions);
    const blanks = count(data.blanks);
    const ticks = count(data.ticks);

    let y = hy + 100;

    if (mcqs > 0) {
      useEnglishFont(11.5, true);
      doc.text("Four possible answers A, B, C and D are given. Tick the correct option.", left, y, { width });
      y += 24;

      sectionBar(y, "Q.1", "Choose the correct answer", `1 x ${mcqs} = ${mcqs}`, "درست جواب منتخب کریں");
      y = doc.y;

      const rowH = 48;
      const optH = 20;

      for (let i = 0; i < mcqs; i++) {
        checkPage(rowH + optH + 10);
        y = doc.y;

        const q = cleanLine(i);
        const a = cleanLine(i + 1).slice(0, 22);
        const b = cleanLine(i + 2).slice(0, 22);
        const c = cleanLine(i + 3).slice(0, 22);
        const d = cleanLine(i + 4).slice(0, 22);

        cell(left, y, 25, rowH, `${i + 1})`, { bold: true, align: "center", size: 11 });
        cell(left + 25, y, 255, rowH, q + "?", { size: 11.5 });

        cell(left + 280, y, 220, rowH, translateToUrdu(q), {
          urdu: true,
          size: 13,
          align: "right"
        });

        cell(left + 500, y, 25, rowH, `(${i + 1})`, { bold: true, align: "center", size: 11 });

        y += rowH;

        cell(left, y, 25, optH, "A", { bold: true, align: "center", size: 10.5 });
        cell(left + 25, y, 105, optH, a, { align: "center", size: 10.5 });

        cell(left + 130, y, 25, optH, "B", { bold: true, align: "center", size: 10.5 });
        cell(left + 155, y, 105, optH, b, { align: "center", size: 10.5 });

        cell(left + 260, y, 25, optH, "C", { bold: true, align: "center", size: 10.5 });
        cell(left + 285, y, 105, optH, c, { align: "center", size: 10.5 });

        cell(left + 390, y, 25, optH, "D", { bold: true, align: "center", size: 10.5 });
        cell(left + 415, y, 110, optH, d, { align: "center", size: 10.5 });

        doc.y = y + optH;
      }
    }

    if (blanks > 0) {
      checkPage(50);
      y = doc.y + 10;
      sectionBar(y, "Q.2", "Fill in the blanks", `${blanks} Marks`, "خالی جگہ پر کریں");

      for (let i = 0; i < blanks; i++) {
        checkPage(34);
        y = doc.y;

        cell(left, y, 35, 30, `${i + 1})`, { bold: true, align: "center", size: 11 });
        cell(left + 35, y, 490, 30, cleanLine(i + 10).slice(0, 80) + " ____________", { size: 11.5 });

        doc.y = y + 30;
      }
    }

    if (ticks > 0) {
      checkPage(50);
      y = doc.y + 10;
      sectionBar(y, "Q.3", "Tick correct statement", `${ticks} Marks`, "درست / غلط");

      for (let i = 0; i < ticks; i++) {
        checkPage(34);
        y = doc.y;

        cell(left, y, 35, 30, `${i + 1})`, { bold: true, align: "center", size: 11 });
        cell(left + 35, y, 370, 30, cleanLine(i + 20) + ".", { size: 11.5 });
        cell(left + 405, y, 120, 30, "True / False", { bold: true, align: "center", size: 11.5 });

        doc.y = y + 30;
      }
    }

    if (shorts > 0) {
      checkPage(55);
      y = doc.y + 12;
      sectionBar(y, "Q.4", "Short answer questions", `2 x ${shorts} = ${shorts * 2}`, "مختصر جوابات لکھیں");

      for (let i = 0; i < shorts; i++) {
        checkPage(42);
        y = doc.y;

        cell(left, y, 35, 38, `${romanNo(i + 1)})`, { bold: true, align: "center", size: 11 });
        cell(left + 35, y, 250, 38, cleanLine(i + 30) + "?", { size: 11.5 });
        cell(left + 285, y, 240, 38, "اس سوال کا مختصر جواب لکھیں۔", {
          urdu: true,
          size: 13,
          align: "right"
        });

        doc.y = y + 38;
      }
    }

    if (longs > 0) {
      checkPage(55);
      y = doc.y + 12;
      sectionBar(y, "Q.5", "Long answer questions", `4 x ${longs} = ${longs * 4}`, "تفصیلی جوابات لکھیں");

      for (let i = 0; i < longs; i++) {
        checkPage(60);
        y = doc.y;

        cell(left, y, 35, 55, `${String.fromCharCode(97 + i)})`, { bold: true, align: "center", size: 11 });
        cell(left + 35, y, 250, 55, "Explain in detail: " + cleanLine(i + 45) + ".", { size: 11.5 });
        cell(left + 285, y, 240, 55, "درج ذیل سوال کا تفصیلی جواب لکھیں۔", {
          urdu: true,
          size: 13,
          align: "right"
        });

        doc.y = y + 55;
      }
    }

    checkPage(40);
    doc.moveDown(1);
    useEnglishFont(14, true);
    doc.text("Best of Luck", left, doc.y, { width, align: "center" });

    doc.end();

    stream.on("finish", () => resolve({ pdfName, pdfPath }));
    stream.on("error", reject);
  });
}
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PaperGenius - AI Exam Paper Generator</title>
<style>
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:Arial,sans-serif;background:#f6fbff;color:#07142f}
a{text-decoration:none;color:inherit}
.pg-shell{max-width:1180px;margin:auto;padding:0 18px}
.pg-top{background:linear-gradient(180deg,#eef8ff,#ffffff);border-bottom:1px solid #dbeafe}
.pg-logo-area{max-width:1180px;margin:auto;padding:18px 18px 10px;display:flex;align-items:center;justify-content:space-between}
.logo{font-size:30px;font-weight:950;letter-spacing:-1px}
.logo span{color:#2f7df6}
.pg-contact{text-align:right;font-size:13px;color:#42526b;line-height:1.6;font-weight:700}
.pg-nav-wrap{max-width:1180px;margin:auto;padding:0 18px 14px}
.pg-nav{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(180deg,#fff,#eef6ff);border:1px solid #cfe3ff;border-radius:12px;overflow:hidden;box-shadow:0 12px 30px rgba(47,125,246,.10)}
.pg-menu{display:flex;flex-wrap:wrap}
.pg-menu a{padding:13px 18px;font-size:14px;font-weight:900;border-right:1px solid #dbeafe}
.pg-menu a:hover{background:#e8f2ff;color:#2f7df6}
.pg-start{margin-right:8px;padding:10px 18px;border-radius:10px;background:linear-gradient(135deg,#2f7df6,#22c7b8);color:#fff;font-weight:950;box-shadow:0 10px 25px rgba(47,125,246,.25)}
.hero{position:relative;overflow:hidden;padding:90px 18px 50px;text-align:center;background:radial-gradient(circle at 20% 10%,rgba(47,125,246,.20),transparent 28%),radial-gradient(circle at 80% 0%,rgba(34,199,184,.18),transparent 28%),linear-gradient(180deg,#ffffff,#f4faff)}
.hero h1{max-width:900px;margin:0 auto 20px;font-size:clamp(42px,6vw,78px);line-height:1.03;letter-spacing:-3px}
.hero h1 span{background:linear-gradient(135deg,#2f7df6,#22c7b8);-webkit-background-clip:text;color:transparent}
.hero p{max-width:760px;margin:auto;font-size:19px;line-height:1.75;color:#53657f}
.hero-actions{margin-top:32px;display:flex;justify-content:center;gap:14px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;justify-content:center;padding:14px 24px;border-radius:14px;font-weight:950;border:0;cursor:pointer}
.btn-main{color:#fff;background:linear-gradient(135deg,#2f7df6,#22c7b8);box-shadow:0 18px 35px rgba(47,125,246,.25)}
.btn-light{background:#fff;border:1px solid #d7e6ff;color:#07142f}
.stats{padding:26px 18px 70px;background:#f4faff}
.stats-box{max-width:1000px;margin:auto;padding:30px;border-radius:26px;background:rgba(255,255,255,.76);border:1px solid rgba(207,227,255,.9);box-shadow:0 25px 70px rgba(16,24,40,.08);backdrop-filter:blur(16px);display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.stat{text-align:center}
.stat b{font-size:34px;color:#07142f;letter-spacing:-1px}
.stat span{display:block;margin-top:6px;color:#53657f;font-weight:700}
.section{padding:82px 18px}
.section-title{text-align:center;max-width:780px;margin:0 auto 42px}
.badge{display:inline-flex;padding:8px 16px;border-radius:50px;background:#eaf3ff;color:#2f7df6;font-weight:950;font-size:13px}
.section-title h2{font-size:clamp(30px,4vw,48px);margin:14px 0 12px;letter-spacing:-1.5px}
.section-title p{color:#53657f;line-height:1.7;font-size:16px}
.generator{background:linear-gradient(180deg,#f4faff,#ffffff)}
.gen-card{max-width:1040px;margin:auto;border-radius:30px;padding:34px;background:linear-gradient(180deg,rgba(255,255,255,.92),rgba(255,255,255,.78));border:1px solid #dbeafe;box-shadow:0 30px 80px rgba(16,24,40,.10)}
.gen-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.field label{display:block;font-weight:950;margin-bottom:8px}
.field select,.field input{width:100%;padding:15px;border-radius:16px;border:1px solid #d7e6ff;outline:none;font-size:15px;background:#fff}
.feature-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.feature-card{padding:28px;border-radius:26px;background:linear-gradient(180deg,#ffffff,#f8fbff);border:1px solid #dbeafe;box-shadow:0 18px 45px rgba(16,24,40,.06);transition:.25s ease}
.feature-card:hover{transform:translateY(-6px);box-shadow:0 25px 70px rgba(47,125,246,.14)}
.icon{width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,#eaf3ff,#defbf7);display:flex;align-items:center;justify-content:center;font-weight:950;color:#2f7df6;margin-bottom:18px}
.feature-card h3{font-size:21px;margin:0 0 10px}
.feature-card p{color:#53657f;line-height:1.7;margin:0}
.price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.price-card{position:relative;background:#fff;border:1px solid #dbeafe;border-radius:28px;padding:30px;box-shadow:0 22px 60px rgba(16,24,40,.07)}
.price-card.popular{border:2px solid #2f7df6;transform:scale(1.03)}
.pop-badge{position:absolute;top:-18px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#2f7df6,#22c7b8);color:white;padding:9px 20px;border-radius:50px;font-size:12px;font-weight:950}
.amount{font-size:42px;font-weight:950;letter-spacing:-2px}
.valid{display:inline-block;margin:10px 0 22px;padding:6px 10px;border-radius:9px;background:#eef6ff;color:#53657f;font-size:13px;font-weight:800}
.price-card ul{padding:0;list-style:none;line-height:2;color:#42526b;margin:0 0 24px}
.price-card li:before{content:"✓ ";color:#2f7df6;font-weight:950}
.faq-box{max-width:860px;margin:auto;display:grid;gap:15px}
.faq-item{border:1px solid #dbeafe;border-radius:18px;background:linear-gradient(180deg,#fff,#f8fbff);box-shadow:0 12px 32px rgba(16,24,40,.05);overflow:hidden;padding:20px 22px}
.faq-item h3{margin:0 0 8px}
.faq-item p{margin:0;color:#53657f;line-height:1.7}
.footer{background:#eef3f8;border-top:1px solid #dbeafe;padding:55px 18px 0}
.footer-grid{max-width:1180px;margin:auto;display:grid;grid-template-columns:2fr 1fr 1fr 1.5fr;gap:36px}
.footer h3,.footer h4{margin:0 0 16px}
.footer p,.footer a{color:#53657f;line-height:1.8;font-size:14px;display:block}
.footer-line{max-width:1180px;margin:35px auto 0;border-top:1px solid #d5e2f1;padding:22px 0;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;color:#53657f;font-size:14px}
.copy-strip{background:#0d86ad;color:#fff;text-align:center;padding:13px;font-size:13px}
.whatsapp{position:fixed;right:18px;bottom:18px;background:#22c55e;color:#fff;padding:14px 20px;border-radius:50px;font-weight:950;box-shadow:0 18px 35px rgba(34,197,94,.35);z-index:999}
@media(max-width:900px){.stats-box,.feature-grid,.price-grid,.footer-grid{grid-template-columns:1fr 1fr}.pg-logo-area{flex-direction:column;text-align:center;gap:8px}.pg-contact{text-align:center}.pg-nav{flex-direction:column}.pg-menu{justify-content:center}.pg-start{margin:8px}}
@media(max-width:620px){.stats-box,.feature-grid,.price-grid,.footer-grid,.gen-grid{grid-template-columns:1fr}.hero{padding-top:58px}.gen-card{padding:22px}.price-card.popular{transform:none}}
</style>
</head>
<body>
<header class="pg-top">
<div class="pg-logo-area">
<a class="logo" href="#">Paper<span>Genius</span></a>
<div class="pg-contact">AI Exam Paper Generator<br>WhatsApp Support: 0300-0000000</div>
</div>
<div class="pg-nav-wrap">
<nav class="pg-nav">
<div class="pg-menu">
<a href="#">Home</a>
<a href="#generator">Paper Generator</a>
<a href="#features">Features</a>
<a href="#pricing">Pricing</a>
<a href="#faq">FAQ</a>
<a href="#login">Login</a>
<a href="#signup">Signup</a>
<a href="#admin">Admin Login</a>
</div>
<a class="pg-start" href="#generator">Get Started</a>
</nav>
</div>
</header>

<section class="hero">
<h1>Create exam papers in <span>minutes</span>, not hours</h1>
<p>AI-powered paper generator for schools, teachers and academies. Upload your content and create professional exam papers instantly.</p>
<div class="hero-actions">
<a class="btn btn-main" href="#generator">Get Started</a>
<a class="btn btn-light" href="#pricing">View Pricing</a>
</div>
</section>

<section class="stats">
<div class="stats-box">
<div class="stat"><b>128,450+</b><span>Papers Generated</span></div>
<div class="stat"><b>18,700+</b><span>Active Teachers</span></div>
<div class="stat"><b>74.8%</b><span>Time Saved</span></div>
<div class="stat"><b>4.9/5</b><span>User Rating</span></div>
</div>
</section>

<section class="section generator" id="generator">
<div class="section-title">
<span class="badge">Paper Generator</span>
<h2>Generate Paper From Original File</h2>
<p>Upload DOCX or TXT for readable text. JPG/PDF OCR requires API connection in next step.</p>
</div>
<div class="gen-card">
<form action="/generate-paper" method="POST" enctype="multipart/form-data">
<div class="gen-grid">
<div class="field"><label>Academy / School Name</label><input name="academyName" required></div>
<div class="field"><label>Class Name</label><input name="className" required></div>
<div class="field"><label>Subject Name</label><input name="subjectName" required></div>
<div class="field"><label>Total Marks</label><input type="number" name="totalMarks" required></div>
<div class="field"><label>Test Type</label><input name="testType" placeholder="Type 7 - Short Test"></div>
<div class="field"><label>Syllabus</label><input name="syllabus" placeholder="Unit-10"></div>
<div class="field"><label>Language</label><select name="language"><option value="english">English</option><option value="urdu">Urdu</option><option value="arabic">Arabic</option><option value="both">English + Urdu</option></select></div>
<div class="field"><label>MCQs Count</label><input type="number" name="mcqs" value="7"></div>
<div class="field"><label>Short Questions Count</label><input type="number" name="shortQuestions" value="7"></div>
<div class="field"><label>Long Questions Count</label><input type="number" name="longQuestions" value="1"></div>
<div class="field"><label>Fill In Blanks Count</label><input type="number" name="blanks" value="0"></div>
<div class="field"><label>Tick Correct Count</label><input type="number" name="ticks" value="0"></div>
<div class="field"><label>Upload Original File</label><input type="file" name="paperFile" accept=".txt,.docx,.jpg,.jpeg,.png,.pdf" required></div>
</div>
<button class="btn btn-main" type="submit" style="width:100%;margin-top:22px;font-size:16px;">Generate A4 Paper</button>
</form>
</div>
</section>

<section class="section" id="features">
<div class="section-title">
<span class="badge">Features</span>
<h2>Everything you need to create perfect papers</h2>
<p>Powerful features designed specifically for educators, schools and academies.</p>
</div>
<div class="pg-shell feature-grid">
<div class="feature-card"><div class="icon">↑</div><h3>Smart file upload</h3><p>Upload PDF, DOCX, JPG, PNG or TXT files.</p></div>
<div class="feature-card"><div class="icon">AI</div><h3>Paper generation</h3><p>Creates MCQs, short questions, long questions and objective sections.</p></div>
<div class="feature-card"><div class="icon">PDF</div><h3>A4 PDF output</h3><p>Professional exam paper with academy style header.</p></div>
<div class="feature-card"><div class="icon">اردو</div><h3>Urdu / English</h3><p>Urdu, English, Arabic and mixed language options.</p></div>
<div class="feature-card"><div class="icon">₨</div><h3>Credit system ready</h3><p>Pricing structure ready for future login dashboard.</p></div>
<div class="feature-card"><div class="icon">✓</div><h3>Auto-delete safety</h3><p>Uploaded files and generated papers delete after 15 minutes.</p></div>
</div>
</section>

<section class="section" id="pricing">
<div class="section-title">
<span class="badge">Pricing</span>
<h2>Simple credit plans</h2>
<p>Choose a pack and start generating papers quickly.</p>
</div>
<div class="pg-shell price-grid">
<div class="price-card"><h3>Basic Pack</h3><div class="amount">Rs 100</div><span class="valid">Valid for 7 days</span><ul><li>5 Credits</li><li>Upload based generation</li><li>PDF export support</li></ul><a class="btn btn-main" style="width:100%" href="#">Select Basic Pack</a></div>
<div class="price-card popular"><div class="pop-badge">MOST POPULAR</div><h3>Standard Pack</h3><div class="amount">Rs 300</div><span class="valid">Valid for 15 days</span><ul><li>15 Credits</li><li>All paper types</li><li>Best value for teachers</li></ul><a class="btn btn-main" style="width:100%" href="#">Select Standard Pack</a></div>
<div class="price-card"><h3>Pro Pack</h3><div class="amount">Rs 500</div><span class="valid">Valid for 25 days</span><ul><li>30 Credits</li><li>Priority generation</li><li>Premium support</li></ul><a class="btn btn-main" style="width:100%" href="#">Select Pro Pack</a></div>
</div>
</section>

<section class="section" id="faq">
<div class="section-title">
<span class="badge">FAQ</span>
<h2>Frequently asked questions</h2>
<p>Quick answers about PaperGenius.</p>
</div>
<div class="faq-box">
<div class="faq-item"><h3>How does the credit system work?</h3><p>Each generated paper will use credits once dashboard system is connected.</p></div>
<div class="faq-item"><h3>What file formats can I upload?</h3><p>DOCX/TXT are readable now. JPG/PNG/PDF upload works, OCR needs API connection.</p></div>
<div class="faq-item"><h3>Can I edit generated papers?</h3><p>PDF output is generated in A4 paper format. Editable DOCX will be added later.</p></div>
<div class="faq-item"><h3>Is Urdu language supported?</h3><p>Urdu layout section is included. Jameel Noori font file can be added in fonts folder.</p></div>
<div class="faq-item"><h3>Are files stored?</h3><p>No. Uploaded files and generated PDFs auto-delete after 15 minutes.</p></div>
</div>
</section>

<footer class="footer">
<div class="footer-grid">
<div><h3>PaperGenius</h3><p>AI-powered exam paper generator for schools and educators. Create professional papers in minutes.</p></div>
<div><h4>Quick Links</h4><a href="#">Home</a><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#">CV Builder</a><a href="#">Cover Letter</a></div>
<div><h4>Legal</h4><a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Refund Policy</a></div>
<div><h4>Contact</h4><p>0300-0000000</p><p>support@papergenius.com</p><p>Lahore, Pakistan</p></div>
</div>
<div class="footer-line"><span>© 2026 PaperGenius. All rights reserved.</span><span>JazzCash • Easypaisa • Bank Transfer</span></div>
<div class="copy-strip">Premium AI Paper Generator for Teachers, Schools & Academies</div>
</footer>

<a class="whatsapp" href="https://wa.me/923000000000" target="_blank">WhatsApp Support</a>
</body>
</html>`);
});

app.post("/generate-paper", upload.single("paperFile"), async (req, res) => {
  try {
    if (!req.file) return res.send("No file uploaded.");

    const sourceText = await readFileText(req.file);

    if (!sourceText || sourceText.length < 20) {
      try { fs.unlinkSync(req.file.path); } catch(e) {}
      return res.send(`
      <div style="font-family:Arial;background:#eef5fb;min-height:100vh;display:flex;align-items:center;justify-content:center">
        <div style="max-width:650px;background:#fff;padding:45px;border-radius:28px;text-align:center;box-shadow:0 20px 70px rgba(0,0,0,.08)">
          <h1>Readable Text Not Found</h1>
          <p>DOCX/TXT file upload karo. JPG/PNG/PDF OCR ke liye API connection next step mein chahiye.</p>
          <a style="display:inline-block;margin-top:20px;padding:14px 24px;background:#2f7df6;color:#fff;border-radius:14px;text-decoration:none;font-weight:900" href="/">Back Home</a>
        </div>
      </div>`);
    }

    const result = await makePdf(req.body, sourceText);

    setTimeout(() => {
      try {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        if (fs.existsSync(result.pdfPath)) fs.unlinkSync(result.pdfPath);
      } catch (e) {}
    }, 15 * 60 * 1000);

    res.send(`
    <div style="font-family:Arial;background:#eef5fb;min-height:100vh;display:flex;align-items:center;justify-content:center">
      <div style="max-width:650px;background:#fff;padding:45px;border-radius:28px;text-align:center;box-shadow:0 20px 70px rgba(0,0,0,.08)">
        <div style="width:90px;height:90px;border-radius:50%;background:linear-gradient(135deg,#2f7df6,#22c7b8);color:#fff;font-size:46px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px">✓</div>
        <h1>Paper Generated</h1>
        <p>A4 PDF paper generated successfully.</p>
        <p>Uploaded file and generated PDF will auto-delete after 15 minutes.</p>
        <a style="display:inline-block;margin-top:20px;padding:16px 30px;background:linear-gradient(135deg,#2f7df6,#22c7b8);color:#fff;border-radius:14px;text-decoration:none;font-weight:900" href="/generated-papers/${result.pdfName}" download>Download PDF</a>
        <br><br><a href="/">Back Home</a>
      </div>
    </div>`);
  } catch (err) {
    console.log(err);
    res.send("Error generating paper.");
  }
});

app.listen(PORT, () => {
  console.log("PaperGenius running on port " + PORT);
});
