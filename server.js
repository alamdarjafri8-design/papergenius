const express = require("express");
const multer = require("multer");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

const upload = multer({
  dest: "uploads/"
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {

res.send(`

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>PaperGenius - AI Exam Paper Generator</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
}

html{
scroll-behavior:smooth;
}

body{
font-family:Arial,sans-serif;
background:#f4faff;
color:#07142f;
}

a{
text-decoration:none;
}

.container{
width:100%;
max-width:1180px;
margin:auto;
padding:0 20px;
}

header{
background:#fff;
border-bottom:1px solid #dbeafe;
position:sticky;
top:0;
z-index:1000;
}

.topbar{
display:flex;
justify-content:space-between;
align-items:center;
padding:18px 0;
}

.logo{
font-size:34px;
font-weight:900;
color:#07142f;
}

.logo span{
color:#2f7df6;
}

.nav{
display:flex;
gap:20px;
align-items:center;
}

.nav a{
font-weight:700;
color:#07142f;
}

.start-btn{
padding:14px 24px;
border-radius:12px;
background:linear-gradient(135deg,#2f7df6,#22c7b8);
color:#fff !important;
font-weight:900;
box-shadow:0 15px 35px rgba(47,125,246,.25);
}

.hero{
padding:100px 20px 70px;
text-align:center;
background:
radial-gradient(circle at top left,rgba(47,125,246,.18),transparent 30%),
radial-gradient(circle at top right,rgba(34,199,184,.18),transparent 30%),
#fff;
}

.hero h1{
font-size:72px;
line-height:1.05;
max-width:950px;
margin:auto;
font-weight:900;
letter-spacing:-3px;
}

.hero h1 span{
background:linear-gradient(135deg,#2f7df6,#22c7b8);
-webkit-background-clip:text;
color:transparent;
}

.hero p{
max-width:760px;
margin:30px auto;
font-size:20px;
line-height:1.8;
color:#53657f;
}

.hero-btns{
display:flex;
justify-content:center;
gap:18px;
flex-wrap:wrap;
margin-top:30px;
}

.btn{
padding:16px 30px;
border-radius:14px;
font-size:16px;
font-weight:900;
border:none;
cursor:pointer;
}

.btn-main{
background:linear-gradient(135deg,#2f7df6,#22c7b8);
color:#fff;
box-shadow:0 18px 40px rgba(47,125,246,.25);
}

.btn-light{
background:#fff;
border:1px solid #dbeafe;
}

.stats{
padding:20px 20px 80px;
}

.stats-box{
background:#fff;
border-radius:30px;
padding:40px;
display:grid;
grid-template-columns:repeat(4,1fr);
gap:20px;
border:1px solid #dbeafe;
box-shadow:0 25px 70px rgba(16,24,40,.08);
}

.stat{
text-align:center;
}

.stat h2{
font-size:42px;
margin-bottom:10px;
}

.stat p{
color:#53657f;
font-weight:700;
}

.section{
padding:90px 20px;
}

.section-title{
text-align:center;
margin-bottom:50px;
}

.section-title h2{
font-size:50px;
margin-bottom:18px;
}

.section-title p{
max-width:700px;
margin:auto;
color:#53657f;
font-size:18px;
line-height:1.8;
}

.generator-card{
background:#fff;
border-radius:30px;
padding:40px;
border:1px solid #dbeafe;
box-shadow:0 25px 70px rgba(16,24,40,.08);
max-width:900px;
margin:auto;
}

.upload-box{
border:2px dashed #98c2ff;
padding:50px 20px;
border-radius:24px;
text-align:center;
background:#f8fbff;
}

.upload-box h3{
font-size:30px;
margin-bottom:15px;
}

.upload-box p{
color:#53657f;
margin-bottom:20px;
}

.upload-box input{
padding:15px;
width:100%;
max-width:400px;
border-radius:14px;
border:1px solid #dbeafe;
background:#fff;
}

.form-grid{
display:grid;
grid-template-columns:1fr 1fr;
gap:20px;
margin-top:25px;
}

.field label{
display:block;
margin-bottom:10px;
font-weight:900;
}

.field input,
.field select{
width:100%;
padding:15px;
border-radius:14px;
border:1px solid #dbeafe;
font-size:15px;
}

.submit-btn{
width:100%;
margin-top:25px;
padding:18px;
border:none;
border-radius:16px;
font-size:18px;
font-weight:900;
background:linear-gradient(135deg,#2f7df6,#22c7b8);
color:#fff;
cursor:pointer;
box-shadow:0 18px 40px rgba(47,125,246,.25);
}

.features-grid{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:25px;
}

.feature-card{
background:#fff;
border-radius:28px;
padding:30px;
border:1px solid #dbeafe;
box-shadow:0 20px 55px rgba(16,24,40,.06);
}

.icon{
width:60px;
height:60px;
border-radius:18px;
background:linear-gradient(135deg,#eaf3ff,#defbf7);
display:flex;
align-items:center;
justify-content:center;
font-size:26px;
font-weight:900;
color:#2f7df6;
margin-bottom:20px;
}

.feature-card h3{
font-size:24px;
margin-bottom:12px;
}

.feature-card p{
color:#53657f;
line-height:1.8;
}

.pricing-grid{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:25px;
}

.price-card{
background:#fff;
border-radius:30px;
padding:35px;
border:1px solid #dbeafe;
box-shadow:0 20px 60px rgba(16,24,40,.07);
text-align:center;
}

.price-card h3{
font-size:28px;
margin-bottom:20px;
}

.price{
font-size:55px;
font-weight:900;
margin-bottom:10px;
}

.price-card p{
color:#53657f;
margin-bottom:10px;
font-weight:700;
}

.faq{
max-width:900px;
margin:auto;
}

.faq-item{
background:#fff;
border-radius:18px;
padding:24px;
margin-bottom:18px;
border:1px solid #dbeafe;
box-shadow:0 15px 40px rgba(16,24,40,.05);
}

.faq-item h4{
font-size:20px;
margin-bottom:10px;
}

.faq-item p{
color:#53657f;
line-height:1.8;
}

footer{
background:#eef3f8;
padding:70px 20px 0;
border-top:1px solid #dbeafe;
}

.footer-grid{
display:grid;
grid-template-columns:2fr 1fr 1fr 1fr;
gap:30px;
}

.footer-grid h3{
margin-bottom:20px;
}

.footer-grid p{
margin-bottom:12px;
color:#53657f;
}

.copy{
margin-top:50px;
background:#0d86ad;
padding:16px;
text-align:center;
color:#fff;
font-size:14px;
}

.whatsapp{
position:fixed;
right:20px;
bottom:20px;
padding:16px 22px;
background:#22c55e;
color:#fff;
border-radius:50px;
font-weight:900;
box-shadow:0 15px 40px rgba(34,197,94,.30);
}

@media(max-width:900px){

.stats-box,
.features-grid,
.pricing-grid,
.footer-grid{
grid-template-columns:1fr 1fr;
}

.hero h1{
font-size:52px;
}

}

@media(max-width:600px){

.stats-box,
.features-grid,
.pricing-grid,
.footer-grid,
.form-grid{
grid-template-columns:1fr;
}

.hero h1{
font-size:42px;
}

.section-title h2{
font-size:36px;
}

}

</style>
</head>

<body>

<header>

<div class="container topbar">

<div class="logo">
Paper<span>Genius</span>
</div>

<div class="nav">
<a href="#">Home</a>
<a href="#generator">Generator</a>
<a href="#features">Features</a>
<a href="#pricing">Pricing</a>
<a href="#faq">FAQ</a>
<a class="start-btn" href="#generator">Start Now</a>
</div>

</div>

</header>

<section class="hero">

<div class="container">

<h1>
Create exam papers in <span>minutes</span>, not hours
</h1>

<p>
Upload your original JPG, PNG, PDF or DOCX file and generate premium exam papers instantly.
</p>

<div class="hero-btns">
<a href="#generator">
<button class="btn btn-main">Get Started</button>
</a>

<a href="#pricing">
<button class="btn btn-light">View Pricing</button>
</a>
</div>

</div>

</section>

<section class="stats">

<div class="container">

<div class="stats-box">

<div class="stat">
<h2>128,450+</h2>
<p>Papers Generated</p>
</div>

<div class="stat">
<h2>18,700+</h2>
<p>Active Teachers</p>
</div>

<div class="stat">
<h2>74.8%</h2>
<p>Time Saved</p>
</div>

<div class="stat">
<h2>4.9/5</h2>
<p>User Rating</p>
</div>

</div>

</div>

</section>

<section class="section" id="generator">

<div class="container">

<div class="section-title">
<h2>Generate Paper From Original File</h2>
<p>
Upload original study material and PaperGenius will process it automatically.
</p>
</div>

<div class="generator-card">

<form action="/generate-paper" method="POST" enctype="multipart/form-data">

<div class="upload-box">

<h3>Upload File</h3>

<p>
Supported: JPG, PNG, PDF, DOCX
</p>

<input type="file" name="paperFile" required>

</div>

<div class="form-grid">

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
<input type="number" name="marks" placeholder="Enter total marks">
</div>

</div>

<button class="submit-btn">
Generate Paper
</button>

</form>

</div>

</div>

</section>

<section class="section" id="features">

<div class="container">

<div class="section-title">
<h2>Premium Features</h2>
<p>
Everything you need to generate professional exam papers.
</p>
</div>

<div class="features-grid">

<div class="feature-card">
<div class="icon">AI</div>
<h3>AI Generation</h3>
<p>Generate papers directly from uploaded content.</p>
</div>

<div class="feature-card">
<div class="icon">PDF</div>
<h3>PDF Export</h3>
<p>Download premium formatted papers instantly.</p>
</div>

<div class="feature-card">
<div class="icon">✓</div>
<h3>Auto Delete</h3>
<p>Uploaded files delete automatically after 15 minutes.</p>
</div>

</div>

</div>

</section>

<section class="section" id="pricing">

<div class="container">

<div class="section-title">
<h2>Simple Pricing</h2>
<p>
Affordable credit plans for teachers and academies.
</p>
</div>

<div class="pricing-grid">

<div class="price-card">
<h3>Basic Pack</h3>
<div class="price">Rs 100</div>
<p>5 Credits</p>
<p>Valid For 7 Days</p>
</div>

<div class="price-card">
<h3>Standard Pack</h3>
<div class="price">Rs 300</div>
<p>15 Credits</p>
<p>Valid For 15 Days</p>
</div>

<div class="price-card">
<h3>Pro Pack</h3>
<div class="price">Rs 500</div>
<p>30 Credits</p>
<p>Valid For 25 Days</p>
</div>

</div>

</div>

</section>

<section class="section" id="faq">

<div class="container">

<div class="section-title">
<h2>Frequently Asked Questions</h2>
</div>

<div class="faq">

<div class="faq-item">
<h4>How does PaperGenius work?</h4>
<p>Upload your original file and generate paper automatically.</p>
</div>

<div class="faq-item">
<h4>Which file types are supported?</h4>
<p>JPG, PNG, PDF and DOCX are supported.</p>
</div>

<div class="faq-item">
<h4>Will uploaded files stay forever?</h4>
<p>No. All uploaded files auto delete after 15 minutes.</p>
</div>

</div>

</div>

</section>

<footer>

<div class="container footer-grid">

<div>
<h3>PaperGenius</h3>
<p>Premium AI Exam Paper Generator.</p>
</div>

<div>
<h3>Quick Links</h3>
<p>Home</p>
<p>Features</p>
<p>Pricing</p>
</div>

<div>
<h3>Legal</h3>
<p>Privacy Policy</p>
<p>Terms</p>
</div>

<div>
<h3>Contact</h3>
<p>support@papergenius.com</p>
<p>Lahore, Pakistan</p>
</div>

</div>

<div class="copy">
© 2026 PaperGenius. All rights reserved.
</div>

</footer>

<a class="whatsapp" href="#">
WhatsApp Support
</a>

</body>
</html>

`);

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

<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Upload Success</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
}

body{
font-family:Arial,sans-serif;
background:#f4faff;
display:flex;
align-items:center;
justify-content:center;
min-height:100vh;
padding:20px;
}

.success-box{
width:100%;
max-width:650px;
background:#fff;
border-radius:28px;
padding:50px 35px;
text-align:center;
border:1px solid #dbeafe;
box-shadow:0 25px 70px rgba(16,24,40,.10);
}

.icon{
width:100px;
height:100px;
margin:auto auto 25px;
border-radius:50%;
background:linear-gradient(135deg,#2f7df6,#22c7b8);
display:flex;
align-items:center;
justify-content:center;
font-size:48px;
color:#fff;
font-weight:bold;
box-shadow:0 18px 40px rgba(47,125,246,.30);
}

h1{
font-size:42px;
margin-bottom:15px;
color:#07142f;
}

p{
font-size:17px;
line-height:1.8;
color:#53657f;
margin-bottom:14px;
}

.info{
margin-top:25px;
padding:18px;
border-radius:18px;
background:#f4faff;
border:1px solid #dbeafe;
font-size:15px;
font-weight:700;
color:#2f7df6;
}

.btn{
display:inline-block;
margin-top:30px;
padding:16px 34px;
border-radius:14px;
background:linear-gradient(135deg,#2f7df6,#22c7b8);
color:#fff;
font-size:16px;
font-weight:900;
text-decoration:none;
box-shadow:0 16px 35px rgba(47,125,246,.25);
}

</style>

</head>

<body>

<div class="success-box">

<div class="icon">
✓
</div>

<h1>
File Uploaded
</h1>

<p>
Your file has been uploaded successfully.
</p>

<p>
PaperGenius received your original file.
</p>

<div class="info">
Uploaded file will auto delete permanently after 15 minutes.
</div>

<a href="/" class="btn">
Back To Home
</a>

</div>

</body>
</html>

`);

});

app.listen(PORT, () => {
console.log("PaperGenius running on port " + PORT);
});
