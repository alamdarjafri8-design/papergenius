const express = require("express");
const multer = require("multer");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;
const upload = multer({ dest: "uploads/" });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>PaperGenius - AI Exam Paper Generator</title>

<style>
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  margin:0;
  font-family:Inter,Arial,sans-serif;
  color:#07142f;
  background:#f6fbff;
}
a{text-decoration:none;color:inherit}
.pg-shell{max-width:1180px;margin:auto;padding:0 18px}
.pg-top{
  background:linear-gradient(180deg,#eef8ff,#ffffff);
  border-bottom:1px solid #dbeafe;
}
.pg-logo-area{
  max-width:1180px;
  margin:auto;
  padding:18px 18px 10px;
  display:flex;
  align-items:center;
  justify-content:space-between;
}
.logo{
  font-size:30px;
  font-weight:950;
  letter-spacing:-1px;
}
.logo span{color:#2f7df6}
.pg-contact{
  text-align:right;
  font-size:13px;
  color:#42526b;
  line-height:1.6;
  font-weight:700;
}
.pg-nav-wrap{
  max-width:1180px;
  margin:auto;
  padding:0 18px 14px;
}
.pg-nav{
  display:flex;
  align-items:center;
  justify-content:space-between;
  background:linear-gradient(180deg,#fff,#eef6ff);
  border:1px solid #cfe3ff;
  border-radius:12px;
  overflow:hidden;
  box-shadow:0 12px 30px rgba(47,125,246,.10);
}
.pg-menu{display:flex;flex-wrap:wrap}
.pg-menu a{
  padding:13px 18px;
  font-size:14px;
  font-weight:900;
  border-right:1px solid #dbeafe;
}
.pg-menu a:hover{background:#e8f2ff;color:#2f7df6}
.pg-start{
  margin-right:8px;
  padding:10px 18px;
  border-radius:10px;
  background:linear-gradient(135deg,#2f7df6,#22c7b8);
  color:#fff;
  font-weight:950;
  box-shadow:0 10px 25px rgba(47,125,246,.25);
}
.hero{
  position:relative;
  overflow:hidden;
  padding:90px 18px 50px;
  text-align:center;
  background:
    radial-gradient(circle at 20% 10%,rgba(47,125,246,.20),transparent 28%),
    radial-gradient(circle at 80% 0%,rgba(34,199,184,.18),transparent 28%),
    linear-gradient(180deg,#ffffff,#f4faff);
}
.hero h1{
  max-width:900px;
  margin:0 auto 20px;
  font-size:clamp(42px,6vw,78px);
  line-height:1.03;
  letter-spacing:-3px;
}
.hero h1 span{
  background:linear-gradient(135deg,#2f7df6,#22c7b8);
  -webkit-background-clip:text;
  color:transparent;
}
.hero p{
  max-width:760px;
  margin:auto;
  font-size:19px;
  line-height:1.75;
  color:#53657f;
}
.hero-actions{
  margin-top:32px;
  display:flex;
  justify-content:center;
  gap:14px;
  flex-wrap:wrap;
}
.btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:14px 24px;
  border-radius:14px;
  font-weight:950;
  border:0;
  cursor:pointer;
}
.btn-main{
  color:#fff;
  background:linear-gradient(135deg,#2f7df6,#22c7b8);
  box-shadow:0 18px 35px rgba(47,125,246,.25);
}
.btn-light{
  background:#fff;
  border:1px solid #d7e6ff;
  color:#07142f;
}
.stats{
  padding:26px 18px 70px;
  background:#f4faff;
}
.stats-box{
  max-width:1000px;
  margin:auto;
  padding:30px;
  border-radius:26px;
  background:rgba(255,255,255,.76);
  border:1px solid rgba(207,227,255,.9);
  box-shadow:0 25px 70px rgba(16,24,40,.08);
  backdrop-filter:blur(16px);
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:20px;
}
.stat{text-align:center}
.stat b{
  font-size:34px;
  color:#07142f;
  letter-spacing:-1px;
}
.stat span{
  display:block;
  margin-top:6px;
  color:#53657f;
  font-weight:700;
}
.section{padding:82px 18px}
.section-title{
  text-align:center;
  max-width:780px;
  margin:0 auto 42px;
}
.badge{
  display:inline-flex;
  padding:8px 16px;
  border-radius:50px;
  background:#eaf3ff;
  color:#2f7df6;
  font-weight:950;
  font-size:13px;
}
.section-title h2{
  font-size:clamp(30px,4vw,48px);
  margin:14px 0 12px;
  letter-spacing:-1.5px;
}
.section-title p{
  color:#53657f;
  line-height:1.7;
  font-size:16px;
}
.generator{
  background:linear-gradient(180deg,#f4faff,#ffffff);
}
.gen-card{
  max-width:940px;
  margin:auto;
  border-radius:30px;
  padding:34px;
  background:
    linear-gradient(180deg,rgba(255,255,255,.92),rgba(255,255,255,.78));
  border:1px solid #dbeafe;
  box-shadow:0 30px 80px rgba(16,24,40,.10);
}
.upload-box{
  border:2px dashed #98c2ff;
  background:#f8fbff;
  border-radius:24px;
  padding:32px;
  text-align:center;
}
.upload-box input{
  margin-top:18px;
  width:100%;
  max-width:420px;
  padding:14px;
  border-radius:14px;
  background:#fff;
  border:1px solid #d7e6ff;
}
.gen-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:18px;
  margin-top:18px;
}
.field label{
  display:block;
  font-weight:950;
  margin-bottom:8px;
}
.field select,.field input{
  width:100%;
  padding:15px;
  border-radius:16px;
  border:1px solid #d7e6ff;
  outline:none;
  font-size:15px;
  background:#fff;
}
.feature-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:24px;
}
.feature-card{
  padding:28px;
  border-radius:26px;
  background:linear-gradient(180deg,#ffffff,#f8fbff);
  border:1px solid #dbeafe;
  box-shadow:0 18px 45px rgba(16,24,40,.06);
}
.icon{
  width:52px;
  height:52px;
  border-radius:16px;
  background:linear-gradient(135deg,#eaf3ff,#defbf7);
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:950;
  color:#2f7df6;
  margin-bottom:18px;
}
.feature-card h3{font-size:21px;margin:0 0 10px}
.feature-card p{color:#53657f;line-height:1.7;margin:0}
.price-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:24px;
}
.price-card{
  position:relative;
  background:#fff;
  border:1px solid #dbeafe;
  border-radius:28px;
  padding:30px;
  box-shadow:0 22px 60px rgba(16,24,40,.07);
}
.amount{
  font-size:42px;
  font-weight:950;
}
.footer{
  background:#eef3f8;
  border-top:1px solid #dbeafe;
  padding:55px 18px 0;
}
.footer-grid{
  max-width:1180px;
  margin:auto;
  display:grid;
  grid-template-columns:2fr 1fr 1fr 1.5fr;
  gap:36px;
}
.copy-strip{
  background:#0d86ad;
  color:#fff;
  text-align:center;
  padding:13px;
  font-size:13px;
}
.whatsapp{
  position:fixed;
  right:18px;
  bottom:18px;
  background:#22c55e;
  color:#fff;
  padding:14px 20px;
  border-radius:50px;
  font-weight:950;
}
@media(max-width:900px){
.stats-box,.feature-grid,.price-grid,.footer-grid{
grid-template-columns:1fr 1fr
}
}
@media(max-width:620px){
.stats-box,.feature-grid,.price-grid,.footer-grid,.gen-grid{
grid-template-columns:1fr
}
}
</style>
</head>

<body>

<header class="pg-top">
<div class="pg-logo-area">
<a class="logo" href="#">Paper<span>Genius</span></a>
<div class="pg-contact">
AI Exam Paper Generator<br>
WhatsApp Support: 0300-0000000
</div>
</div>

<div class="pg-nav-wrap">
<nav class="pg-nav">
<div class="pg-menu">
<a href="#">Home</a>
<a href="#generator">Paper Generator</a>
<a href="#features">Features</a>
<a href="#pricing">Pricing</a>
</div>
<a class="pg-start" href="#generator">Get Started</a>
</nav>
</div>
</header>

<section class="hero">
<h1>Create exam papers in <span>minutes</span></h1>
<p>Upload original file and generate premium papers.</p>
<div class="hero-actions">
<a class="btn btn-main" href="#generator">Start Now</a>
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
<p>Upload JPG, PNG, PDF or DOCX.</p>
</div>

<div class="gen-card">
<form action="/generate-paper" method="POST" enctype="multipart/form-data">

<div class="upload-box">
<h3>Upload File</h3>
<input type="file" name="paperFile" accept=".jpg,.jpeg,.png,.pdf,.docx" required>
</div>

<div class="gen-grid">
<div class="field">
<label>Paper Type</label>
<select name="paperType">
<option>Mixed Paper</option>
<option>MCQs Only</option>
<option>Short Questions</option>
<option>Long Questions</option>
</select>
</div>

<div class="field">
<label>Total Marks</label>
<input type="number" name="marks" required>
</div>
</div>

<button class="btn btn-main" style="width:100%;margin-top:22px">
Generate Paper
</button>

</form>
</div>
</section>

<section class="section" id="features">
<div class="section-title">
<span class="badge">Features</span>
<h2>Premium Features</h2>
</div>

<div class="pg-shell feature-grid">
<div class="feature-card">
<div class="icon">AI</div>
<h3>AI Generation</h3>
<p>Generate papers from uploaded content.</p>
</div>

<div class="feature-card">
<div class="icon">PDF</div>
<h3>PDF Export</h3>
<p>Download papers in premium format.</p>
</div>

<div class="feature-card">
<div class="icon">✓</div>
<h3>Auto Delete</h3>
<p>Uploaded files auto delete after 15 minutes.</p>
</div>
</div>
</section>

<section class="section" id="pricing">
<div class="section-title">
<span class="badge">Pricing</span>
<h2>Simple Plans</h2>
</div>

<div class="pg-shell price-grid">

<div class="price-card">
<h3>Basic</h3>
<div class="amount">Rs 100</div>
<p>5 Credits</p>
</div>

<div class="price-card">
<h3>Standard</h3>
<div class="amount">Rs 300</div>
<p>15 Credits</p>
</div>

<div class="price-card">
<h3>Pro</h3>
<div class="amount">Rs 500</div>
<p>30 Credits</p>
</div>

</div>
</section>

<footer class="footer">
<div class="footer-grid">

<div>
<h3>PaperGenius</h3>
<p>Premium AI Paper Generator</p>
</div>

<div>
<h3>Links</h3>
<p>Home</p>
<p>Pricing</p>
</div>

<div>
<h3>Legal</h3>
<p>Privacy Policy</p>
</div>

<div>
<h3>Contact</h3>
<p>support@papergenius.com</p>
</div>

</div>

<div class="copy-strip">
© 2026 PaperGenius
</div>
</footer>

<a class="whatsapp" href="#">WhatsApp</a>

</body>
</html>`);
});

app.post("/generate-paper", upload.single("paperFile"), (req, res) => {

  if (!req.file) {
    return res.send("No file uploaded");
  }

  setTimeout(() => {
    try {
      fs.unlinkSync(req.file.path);
      console.log("Uploaded file deleted");
    } catch (e) {}
  }, 15 * 60 * 1000);

  res.send(`
    <h2>File Uploaded Successfully</h2>
    <p>File auto delete after 15 minutes.</p>
    <a href="/">Back Home</a>
  `);

});

app.listen(PORT, () => {
  console.log("PaperGenius frontend running on port " + PORT);
});
