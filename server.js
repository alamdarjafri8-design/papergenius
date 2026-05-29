const http = require("http");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>PaperGenius - AI Exam Paper Generator</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
*{box-sizing:border-box}
body{margin:0;font-family:Arial,Helvetica,sans-serif;background:#e8f1f2;color:#06142e}
a{text-decoration:none;color:inherit}
.wrap{max-width:1040px;margin:auto}
.top{padding:18px 10px 6px;display:flex;justify-content:space-between;align-items:center}
.logo{font-size:31px;font-weight:900;color:#0a9f42}
.contact{text-align:right;font-size:14px;font-weight:700}
.login{background:#0076b6;color:#fff;padding:7px 18px;border-radius:5px;display:inline-block;margin-bottom:6px}
.menu{background:linear-gradient(#fff,#ddd);border:1px solid #aaa;border-radius:8px;overflow:hidden;display:flex}
.menu a{padding:10px 22px;border-right:1px solid #bbb;font-weight:700;font-size:14px}
.menu a:first-child{background:#8cc600;color:#fff}
.hero{background:#fff;border-radius:16px;margin-top:16px;padding:65px 25px;text-align:center;box-shadow:0 12px 40px #0001}
.hero h1{font-size:60px;line-height:1.05;margin:0;font-weight:900}
.hero span{color:#3478f6}
.hero p{font-size:20px;color:#53627a;max-width:700px;margin:25px auto}
.btn{display:inline-block;background:#0aa84f;color:#fff;padding:13px 28px;border-radius:9px;font-weight:800;margin:6px}
.btn.alt{background:#fff;color:#06142e;border:1px solid #d4dce8}
.stats{border-top:1px solid #d9e1ea;margin-top:55px;padding-top:30px;display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.stat b{font-size:30px}.stat p{margin:7px 0;color:#61708a}
.title{text-align:center;margin:70px 0 30px}.title h2{font-size:36px;margin:0}.title p{color:#62708a;font-size:18px}
.features{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.feature{background:#fff;border:1px solid #e4eaf2;padding:30px;border-radius:18px;box-shadow:0 8px 28px #0000000d;transition:.3s}
.feature:hover{transform:translateY(-7px);box-shadow:0 18px 45px #0a9f4230}
.icon{width:52px;height:52px;border-radius:14px;background:#eaf2ff;color:#3478f6;display:flex;align-items:center;justify-content:center;font-size:25px;margin-bottom:18px}
.feature h3{font-size:22px;margin:0 0 12px}.feature p{color:#5d6d87;line-height:1.7}
.pricing{display:grid;grid-template-columns:repeat(5,1fr);gap:18px}
.price-card{background:#fff;border-radius:20px;overflow:hidden;text-align:center;box-shadow:0 14px 38px #0001;position:relative;border:1px solid #e6edf5}
.art{height:110px;background:linear-gradient(135deg,#013bff,#00c2ff);display:flex;align-items:center;justify-content:center;color:#fff;font-size:46px}
.popular{position:absolute;top:90px;left:50%;transform:translateX(-50%);background:#0a66ff;color:#fff;font-size:12px;padding:7px 16px;border-radius:20px;font-weight:900}
.price-card h3{font-size:22px;margin:30px 0 10px}
.amount{font-size:39px;font-weight:900;color:#0038ff}.amount small{font-size:15px;color:#06142e}
.price-card ul{list-style:none;padding:0 24px;text-align:left;line-height:2;color:#23324a}
.price-card li:before{content:"✓";color:#0038ff;font-weight:900;margin-right:9px}
.outline{display:inline-block;border:2px solid #0038ff;color:#0038ff;padding:12px 24px;border-radius:12px;margin:16px 0 24px;font-weight:800}
.faq{max-width:850px;margin:0 auto 55px}
.faq details{background:#fff;margin:14px 0;border-radius:14px;padding:20px 24px;box-shadow:0 8px 25px #0001;border:1px solid #e6edf5}
.faq summary{cursor:pointer;font-size:18px;font-weight:800}
.faq p{color:#5d6d87;line-height:1.7}
.footer{background:#087da0;color:#fff;margin-top:50px;padding:18px;text-align:center;font-size:14px}
.footer a{margin:0 10px}
.whatsapp{position:fixed;right:25px;bottom:25px;background:#25d366;color:#fff;width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:32px;box-shadow:0 12px 35px #25d36680;z-index:99}
@media(max-width:900px){.features,.pricing,.stats{grid-template-columns:1fr 1fr}.hero h1{font-size:42px}.menu{overflow-x:auto}.menu a{white-space:nowrap}}
@media(max-width:600px){.top{display:block;text-align:center}.contact{text-align:center;margin-top:10px}.features,.pricing,.stats{grid-template-columns:1fr}.hero h1{font-size:34px}}
</style>
</head>
<body>

<div class="wrap">
  <div class="top">
    <div class="logo">PaperGenius</div>
    <div class="contact">
      <a class="login" href="#">CLIENT LOGIN</a><br>
      WhatsApp: 0305-6583822
    </div>
  </div>

  <nav class="menu">
    <a href="#">Home</a><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#">Paper Generator</a><a href="#">CV Builder</a><a href="#faq">FAQs</a>
  </nav>

  <section class="hero">
    <h1>Create exam papers<br>in <span>minutes</span>, not hours</h1>
    <p>AI-powered paper generator for schools and academies. Upload content, customize settings, and download professional exam papers instantly.</p>
    <a class="btn" href="#pricing">Get Started</a>
    <a class="btn alt" href="#pricing">View Pricing</a>

    <div class="stats">
      <div class="stat"><b>250K+</b><p>Papers Generated</p></div>
      <div class="stat"><b>18K+</b><p>Active Teachers</p></div>
      <div class="stat"><b>98.7%</b><p>Satisfaction</p></div>
      <div class="stat"><b>4.9/5</b><p>User Rating</p></div>
    </div>
  </section>

  <div class="title" id="features">
    <h2>Everything you need to create perfect papers</h2>
    <p>Powerful features designed for educators and schools</p>
  </div>

  <section class="features">
    <div class="feature"><div class="icon">⇧</div><h3>Smart File Upload</h3><p>Upload PDF, DOCX, JPG, or PNG files. The system is ready for OCR and automatic text extraction.</p></div>
    <div class="feature"><div class="icon">✦</div><h3>AI Paper Generation</h3><p>Create MCQs, short questions, and long questions from uploaded educational content.</p></div>
    <div class="feature"><div class="icon">□</div><h3>Premium PDF Output</h3><p>Professional exam papers with school branding, proper formatting, and Urdu support.</p></div>
    <div class="feature"><div class="icon">⇩</div><h3>Multiple Formats</h3><p>Download papers as PDF, high-quality image, or editable DOCX format.</p></div>
    <div class="feature"><div class="icon">▭</div><h3>Flexible Credit System</h3><p>Pay only for what you need. Choose single papers or bulk plans with expiry tracking.</p></div>
    <div class="feature"><div class="icon">✓</div><h3>Auto Save Drafts</h3><p>Never lose your work. Paper settings are saved automatically while you work.</p></div>
  </section>

  <div class="title" id="pricing">
    <h2>Simple Pricing Plans</h2>
    <p>Choose the package that fits your school or academy</p>
  </div>

  <section class="pricing">
    <div class="price-card"><div class="art">📄</div><h3>Single Paper</h3><div class="amount">Rs 30</div><p>1 Paper • 1 Day</p><ul><li>One premium paper</li><li>PDF download</li><li>School format</li></ul><a class="outline">Buy Now</a></div>
    <div class="price-card"><div class="art">📘</div><h3>Basic Pack</h3><div class="amount">Rs 100</div><p>5 Papers • 7 Days</p><ul><li>5 paper credits</li><li>Premium layout</li><li>Fast generation</li></ul><a class="outline">Buy Now</a></div>
    <div class="price-card"><div class="art">🏆</div><div class="popular">MOST POPULAR</div><h3>Starter Pack</h3><div class="amount">Rs 180</div><p>10 Papers • 7 Days</p><ul><li>10 paper credits</li><li>Best for teachers</li><li>All subjects</li></ul><a class="outline">Buy Now</a></div>
    <div class="price-card"><div class="art">🎓</div><h3>Standard Pack</h3><div class="amount">Rs 300</div><p>20 Papers • 15 Days</p><ul><li>20 paper credits</li><li>Academy use</li><li>Export formats</li></ul><a class="outline">Buy Now</a></div>
    <div class="price-card"><div class="art">🚀</div><h3>Monthly Pack</h3><div class="amount">Rs 500</div><p>50 Papers • 30 Days</p><ul><li>50 paper credits</li><li>Best value</li><li>Monthly usage</li></ul><a class="outline">Buy Now</a></div>
  </section>

  <div class="title" id="faq">
    <h2>Frequently Asked Questions</h2>
    <p>Everything teachers need to know before starting</p>
  </div>

  <section class="faq">
    <details open><summary>How does PaperGenius create papers?</summary><p>You upload educational content and choose paper settings. The system creates a structured school-style exam paper.</p></details>
    <details><summary>Which file formats are supported?</summary><p>PDF, DOCX, JPG, and PNG support is planned. OCR can be connected for images.</p></details>
    <details><summary>Is Urdu supported?</summary><p>Yes, Urdu paper formatting and Jameel Noori Nastaleeq style support will be included in the full system.</p></details>
    <details><summary>How do credits work?</summary><p>Each generated paper uses one credit. Credits are added after manual payment approval.</p></details>
    <details><summary>Can I contact support?</summary><p>Yes, WhatsApp support is available through the green button.</p></details>
  </section>
</div>

<footer class="footer">
  <div>
    <a>Home</a> | <a>Pricing</a> | <a>Payment Options</a> | <a>Privacy Policy</a> | <a>Contact</a>
  </div>
  <p>Copyright © 2026 PaperGenius. All Rights Reserved.</p>
</footer>

<a class="whatsapp" href="https://wa.me/923056583822" target="_blank">☎</a>

</body>
</html>`;

http.createServer((req,res)=>{
  res.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});
  res.end(html);
}).listen(3000,()=>console.log("PaperGenius premium site running"));
