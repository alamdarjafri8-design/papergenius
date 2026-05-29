const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function layout(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
*{box-sizing:border-box}
body{margin:0;font-family:Inter,Arial,sans-serif;background:#fff;color:#101828}
a{text-decoration:none;color:inherit}
.header{position:sticky;top:0;z-index:99;background:rgba(255,255,255,.92);backdrop-filter:blur(14px);border-bottom:1px solid #e8f5ec}
.nav{max-width:1180px;margin:auto;padding:13px 18px;display:flex;align-items:center;justify-content:space-between}
.logo{font-size:24px;font-weight:950;color:#111827}
.logo span{color:#25D366}
.menu{display:flex;gap:20px;font-size:14px;font-weight:800;color:#344054}
.btn{display:inline-flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#25D366,#128c3a);color:#fff;padding:12px 18px;border-radius:14px;font-weight:950;box-shadow:0 12px 28px rgba(37,211,102,.25)}
.btn-dark{background:#101828;color:#fff;padding:12px 18px;border-radius:14px;font-weight:950}
.hero{padding:90px 18px 70px;background:radial-gradient(circle at top,#dcffe9 0,#fff 58%);text-align:center}
.hero h1{max-width:930px;margin:0 auto 18px;font-size:clamp(38px,6vw,76px);line-height:1.02;letter-spacing:-2.5px;color:#101828}
.hero p{max-width:740px;margin:auto;color:#667085;font-size:18px;line-height:1.75}
.hero-actions{margin-top:30px;display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.section{padding:70px 18px}
.wrap{max-width:1180px;margin:auto}
.title{text-align:center;max-width:760px;margin:0 auto 36px}
.badge{display:inline-flex;padding:8px 16px;border-radius:50px;background:#eafff1;color:#128c3a;font-size:13px;font-weight:950}
.title h2{font-size:clamp(30px,4vw,48px);margin:14px 0 10px;letter-spacing:-1.4px;color:#101828}
.title p{color:#667085;line-height:1.7;font-size:16px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.card{background:#fff;border:1px solid #e8f5ec;border-radius:26px;padding:26px;box-shadow:0 18px 55px rgba(16,24,40,.06)}
.card h3{margin:0 0 10px;font-size:22px;color:#101828}
.card p{margin:0;color:#667085;line-height:1.7}
.price{font-size:38px;font-weight:950;color:#128c3a;margin:14px 0}
.card ul{margin:18px 0 0;padding-left:20px;color:#475467;line-height:1.9}
.feature-icon{width:48px;height:48px;border-radius:16px;background:#eafff1;display:flex;align-items:center;justify-content:center;color:#128c3a;font-weight:950;margin-bottom:16px}
.about{background:linear-gradient(180deg,#f7fff9,#fff)}
.faq{max-width:900px;margin:auto;display:grid;gap:14px}
.faq-item{background:#fff;border:1px solid #e8f5ec;border-radius:20px;padding:20px;box-shadow:0 12px 35px rgba(16,24,40,.04)}
.faq-item b{display:block;margin-bottom:7px;color:#101828}
.faq-item p{margin:0;color:#667085;line-height:1.65}
.auth{padding:70px 18px;background:#f7fff9}
.auth-grid{max-width:1180px;margin:auto;display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.auth-card{background:#fff;border:1px solid #e8f5ec;border-radius:22px;padding:22px;box-shadow:0 16px 45px rgba(16,24,40,.06)}
.auth-card h3{margin:0 0 10px}
.auth-card p{color:#667085;line-height:1.6}
.footer{background:#101828;color:#fff;padding:35px 18px}
.foot{max-width:1180px;margin:auto;display:flex;justify-content:space-between;gap:18px;align-items:center}
.foot p{color:#98a2b3;margin:6px 0 0}
.whatsapp{position:fixed;right:18px;bottom:18px;background:#25D366;color:#fff;padding:14px 18px;border-radius:50px;font-weight:950;box-shadow:0 16px 35px rgba(37,211,102,.35);z-index:100}
.dash{min-height:80vh;padding:70px 18px;background:linear-gradient(180deg,#f7fff9,#fff)}
.dashbox{max-width:850px;margin:auto;background:#fff;border:1px solid #e8f5ec;border-radius:28px;padding:30px;box-shadow:0 25px 70px rgba(16,24,40,.08)}
.field{margin-bottom:16px}
.field label{display:block;font-weight:900;margin-bottom:8px;color:#1d2939}
.field input,.field select{width:100%;padding:15px;border:1px solid #d0d5dd;border-radius:16px;font-size:15px}
.note{background:#eafff1;color:#128c3a;border-radius:16px;padding:14px;font-weight:800;margin-top:18px}
@media(max-width:900px){.grid3,.auth-grid{grid-template-columns:1fr 1fr}.menu{display:none}.foot{flex-direction:column;text-align:center}}
@media(max-width:620px){.grid3,.auth-grid{grid-template-columns:1fr}.hero{padding-top:60px}.card{padding:22px}.dashbox{padding:22px 16px}}
</style>
</head>
<body>
<header class="header">
  <div class="nav">
    <a class="logo" href="/">Paper<span>Genius</span></a>
    <nav class="menu">
      <a href="/#features">Features</a>
      <a href="/#pricing">Pricing</a>
      <a href="/#about">About</a>
      <a href="/#faq">FAQ</a>
    </nav>
    <a class="btn" href="/dashboard">Start Now</a>
  </div>
</header>
${body}
<footer class="footer">
  <div class="foot">
    <div>
      <div class="logo" style="color:#fff">Paper<span>Genius</span></div>
      <p>Premium AI paper generator for teachers, schools and academies.</p>
    </div>
    <a class="btn" href="/dashboard">Generate Paper</a>
  </div>
</footer>
<a class="whatsapp" href="https://wa.me/923000000000" target="_blank">WhatsApp Support</a>
</body>
</html>`;
}

app.get("/", (req, res) => {
  res.send(layout("PaperGenius - AI Paper Generator", `
<section class="hero">
  <h1>Premium AI Paper Generator for Schools & Teachers</h1>
  <p>Create exam papers, tests, worksheets and assessment material with a clean, fast and professional platform made for academies, schools and teachers.</p>
  <div class="hero-actions">
    <a class="btn" href="/dashboard">Start Generating</a>
    <a class="btn-dark" href="#pricing">View Pricing</a>
  </div>
</section>

<section class="section" id="features">
  <div class="wrap">
    <div class="title">
      <span class="badge">Premium Features</span>
      <h2>Smart, Fast & Teacher Friendly</h2>
      <p>PaperGenius keeps paper creation simple, beautiful and professional.</p>
    </div>
    <div class="grid3">
      <div class="card"><div class="feature-icon">AI</div><h3>Image Based Paper</h3><p>Upload original book page, notes or paper image and generate paper from that content.</p></div>
      <div class="card"><div class="feature-icon">PDF</div><h3>PDF Ready</h3><p>Clean preview and PDF download system for academic use.</p></div>
      <div class="card"><div class="feature-icon">⚡</div><h3>Fast Hosting</h3><p>Lightweight Node.js setup built for speed and Hostinger deployment.</p></div>
    </div>
  </div>
</section>

<section class="section" id="pricing">
  <div class="wrap">
    <div class="title">
      <span class="badge">Pricing</span>
      <h2>Simple Credit Plans</h2>
      <p>Buy credits and generate papers anytime.</p>
    </div>
    <div class="grid3">
      <div class="card"><h3>Starter</h3><div class="price">100 Credits</div><ul><li>Basic generation</li><li>Image upload</li><li>Paper preview</li></ul></div>
      <div class="card"><h3>Popular</h3><div class="price">300 Credits</div><ul><li>Mixed papers</li><li>MCQs / short / long</li><li>Better value</li></ul></div>
      <div class="card"><h3>Pro</h3><div class="price">500 Credits</div><ul><li>Full access</li><li>PDF support</li><li>Priority support</li></ul></div>
    </div>
  </div>
</section>

<section class="section about" id="about">
  <div class="wrap">
    <div class="title">
      <span class="badge">About</span>
      <h2>Built for Real Teachers</h2>
      <p>PaperGenius helps teachers and academies save time by converting study material images into structured test papers.</p>
    </div>
  </div>
</section>

<section class="auth">
  <div class="auth-grid">
    <div class="auth-card"><h3>Login</h3><p>Teacher login area for accessing dashboard.</p></div>
    <div class="auth-card"><h3>Signup</h3><p>New users can create account and start using credits.</p></div>
    <div class="auth-card"><h3>Admin Login</h3><p>Admin area for users, orders and credits management.</p></div>
    <div class="auth-card"><h3>Forgot Password</h3><p>Password recovery flow for users.</p></div>
  </div>
</section>

<section class="section" id="faq">
  <div class="title">
    <span class="badge">FAQ</span>
    <h2>Common Questions</h2>
  </div>
  <div class="faq">
    <div class="faq-item"><b>Does generator show on homepage?</b><p>No. Homepage is only landing page. Generator is inside dashboard.</p></div>
    <div class="faq-item"><b>Will paper generate from image?</b><p>Yes. The planned system is image upload based, not topic typing based.</p></div>
    <div class="faq-item"><b>Is this mobile responsive?</b><p>Yes, the design is responsive for mobile, tablet and desktop.</p></div>
  </div>
</section>
`));
});

app.get("/dashboard", (req, res) => {
  res.send(layout("PaperGenius Dashboard", `
<section class="dash">
  <div class="dashbox">
    <div class="title" style="margin-bottom:24px">
      <span class="badge">Dashboard</span>
      <h2>Generate Paper From Image</h2>
      <p>Upload original book page, notes image or paper image. Real AI image reading will be connected in next backend step.</p>
    </div>

    <form action="/generate-paper" method="POST" enctype="multipart/form-data">
      <div class="field">
        <label>Upload Original Image</label>
        <input type="file" name="paperImage" accept="image/*" required>
      </div>

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
        <input type="number" name="marks" placeholder="50" required>
      </div>

      <button class="btn" type="submit" style="border:0;width:100%;font-size:16px;cursor:pointer">Generate Paper From Image</button>
    </form>

    <div class="note">Frontend fixed: generator homepage par nahi hai. Ye sirf dashboard mein hai.</div>
  </div>
</section>
`));
});

app.post("/generate-paper", (req, res) => {
  res.send(layout("PaperGenius - Paper Generated", `
<section class="dash">
  <div class="dashbox">
    <span class="badge">Backend Step Pending</span>
    <h2>Image Upload Backend Next Step Hai</h2>
    <p style="color:#667085;line-height:1.7">
      Design aur routing working hai. Ab next step mein image receive karne ke liye <b>multer</b>,
      image reading ke liye <b>AI Vision API</b>, aur PDF download add hoga.
    </p>
    <a class="btn" href="/dashboard">Back to Dashboard</a>
  </div>
</section>
`));
});

app.listen(PORT, () => {
  console.log("PaperGenius running on port " + PORT);
});
