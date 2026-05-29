const http = require("http");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>PaperGenius - AI Exam Paper Generator</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:Inter,Arial,sans-serif;background:#eaf3f4;color:#07152f}
a{text-decoration:none;color:inherit}
.wrap{max-width:1080px;margin:auto;padding:0 12px}
.top{padding:18px 0 8px;display:flex;justify-content:space-between;align-items:center}
.logo{font-size:32px;font-weight:900;color:#079b3f;letter-spacing:-1px}
.contact{text-align:right;font-size:13px;font-weight:800}
.login{background:#067bb6;color:white;padding:7px 18px;border-radius:6px;display:inline-block;margin-bottom:6px}
.menu{background:linear-gradient(#fff,#e5e5e5);border:1px solid #aaa;border-radius:8px;overflow:hidden;display:flex;box-shadow:0 4px 15px #0001}
.menu a{padding:10px 18px;border-right:1px solid #bbb;font-weight:800;font-size:13px}
.menu a:first-child{background:#85c900;color:white}
.hero{background:white;border-radius:18px;margin-top:14px;padding:55px 25px;text-align:center;box-shadow:0 16px 45px #00000012}
.hero h1{font-size:58px;line-height:1.05;margin:0;font-weight:900;letter-spacing:-2px}
.hero span{color:#3478f6}
.hero p{font-size:19px;color:#53627a;max-width:720px;margin:22px auto}
.btn{display:inline-block;background:#089b45;color:white;padding:13px 26px;border-radius:9px;font-weight:900;margin:5px;border:none}
.btn.alt{background:white;color:#07152f;border:1px solid #d7deea}
.stats{border-top:1px solid #dce4ee;margin-top:48px;padding-top:28px;display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.stat b{font-size:29px}.stat p{margin:6px 0;color:#60708a}
.title{text-align:center;margin:55px 0 24px}.title h2{font-size:34px;margin:0;font-weight:900}.title p{color:#60708a;font-size:17px}
.features,.forms{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.feature,.formbox{background:white;border:1px solid #e3ebf3;padding:26px;border-radius:18px;box-shadow:0 10px 25px #0000000c;transition:.25s}
.feature:hover,.formbox:hover{transform:translateY(-6px);box-shadow:0 20px 45px #079b3f24}
.icon{width:50px;height:50px;border-radius:14px;background:#eaf2ff;color:#3478f6;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:16px}
.feature h3,.formbox h3{font-size:21px;margin:0 0 10px}.feature p{color:#5b6b84;line-height:1.65;font-size:15px}
.pricing{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
.price-card{background:white;border-radius:22px;overflow:hidden;text-align:center;box-shadow:0 18px 45px #00000014;border:1px solid #e4ebf3;position:relative;transition:.25s}
.price-card:hover{transform:translateY(-8px)}
.art{height:120px;background:linear-gradient(135deg,#0038ff,#10d4ff);display:flex;align-items:center;justify-content:center;color:white;font-size:50px}
.popular{position:absolute;top:98px;left:50%;transform:translateX(-50%);background:#085cff;color:white;font-size:12px;padding:8px 18px;border-radius:20px;font-weight:900}
.price-card h3{font-size:25px;margin:28px 0 8px}
.amount{font-size:45px;font-weight:900;color:#0038ff}
.price-card p{color:#52627a;font-weight:700}
.price-card ul{list-style:none;padding:0 36px;text-align:left;line-height:2.15;color:#1b2d48;font-size:15px}
.price-card li:before{content:"✓";color:#0038ff;font-weight:900;margin-right:10px}
.outline{display:inline-block;border:2px solid #0038ff;color:#0038ff;padding:12px 28px;border-radius:12px;margin:12px 0 26px;font-weight:900}
.formbox input{width:100%;padding:13px;border:1px solid #d7deea;border-radius:10px;margin:8px 0;font-family:Inter}
.formbox button{width:100%;padding:13px;background:#079b3f;color:white;border:0;border-radius:10px;font-weight:900;margin-top:8px}
.about{background:white;border-radius:18px;padding:34px;box-shadow:0 12px 35px #00000010;line-height:1.8;color:#51627a;font-size:16px}
.about h2{margin-top:0;color:#07152f;font-size:32px}
.faq{max-width:900px;margin:0 auto 45px}
.faq details{background:white;margin:13px 0;border-radius:14px;padding:19px 23px;box-shadow:0 8px 25px #0000000e;border:1px solid #e5ecf4}
.faq summary{cursor:pointer;font-size:17px;font-weight:900}
.faq p{color:#5b6b84;line-height:1.7}
.footer{margin-top:40px}
.footer-menu{background:linear-gradient(#fff,#ddd);border-top:1px solid #bbb;border-bottom:1px solid #bbb;text-align:center;padding:12px}
.footer-menu a{margin:0 12px;font-size:13px;font-weight:800}
.footer-bottom{background:#087da0;color:white;text-align:center;padding:18px;font-size:13px}
.whatsapp{position:fixed;right:24px;bottom:24px;background:#25d366;color:white;width:62px;height:62px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:31px;box-shadow:0 12px 35px #25d36680;z-index:99}
@media(max-width:900px){.features,.pricing,.stats,.forms{grid-template-columns:1fr 1fr}.hero h1{font-size:42px}.menu{overflow-x:auto}.menu a{white-space:nowrap}}
@media(max-width:620px){.top{display:block;text-align:center}.contact{text-align:center;margin-top:10px}.features,.pricing,.stats,.forms{grid-template-columns:1fr}.hero h1{font-size:34px}.hero{padding:42px 15px}}
</style>
</head>
<body>

<div class="wrap">
  <div class="top">
    <div class="logo">PaperGenius</div>
    <div class="contact">
      <a class="login" href="#login">CLIENT LOGIN</a><br>
      WhatsApp: 0305-6583822
    </div>
  </div>

  <nav class="menu">
    <a href="#">Home</a>
    <a href="#features">Features</a>
    <a href="#pricing">Pricing</a>
    <a href="#login">Login</a>
    <a href="#signup">Sign Up</a>
    <a href="#admin">Admin Login</a>
    <a href="#forgot">Forgot Password</a>
    <a href="#faq">FAQs</a>
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
    <div class="feature"><div class="icon">⇧</div><h3>Smart File Upload</h3><p>Upload PDF, DOCX, JPG, or PNG files. OCR-ready system for scanned notes and book pages.</p></div>
    <div class="feature"><div class="icon">✦</div><h3>AI Paper Generation</h3><p>Create MCQs, short questions, and long questions from uploaded educational content.</p></div>
    <div class="feature"><div class="icon">□</div><h3>Premium PDF Output</h3><p>Professional exam papers with school branding, clean layout, and Urdu support.</p></div>
  </section>

  <div class="title" id="pricing">
    <h2>Premium Pricing Plans</h2>
    <p>Simple packages for teachers, schools and academies</p>
  </div>

  <section class="pricing">
    <div class="price-card"><div class="art">📘</div><h3>Basic Pack</h3><div class="amount">Rs 100</div><p>5 Papers • 7 Days</p><ul><li>5 paper credits</li><li>Premium paper layout</li><li>PDF download</li><li>School format</li></ul><a class="outline">Buy Now</a></div>
    <div class="price-card"><div class="art">🎓</div><div class="popular">BEST VALUE</div><h3>Standard Pack</h3><div class="amount">Rs 300</div><p>15 Papers • 15 Days</p><ul><li>15 paper credits</li><li>Best for teachers</li><li>All subjects support</li><li>Export formats</li></ul><a class="outline">Buy Now</a></div>
    <div class="price-card"><div class="art">🚀</div><h3>Monthly Pack</h3><div class="amount">Rs 500</div><p>30 Papers • 30 Days</p><ul><li>30 paper credits</li><li>Best for academies</li><li>Monthly usage</li><li>Priority support</li></ul><a class="outline">Buy Now</a></div>
  </section>

  <div class="title">
    <h2>Account Access</h2>
    <p>User login, signup, admin login and password recovery</p>
  </div>

  <section class="forms">
    <div class="formbox" id="login">
      <h3>User Login</h3>
      <input placeholder="Email Address">
      <input placeholder="Password" type="password">
      <button>Login</button>
    </div>

    <div class="formbox" id="signup">
      <h3>Create Account</h3>
      <input placeholder="Full Name">
      <input placeholder="Email Address">
      <input placeholder="Password" type="password">
      <button>Sign Up</button>
    </div>

    <div class="formbox" id="admin">
      <h3>Admin Login</h3>
      <input placeholder="Admin Email">
      <input placeholder="Admin Password" type="password">
      <button>Admin Login</button>
    </div>

    <div class="formbox" id="forgot">
      <h3>Forgot Password</h3>
      <input placeholder="Enter your email">
      <button>Reset Password</button>
    </div>

    <div class="formbox">
      <h3>Payment Support</h3>
      <input placeholder="Transaction ID">
      <input placeholder="WhatsApp Number">
      <button>Submit Payment</button>
    </div>

    <div class="formbox">
      <h3>Quick Contact</h3>
      <input placeholder="Your Name">
      <input placeholder="Your Message">
      <button>Send Message</button>
    </div>
  </section>

  <div class="title">
    <h2>About PaperGenius</h2>
    <p>A smart education tool for modern teachers</p>
  </div>

  <section class="about">
    <h2>Why PaperGenius?</h2>
    <p>PaperGenius is designed for schools, academies, tuition centers and teachers who want to create professional exam papers quickly. Teachers can upload educational content, choose paper settings and generate clean school-style papers with proper sections, marks and layout.</p>
  </section>

  <div class="title" id="faq">
    <h2>Frequently Asked Questions</h2>
    <p>Everything teachers need to know before starting</p>
  </div>

  <section class="faq">
    <details open><summary>How does PaperGenius create papers?</summary><p>You upload educational content and choose paper settings. The system creates a structured school-style exam paper.</p></details>
    <details><summary>Which packages are available?</summary><p>Basic Pack Rs 100 for 5 papers, Standard Pack Rs 300 for 15 papers, and Monthly Pack Rs 500 for 30 papers.</p></details>
    <details><summary>Is Urdu supported?</summary><p>Yes, Urdu paper formatting and Jameel Noori Nastaleeq style support will be included in the full system.</p></details>
    <details><summary>How do credits work?</summary><p>Each generated paper uses one credit. Credits are added after payment approval.</p></details>
  </section>
</div>

<footer class="footer">
  <div class="footer-menu">
    <a>Home</a> | <a>Pricing</a> | <a>Payment Options</a> | <a>Privacy Policy</a> | <a>Contact</a>
  </div>
  <div class="footer-bottom">
    Copyright © 2026 PaperGenius - All Rights Reserved.<br>
    WhatsApp Support: 0305-6583822
  </div>
</footer>

<a class="whatsapp" href="https://wa.me/923056583822" target="_blank">☎</a>

</body>
</html>`;

http.createServer((req,res)=>{
  res.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});
  res.end(html);
}).listen(3000,()=>console.log("PaperGenius premium site running"));
