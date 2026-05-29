const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>PaperGenius - AI Paper Generator</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:Inter,Arial,sans-serif;background:#edf5f6;color:#07152f}
a{text-decoration:none;color:inherit}
.container{max-width:1100px;margin:auto;padding:0 14px}
.topbar{display:flex;justify-content:space-between;align-items:center;padding:18px 0 8px}
.logo{font-size:34px;font-weight:900;color:#079b3f;letter-spacing:-1px}
.contact{text-align:right;font-size:13px;font-weight:800}
.client-btn{display:inline-block;background:#067bb6;color:white;padding:7px 18px;border-radius:7px;margin-bottom:6px;font-size:13px;font-weight:800}
.menu{display:flex;overflow:auto;background:linear-gradient(#fff,#e8e8e8);border-radius:10px;border:1px solid #b7b7b7;box-shadow:0 4px 14px #00000010}
.menu a{padding:12px 18px;border-right:1px solid #c8c8c8;font-size:13px;font-weight:800;white-space:nowrap}
.menu a:first-child{background:#84c400;color:white}
.hero{background:white;margin-top:16px;border-radius:24px;padding:70px 30px;text-align:center;box-shadow:0 18px 45px #00000010}
.hero h1{font-size:62px;line-height:1.05;font-weight:900;letter-spacing:-2px}
.hero h1 span{color:#3478f6}
.hero p{max-width:760px;margin:22px auto;font-size:19px;color:#60708a;line-height:1.7}
.hero-btn{display:inline-block;padding:14px 28px;border-radius:12px;font-weight:900;margin:6px}
.green{background:#079b3f;color:white}
.white{background:white;border:1px solid #d7e0eb}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:45px;padding-top:28px;border-top:1px solid #dde6ef}
.stat{text-align:center}
.stat h2{font-size:32px;margin-bottom:8px}
.stat p{color:#60708a;font-size:15px}
.section-title{text-align:center;margin:58px 0 24px}
.section-title h2{font-size:38px;font-weight:900;margin-bottom:10px}
.section-title p{color:#60708a;font-size:17px}
.features{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.card{background:white;padding:28px;border-radius:24px;box-shadow:0 14px 35px #00000010;border:1px solid #e4edf5;transition:.25s}
.card:hover{transform:translateY(-6px);box-shadow:0 24px 45px #079b3f20}
.icon{width:56px;height:56px;border-radius:16px;background:#eaf2ff;display:flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:18px;color:#3478f6}
.card h3{font-size:22px;margin-bottom:10px}
.card p{line-height:1.7;font-size:15px;color:#5f7088}
.pricing{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
.price-card{background:white;border-radius:24px;overflow:hidden;box-shadow:0 20px 45px #00000012;border:1px solid #e5edf5;position:relative;transition:.25s}
.price-card:hover{transform:translateY(-8px)}
.price-top{height:125px;background:linear-gradient(135deg,#0038ff,#10d4ff);display:flex;align-items:center;justify-content:center;font-size:54px;color:white}
.badge{position:absolute;top:102px;left:50%;transform:translateX(-50%);background:#004cff;color:white;padding:8px 18px;border-radius:30px;font-size:12px;font-weight:900}
.price-body{padding:28px;text-align:center}
.price-body h3{font-size:26px;margin-bottom:10px}
.price{font-size:48px;font-weight:900;color:#004cff;margin-bottom:10px}
.price-body p{font-size:15px;color:#60708a;margin-bottom:18px}
.price-body ul{list-style:none;text-align:left;line-height:2.2;font-size:15px;color:#1b2d48;margin-bottom:20px}
.price-body li:before{content:"✓";color:#004cff;font-weight:900;margin-right:10px}
.buy-btn{display:block;width:100%;padding:14px;border-radius:12px;background:#004cff;color:white;font-weight:900}
.generator{display:grid;grid-template-columns:repeat(2,1fr);gap:22px}
.generator-box{background:white;padding:28px;border-radius:24px;box-shadow:0 14px 35px #00000010;border:1px solid #e4edf5}
.generator-box h3{font-size:26px;margin-bottom:20px}
.generator-box input,.generator-box select{width:100%;padding:14px;border-radius:12px;border:1px solid #d7e0eb;margin-bottom:14px;font-family:Inter}
.generate-btn{width:100%;padding:15px;border:none;border-radius:14px;background:linear-gradient(135deg,#079b3f,#05bb5c);color:white;font-size:16px;font-weight:900}
.forms{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.form-card{background:white;padding:28px;border-radius:24px;box-shadow:0 14px 35px #00000010;border:1px solid #e4edf5;display:flex;flex-direction:column}
.form-card h3{font-size:22px;margin-bottom:18px}
.form-card input{width:100%;padding:14px;border-radius:12px;border:1px solid #d7e0eb;margin-bottom:14px;font-family:Inter}
.form-card button{margin-top:auto;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#079b3f,#05bb5c);color:white;font-weight:900}
.about{background:white;padding:38px;border-radius:24px;box-shadow:0 18px 45px #00000010;border:1px solid #e5edf5;line-height:1.8;color:#5f7088}
.about h2{font-size:34px;margin-bottom:18px;color:#07152f}
.faq{max-width:920px;margin:auto}
.faq details{background:white;padding:20px 24px;border-radius:18px;margin-bottom:14px;box-shadow:0 12px 30px #00000010;border:1px solid #e5edf5}
.faq summary{cursor:pointer;font-weight:900;font-size:17px}
.faq p{margin-top:14px;line-height:1.8;color:#60708a}
.footer{margin-top:50px}
.footer-menu{background:linear-gradient(#fff,#ddd);padding:14px;text-align:center;border-top:1px solid #bbb;border-bottom:1px solid #bbb}
.footer-menu a{margin:0 12px;font-size:13px;font-weight:800}
.footer-bottom{background:#087da0;color:white;text-align:center;padding:20px;font-size:13px;line-height:1.8}
.whatsapp{position:fixed;right:24px;bottom:24px;width:64px;height:64px;border-radius:50%;background:#25d366;display:flex;align-items:center;justify-content:center;font-size:32px;color:white;box-shadow:0 12px 35px #25d36690}
@media(max-width:900px){.features,.pricing,.forms,.stats,.generator{grid-template-columns:1fr 1fr}.hero h1{font-size:42px}}
@media(max-width:650px){.features,.pricing,.forms,.stats,.generator{grid-template-columns:1fr}.topbar{display:block;text-align:center}.contact{text-align:center;margin-top:10px}.hero h1{font-size:35px}.hero{padding:50px 20px}}
</style>
</head>
<body>

<div class="container">
<div class="topbar">
<div class="logo">PaperGenius</div>
<div class="contact">
<a class="client-btn">CLIENT LOGIN</a><br>
WhatsApp: 0305-6583822
</div>
</div>

<div class="menu">
<a href="#">Home</a>
<a href="#features">Features</a>
<a href="#pricing">Pricing</a>
<a href="#generator">Paper Generator</a>
<a href="#login">Login</a>
<a href="#signup">Sign Up</a>
<a href="#admin">Admin Login</a>
<a href="#faq">FAQs</a>
</div>

<section class="hero">
<h1>Create exam papers<br>in <span>minutes</span>, not hours</h1>
<p>AI-powered paper generator for schools and academies. Upload content, customize settings, and generate premium school-style papers instantly.</p>
<a class="hero-btn green" href="#generator">Get Started</a>
<a class="hero-btn white" href="#pricing">View Pricing</a>

<div class="stats">
<div class="stat"><h2>250K+</h2><p>Papers Generated</p></div>
<div class="stat"><h2>18K+</h2><p>Teachers</p></div>
<div class="stat"><h2>98.7%</h2><p>Satisfaction</p></div>
<div class="stat"><h2>4.9/5</h2><p>Rating</p></div>
</div>
</section>

<div class="section-title" id="features">
<h2>Premium Features</h2>
<p>Everything needed for modern exam paper generation</p>
</div>

<section class="features">
<div class="card"><div class="icon">⇧</div><h3>Smart Upload</h3><p>Upload PDF, DOCX, JPG, and PNG educational files with OCR-ready structure.</p></div>
<div class="card"><div class="icon">✦</div><h3>AI Paper Generator</h3><p>Generate MCQs, short and long questions from uploaded educational content.</p></div>
<div class="card"><div class="icon">□</div><h3>Premium PDF</h3><p>Download school-style professional papers with clean formatting and layout.</p></div>
</section>

<div class="section-title" id="pricing">
<h2>Pricing Plans</h2>
<p>Affordable plans for teachers and academies</p>
</div>

<section class="pricing">
<div class="price-card">
<div class="price-top">📘</div>
<div class="price-body">
<h3>Basic Pack</h3>
<div class="price">Rs 100</div>
<p>5 Papers • 7 Days</p>
<ul><li>5 paper credits</li><li>Premium layouts</li><li>PDF downloads</li><li>Fast generation</li></ul>
<a class="buy-btn">Buy Now</a>
</div>
</div>

<div class="price-card">
<div class="price-top">🎓</div>
<div class="badge">BEST VALUE</div>
<div class="price-body">
<h3>Standard Pack</h3>
<div class="price">Rs 300</div>
<p>15 Papers • 15 Days</p>
<ul><li>15 paper credits</li><li>All subjects</li><li>Priority processing</li><li>Modern paper styles</li></ul>
<a class="buy-btn">Buy Now</a>
</div>
</div>

<div class="price-card">
<div class="price-top">🚀</div>
<div class="price-body">
<h3>Monthly Pack</h3>
<div class="price">Rs 500</div>
<p>30 Papers • 30 Days</p>
<ul><li>30 paper credits</li><li>Best for academies</li><li>Monthly usage</li><li>Priority support</li></ul>
<a class="buy-btn">Buy Now</a>
</div>
</div>
</section>

<div class="section-title" id="generator">
<h2>Paper Generator</h2>
<p>Create professional papers in seconds</p>
</div>

<section class="generator">
<div class="generator-box">
<h3>Paper Details</h3>
<input placeholder="School / Academy Name">
<input placeholder="WhatsApp Number">
<input placeholder="Class">
<input placeholder="Subject">
<input placeholder="Total Marks">
<input placeholder="Pass Marks">
<input placeholder="Time Duration">
</div>

<div class="generator-box">
<h3>Paper Settings</h3>
<input placeholder="Total Pages">
<input placeholder="MCQs Count">
<input placeholder="Short Questions Count">
<input placeholder="Long Questions Count">
<select>
<option>Easy Difficulty</option>
<option>Medium Difficulty</option>
<option>Hard Difficulty</option>
</select>
<input type="file">
<button class="generate-btn">Generate Paper</button>
</div>
</section>

<div class="section-title">
<h2>Account Access</h2>
<p>User and admin account system</p>
</div>

<section class="forms">
<div class="form-card" id="login"><h3>User Login</h3><input placeholder="Email Address"><input type="password" placeholder="Password"><button>Login</button></div>
<div class="form-card" id="signup"><h3>Create Account</h3><input placeholder="Full Name"><input placeholder="Email Address"><input type="password" placeholder="Password"><button>Sign Up</button></div>
<div class="form-card" id="admin"><h3>Admin Login</h3><input placeholder="Admin Email"><input type="password" placeholder="Admin Password"><button>Admin Login</button></div>
</section>

<div class="section-title">
<h2>About PaperGenius</h2>
<p>Smart education technology for teachers</p>
</div>

<section class="about">
<h2>Why choose PaperGenius?</h2>
<p>PaperGenius is built for schools, teachers, tuition centers, and academies that want premium professional exam papers without wasting hours manually formatting documents.</p>
<p>Teachers can upload educational material, customize question settings, and generate clean printable papers instantly with modern layouts and smart formatting.</p>
</section>

<div class="section-title" id="faq">
<h2>Frequently Asked Questions</h2>
<p>Everything teachers need to know</p>
</div>

<section class="faq">
<details open><summary>How does PaperGenius work?</summary><p>Upload educational content, customize settings, and generate premium school-style papers instantly.</p></details>
<details><summary>Which file formats are supported?</summary><p>PDF, DOCX, JPG, and PNG files are supported.</p></details>
<details><summary>How do credits work?</summary><p>Every generated paper uses one credit according to your selected package.</p></details>
<details><summary>Is Urdu supported?</summary><p>Yes, Urdu formatting and Urdu paper generation support will be included.</p></details>
</section>
</div>

<footer class="footer">
<div class="footer-menu">
<a>Home</a><a>Pricing</a><a>Contact</a><a>Privacy Policy</a><a>Terms</a>
</div>
<div class="footer-bottom">
Copyright © 2026 PaperGenius - All Rights Reserved.<br>
WhatsApp Support: 0305-6583822
</div>
</footer>

<a class="whatsapp" href="https://wa.me/923056583822">☎</a>
</body>
</html>`;

app.get("/", (req, res) => {
  res.send(html);
});

app.listen(PORT, () => {
  console.log("PaperGenius running on port " + PORT);
});
