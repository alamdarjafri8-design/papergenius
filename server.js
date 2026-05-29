const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/generated-papers", express.static("generated-papers"));

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

if (!fs.existsSync("generated-papers")) {
  fs.mkdirSync("generated-papers");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});

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

body{
font-family:Arial,sans-serif;
background:#eef5fb;
color:#07142f;
}

a{
text-decoration:none;
color:inherit;
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
}

.top-header{
padding:22px 0 10px;
display:flex;
justify-content:space-between;
align-items:center;
}

.logo{
font-size:42px;
font-weight:900;
letter-spacing:-2px;
}

.logo span{
color:#2f7df6;
}

.header-right{
text-align:right;
font-size:14px;
font-weight:700;
color:#42526b;
line-height:1.7;
}

.navbar{
margin-bottom:18px;
border:1px solid #cfe3ff;
border-radius:14px;
overflow:hidden;
display:flex;
justify-content:space-between;
align-items:center;
background:linear-gradient(180deg,#ffffff,#eef6ff);
box-shadow:0 10px 30px rgba(47,125,246,.08);
}

.nav-links{
display:flex;
flex-wrap:wrap;
}

.nav-links a{
padding:15px 22px;
font-size:15px;
font-weight:900;
border-right:1px solid #dbeafe;
}

.nav-links a:hover{
background:#eaf3ff;
color:#2f7df6;
}

.start-btn{
margin-right:10px;
padding:14px 28px;
border-radius:12px;
background:linear-gradient(135deg,#2f7df6,#22c7b8);
color:#fff;
font-weight:900;
box-shadow:0 14px 35px rgba(47,125,246,.25);
}

.hero{
padding:90px 20px 60px;
text-align:center;
background:
radial-gradient(circle at top left,rgba(47,125,246,.18),transparent 30%),
radial-gradient(circle at top right,rgba(34,199,184,.18),transparent 30%),
#f8fcff;
}

.hero h1{
font-size:78px;
line-height:1.05;
max-width:980px;
margin:auto;
font-weight:900;
letter-spacing:-4px;
}

.hero h1 span{
background:linear-gradient(135deg,#2f7df6,#22c7b8);
-webkit-background-clip:text;
color:transparent;
}

.hero p{
max-width:760px;
margin:30px auto;
font-size:21px;
line-height:1.9;
color:#53657f;
}

.hero-btns{
display:flex;
justify-content:center;
gap:18px;
margin-top:35px;
flex-wrap:wrap;
}

.btn{
padding:18px 34px;
border-radius:16px;
font-size:17px;
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
padding:10px 20px 90px;
}

.stats-box{
background:#fff;
border-radius:32px;
padding:45px;
display:grid;
grid-template-columns:repeat(4,1fr);
gap:20px;
border:1px solid #dbeafe;
box-shadow:0 20px 60px rgba(16,24,40,.08);
}

.stat{
text-align:center;
}

.stat h2{
font-size:48px;
margin-bottom:12px;
}

.stat p{
color:#53657f;
font-weight:700;
font-size:16px;
}

.generator-card{
max-width:1050px;
margin:auto;
background:#fff;
border-radius:32px;
padding:45px;
border:1px solid #dbeafe;
box-shadow:0 20px 70px rgba(16,24,40,.08);
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
padding:16px;
border-radius:16px;
border:1px solid #dbeafe;
font-size:15px;
}

.submit-btn{
width:100%;
margin-top:30px;
padding:18px;
border:none;
border-radius:18px;
font-size:18px;
font-weight:900;
background:linear-gradient(135deg,#2f7df6,#22c7b8);
color:#fff;
cursor:pointer;
box-shadow:0 18px 40px rgba(47,125,246,.25);
}

.whatsapp{
position:fixed;
right:20px;
bottom:20px;
padding:18px 24px;
background:#22c55e;
color:#fff;
border-radius:50px;
font-weight:900;
}

@media(max-width:700px){

.form-grid{
grid-template-columns:1fr;
}

.hero h1{
font-size:46px;
}

.stats-box{
grid-template-columns:1fr;
}

}

</style>

</head>

<body>

<header>

<div class="container">

<div class="top-header">

<div class="logo">
Paper<span>Genius</span>
</div>

<div class="header-right">
AI Exam Paper Generator<br>
WhatsApp Support: 0300-000000
</div>

</div>

<div class="navbar">

<div class="nav-links">
<a href="#">Home</a>
<a href="#">Paper Generator</a>
<a href="#">Features</a>
<a href="#">Pricing</a>
<a href="#">FAQ</a>
</div>

<a class="start-btn" href="#generator">
Get Started
</a>

</div>

</div>

</header>

<section class="hero">

<div class="container">

<h1>
Create exam papers in <span>minutes</span>, not hours
</h1>

<p>
Upload original JPG, PNG, PDF or DOCX file and generate professional exam papers instantly.
</p>

<div class="hero-btns">

<button class="btn btn-main">
Get Started
</button>

<button class="btn btn-light">
View Pricing
</button>

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

<section id="generator" style="padding:80px 20px;">

<div class="container">

<div class="generator-card">

<form action="/generate-paper" method="POST" enctype="multipart/form-data">

<div class="form-grid">

<div class="field">
<label>Academy / School Name</label>
<input type="text" name="academyName" required>
</div>

<div class="field">
<label>Class Name</label>
<input type="text" name="className" required>
</div>

<div class="field">
<label>Subject Name</label>
<input type="text" name="subjectName" required>
</div>

<div class="field">
<label>Language</label>

<select name="language">

<option value="english">English</option>
<option value="urdu">Urdu</option>
<option value="both">English + Urdu</option>

</select>

</div>

<div class="field">
<label>MCQs Count</label>
<input type="number" name="mcqs" value="5">
</div>

<div class="field">
<label>Short Questions Count</label>
<input type="number" name="shortQuestions" value="5">
</div>

<div class="field">
<label>Long Questions Count</label>
<input type="number" name="longQuestions" value="3">
</div>

<div class="field">
<label>Fill In The Blanks Count</label>
<input type="number" name="blanks" value="5">
</div>

<div class="field">
<label>Tick Correct Count</label>
<input type="number" name="ticks" value="5">
</div>

<div class="field">
<label>Upload Original File</label>
<input type="file" name="paperFile" required>
</div>

</div>

<button class="submit-btn">
Generate Paper
</button>

</form>

</div>

</div>

</section>

<a class="whatsapp" href="#">
WhatsApp Support
</a>

</body>
</html>

`);

});

app.post("/generate-paper", upload.single("paperFile"), async (req, res) => {

try {

const {
academyName,
className,
subjectName,
language,
mcqs,
shortQuestions,
longQuestions,
blanks,
ticks
} = req.body;

const pdfName = "paper-" + Date.now() + ".pdf";

const pdfPath = path.join("generated-papers", pdfName);

const doc = new PDFDocument({
size: "A4",
margin: 50
});

const stream = fs.createWriteStream(pdfPath);

doc.pipe(stream);

doc.fontSize(22).text(academyName, {
align: "center"
});

doc.moveDown(0.5);

doc.fontSize(16).text("Class: " + className, {
align: "center"
});

doc.text("Subject: " + subjectName, {
align: "center"
});

doc.moveDown(2);

doc.fontSize(18).text("Generated Exam Paper", {
align: "center"
});

doc.moveDown(2);

if (language === "english") {

doc.fontSize(15).text("Language: English");

} else if (language === "urdu") {

doc.fontSize(15).text("Language: Urdu");

} else {

doc.fontSize(15).text("Language: English + Urdu");

}

doc.moveDown(2);

doc.fontSize(18).text("MCQs");

for (let i = 1; i <= Number(mcqs); i++) {

doc.moveDown(0.7);

doc.fontSize(13).text(
i + ". Sample MCQ Question from uploaded file?"
);

doc.text("A) Option 1");
doc.text("B) Option 2");
doc.text("C) Option 3");
doc.text("D) Option 4");

}

doc.addPage();

doc.fontSize(18).text("Short Questions");

for (let i = 1; i <= Number(shortQuestions); i++) {

doc.moveDown(1);

doc.fontSize(13).text(
i + ". Write short answer from uploaded content."
);

}

doc.moveDown(2);

doc.fontSize(18).text("Long Questions");

for (let i = 1; i <= Number(longQuestions); i++) {

doc.moveDown(1);

doc.fontSize(13).text(
i + ". Explain the topic in detail."
);

}

doc.addPage();

doc.fontSize(18).text("Fill In The Blanks");

for (let i = 1; i <= Number(blanks); i++) {

doc.moveDown(1);

doc.fontSize(13).text(
i + ". ____________ is important."
);

}

doc.moveDown(2);

doc.fontSize(18).text("Tick Correct Answer");

for (let i = 1; i <= Number(ticks); i++) {

doc.moveDown(1);

doc.fontSize(13).text(
i + ". Tick the correct answer."
);

}

doc.end();

stream.on("finish", () => {

setTimeout(() => {

try {

if (req.file && fs.existsSync(req.file.path)) {
fs.unlinkSync(req.file.path);
}

if (fs.existsSync(pdfPath)) {
fs.unlinkSync(pdfPath);
}

} catch (e) {}

}, 15 * 60 * 1000);

res.send(`

<!DOCTYPE html>
<html>
<head>

<title>Paper Generated</title>

<style>

body{
font-family:Arial;
background:#eef5fb;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
}

.box{
background:#fff;
padding:50px;
border-radius:30px;
text-align:center;
width:600px;
box-shadow:0 20px 70px rgba(0,0,0,.08);
}

a{
display:inline-block;
margin-top:25px;
padding:18px 30px;
background:linear-gradient(135deg,#2f7df6,#22c7b8);
color:#fff;
border-radius:16px;
font-weight:bold;
text-decoration:none;
}

</style>

</head>

<body>

<div class="box">

<h1>
Paper Generated Successfully
</h1>

<p>
Your paper generated successfully from uploaded file.
</p>

<p>
File and paper auto delete after 15 minutes.
</p>

<a href="/generated-papers/${pdfName}" download>
Download Paper PDF
</a>

<br><br>

<a href="/">
Back To Home
</a>

</div>

</body>
</html>

`);

});

} catch (error) {

console.log(error);

res.send("Error generating paper");

}

});

app.listen(PORT, () => {
console.log("PaperGenius running on port " + PORT);
});
