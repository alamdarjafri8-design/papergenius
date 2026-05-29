const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

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

/* Header */
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

/* Hero */
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

/* Stats */
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

/* Section */
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

/* Generator */
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
.field select:focus,.field input:focus{
  border-color:#2f7df6;
  box-shadow:0 0 0 4px rgba(47,125,246,.12);
}
.gen-note{
  margin-top:16px;
  color:#53657f;
  font-size:14px;
  line-height:1.6;
}

/* Features */
.features{
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
  transition:.25s ease;
}
.feature-card:hover{
  transform:translateY(-6px);
  box-shadow:0 25px 70px rgba(47,125,246,.14);
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

/* Pricing */
.pricing{
  background:linear-gradient(180deg,#ffffff,#f4faff);
}
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
.price-card.popular{
  border:2px solid #2f7df6;
  transform:scale(1.03);
}
.pop-badge{
  position:absolute;
  top:-18px;
  left:50%;
  transform:translateX(-50%);
  background:linear-gradient(135deg,#2f7df6,#22c7b8);
  color:white;
  padding:9px 20px;
  border-radius:50px;
  font-size:12px;
  font-weight:950;
}
.price-card h3{font-size:22px;margin:0 0 10px}
.amount{
  font-size:42px;
  font-weight:950;
  letter-spacing:-2px;
}
.valid{
  display:inline-block;
  margin:10px 0 22px;
  padding:6px 10px;
  border-radius:9px;
  background:#eef6ff;
  color:#53657f;
  font-size:13px;
  font-weight:800;
}
.price-card ul{
  padding:0;
  list-style:none;
  line-height:2;
  color:#42526b;
  margin:0 0 24px;
}
.price-card li:before{
  content:"✓ ";
  color:#2f7df6;
  font-weight:950;
}

/* FAQ */
.faq{
  background:#fff;
}
.faq-box{
  max-width:860px;
  margin:auto;
  display:grid;
  gap:15px;
}
.faq-item{
  border:1px solid #dbeafe;
  border-radius:18px;
  background:linear-gradient(180deg,#fff,#f8fbff);
  box-shadow:0 12px 32px rgba(16,24,40,.05);
  overflow:hidden;
}
.faq-q{
  padding:20px 22px;
  font-weight:950;
  display:flex;
  justify-content:space-between;
  cursor:pointer;
}
.faq-a{
  display:none;
  padding:0 22px 20px;
  color:#53657f;
  line-height:1.7;
}
.faq-item.active .faq-a{display:block}

/* Footer */
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
.footer h3,.footer h4{margin:0 0 16px}
.footer p,.footer a{
  color:#53657f;
  line-height:1.8;
  font-size:14px;
  display:block;
}
.footer-line{
  max-width:1180px;
  margin:35px auto 0;
  border-top:1px solid #d5e2f1;
  padding:22px 0;
  display:flex;
  justify-content:space-between;
  gap:16px;
  flex-wrap:wrap;
  color:#53657f;
  font-size:14px;
}
.payments{
  font-weight:950;
  color:#2f7df6;
}
.copy-strip{
  background:#0d86ad;
  color:#fff;
  text-align:center;
  padding:13px;
  font-size:13px;
}

/* WhatsApp */
.whatsapp{
  position:fixed;
  right:18px;
  bottom:18px;
  background:#22c55e;
  color:#fff;
  padding:14px 20px;
  border-radius:50px;
  font-weight:950;
  box-shadow:0 18px 35px rgba(34,197,94,.35);
  z-index:999;
}

/* Responsive */
@media(max-width:900px){
  .stats-box,.feature-grid,.price-grid,.footer-grid{grid-template-columns:1fr 1fr}
  .pg-logo-area{flex-direction:column;text-align:center;gap:8px}
  .pg-contact{text-align:center}
  .pg-nav{flex-direction:column}
  .pg-menu{justify-content:center}
  .pg-start{margin:8px}
}
@media(max-width:620px){
  .stats-box,.feature-grid,.price-grid,.footer-grid,.gen-grid{grid-template-columns:1fr}
  .hero{padding-top:58px}
  .gen-card{padding:22px}
  .price-card.popular{transform:none}
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
    <p>Upload JPG, PNG, PDF or DOCX. Topic typing system is removed. Paper will be generated from uploaded content.</p>
  </div>

  <div class="gen-card">
    <form action="/generate-paper" method="POST" enctype="multipart/form-data">
      <div class="upload-box">
        <h3>Upload Book Page / Notes / Past Paper</h3>
        <p>Supported: JPG, PNG, PDF, DOCX</p>
        <input type="file" name="paperFile" accept=".jpg,.jpeg,.png,.pdf,.docx" required>
      </div>

      <div class="gen-grid">
        <div class="field">
          <label>Paper Type</label>
          <select name="paperType" required>
            <option>Mixed Paper</option>
            <option>MCQs Only</option>
            <option>Short Questions</option>
            <option>Long Questions</option>
          </select>
        </div>

        <div class="field">
          <label>Total Marks</label>
          <input type="number" name="marks" placeholder="Example: 50" required>
        </div>
      </div>

      <button class="btn btn-main" type="submit" style="width:100%;margin-top:22px;font-size:16px;">Generate Paper</button>
      <p class="gen-note">Real AI backend, OCR, file reading and PDF download will be connected in next step.</p>
    </form>
  </div>
</section>

<section class="section features" id="features">
  <div class="section-title">
    <span class="badge">Features</span>
    <h2>Everything you need to create perfect papers</h2>
    <p>Powerful features designed specifically for educators, schools and academies.</p>
  </div>

  <div class="pg-shell feature-grid">
    <div class="feature-card"><div class="icon">↑</div><h3>Smart file upload</h3><p>Upload PDF, DOCX, JPG or PNG files. AI extracts content automatically.</p></div>
    <div class="feature-card"><div class="icon">AI</div><h3>AI-powered generation</h3><p>Advanced AI analyzes your content and creates structured exam questions.</p></div>
    <div class="feature-card"><div class="icon">PDF</div><h3>Premium PDF output</h3><p>Professional exam papers with clean formatting and school-ready layout.</p></div>
    <div class="feature-card"><div class="icon">↓</div><h3>Multiple formats</h3><p>Download papers as PDF, high-quality images, or editable DOCX files later.</p></div>
    <div class="feature-card"><div class="icon">₨</div><h3>Flexible credit system</h3><p>Pay only for what you need with simple credit packs and expiry tracking.</p></div>
    <div class="feature-card"><div class="icon">✓</div><h3>Auto-save drafts</h3><p>Never lose your work. Paper settings and drafts will be saved automatically.</p></div>
  </div>
</section>

<section class="section pricing" id="pricing">
  <div class="section-title">
    <span class="badge">Pricing</span>
    <h2>Simple credit plans</h2>
    <p>Choose a pack and start generating papers quickly.</p>
  </div>

  <div class="pg-shell price-grid">
    <div class="price-card">
      <h3>Basic Pack</h3>
      <div class="amount">Rs 100</div>
      <span class="valid">Valid for 7 days</span>
      <ul>
        <li>5 Credits</li>
        <li>Upload based generation</li>
        <li>PDF export support</li>
      </ul>
      <a class="btn btn-main" style="width:100%" href="#">Select Basic Pack</a>
    </div>

    <div class="price-card popular">
      <div class="pop-badge">MOST POPULAR</div>
      <h3>Standard Pack</h3>
      <div class="amount">Rs 300</div>
      <span class="valid">Valid for 15 days</span>
      <ul>
        <li>15 Credits</li>
        <li>All paper types</li>
        <li>Best value for teachers</li>
      </ul>
      <a class="btn btn-main" style="width:100%" href="#">Select Standard Pack</a>
    </div>

    <div class="price-card">
      <h3>Pro Pack</h3>
      <div class="amount">Rs 500</div>
      <span class="valid">Valid for 25 days</span>
      <ul>
        <li>30 Credits</li>
        <li>Priority generation</li>
        <li>Premium support</li>
      </ul>
      <a class="btn btn-main" style="width:100%" href="#">Select Pro Pack</a>
    </div>
  </div>
</section>

<section class="section faq" id="faq">
  <div class="section-title">
    <span class="badge">FAQ</span>
    <h2>Frequently asked questions</h2>
    <p>Quick answers about PaperGenius.</p>
  </div>

  <div class="faq-box">
    <div class="faq-item"><div class="faq-q">How does the credit system work? <span>⌄</span></div><div class="faq-a">Each generated paper uses credits according to selected paper type and output format.</div></div>
    <div class="faq-item"><div class="faq-q">What file formats can I upload? <span>⌄</span></div><div class="faq-a">You can upload JPG, PNG, PDF and DOCX files.</div></div>
    <div class="faq-item"><div class="faq-q">Can I edit generated papers? <span>⌄</span></div><div class="faq-a">Editing and draft features will be added with backend dashboard.</div></div>
    <div class="faq-item"><div class="faq-q">Is Urdu language supported? <span>⌄</span></div><div class="faq-a">Urdu support will be added with proper Urdu font and formatting.</div></div>
    <div class="faq-item"><div class="faq-q">How do I get credits after payment? <span>⌄</span></div><div class="faq-a">Credits will be added to your account after payment confirmation.</div></div>
  </div>
</section>

<footer class="footer">
  <div class="footer-grid">
    <div>
      <h3>PaperGenius</h3>
      <p>AI-powered exam paper generator for schools and educators. Create professional papers in minutes.</p>
    </div>

    <div>
      <h4>Quick Links</h4>
      <a href="#">Home</a>
      <a href="#features">Features</a>
      <a href="#pricing">Pricing</a>
      <a href="#">CV Builder</a>
      <a href="#">Cover Letter</a>
    </div>

    <div>
      <h4>Legal</h4>
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
      <a href="#">Refund Policy</a>
    </div>

    <div>
      <h4>Contact</h4>
      <p>0300-0000000</p>
      <p>support@papergenius.com</p>
      <p>Lahore, Pakistan</p>
    </div>
  </div>

  <div class="footer-line">
    <span>© 2026 PaperGenius. All rights reserved.</span>
    <span class="payments">JazzCash • Easypaisa • Bank Transfer</span>
  </div>

  <div class="copy-strip">
    Premium AI Paper Generator for Teachers, Schools & Academies
  </div>
</footer>

<a class="whatsapp" href="https://wa.me/923000000000" target="_blank">WhatsApp Support</a>

<script>
document.querySelectorAll(".faq-item").forEach(item=>{
  item.querySelector(".faq-q").addEventListener("click",()=>{
    item.classList.toggle("active");
  });
});
</script>

</body>
</html>`);
});

app.post("/generate-paper", (req, res) => {
  res.send("Backend next step: file upload + AI generation will be added here.");
});

app.listen(PORT, () => {
  console.log("PaperGenius frontend running on port " + PORT);
});
