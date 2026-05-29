const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static(UPLOAD_DIR));

mongoose.connect(process.env.MONGODB_URI || "")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err.message));

app.use(session({
  secret: process.env.SESSION_SECRET || "papergenius_secret_123",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  credits: { type: Number, default: 0 },
  resetToken: String
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  pack: String,
  price: Number,
  credits: Number,
  days: Number,
  status: { type: String, default: "pending" },
  paymentMethod: String,
  screenshot: String
}, { timestamps: true });

const paperSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  file: String,
  status: String,
  deleteAt: Date
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
const Order = mongoose.model("Order", orderSchema);
const Paper = mongoose.model("Paper", paperSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-"))
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".pdf", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) return cb(new Error("Only JPG, PNG, PDF, DOCX allowed"));
    cb(null, true);
  }
});

function auth(req, res, next) {
  if (!req.session.userId) return res.redirect("/login");
  next();
}

function adminOnly(req, res, next) {
  if (!req.session.userId || req.session.role !== "admin") return res.redirect("/admin-login");
  next();
}

function appShell(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;font-family:Inter,Arial,sans-serif;color:#07142f;background:#f6fbff}
a{text-decoration:none;color:inherit}.pg-shell{max-width:1180px;margin:auto;padding:0 18px}
.pg-top{background:linear-gradient(180deg,#eef8ff,#ffffff);border-bottom:1px solid #dbeafe}
.pg-logo-area{max-width:1180px;margin:auto;padding:18px 18px 10px;display:flex;align-items:center;justify-content:space-between}
.logo{font-size:30px;font-weight:950;letter-spacing:-1px}.logo span{color:#2f7df6}
.pg-contact{text-align:right;font-size:13px;color:#42526b;line-height:1.6;font-weight:700}
.pg-nav-wrap{max-width:1180px;margin:auto;padding:0 18px 14px}
.pg-nav{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(180deg,#fff,#eef6ff);border:1px solid #cfe3ff;border-radius:12px;overflow:hidden;box-shadow:0 12px 30px rgba(47,125,246,.10)}
.pg-menu{display:flex;flex-wrap:wrap}.pg-menu a{padding:13px 18px;font-size:14px;font-weight:900;border-right:1px solid #dbeafe}
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
.stat{text-align:center}.stat b{font-size:34px;color:#07142f;letter-spacing:-1px}.stat span{display:block;margin-top:6px;color:#53657f;font-weight:700}
.section{padding:82px 18px}.section-title{text-align:center;max-width:780px;margin:0 auto 42px}
.badge{display:inline-flex;padding:8px 16px;border-radius:50px;background:#eaf3ff;color:#2f7df6;font-weight:950;font-size:13px}
.section-title h2{font-size:clamp(30px,4vw,48px);margin:14px 0 12px;letter-spacing:-1.5px}.section-title p{color:#53657f;line-height:1.7;font-size:16px}
.generator{background:linear-gradient(180deg,#f4faff,#ffffff)}
.gen-card{max-width:940px;margin:auto;border-radius:30px;padding:34px;background:linear-gradient(180deg,rgba(255,255,255,.92),rgba(255,255,255,.78));border:1px solid #dbeafe;box-shadow:0 30px 80px rgba(16,24,40,.10)}
.upload-box{border:2px dashed #98c2ff;background:#f8fbff;border-radius:24px;padding:32px;text-align:center}
.upload-box input{margin-top:18px;width:100%;max-width:420px;padding:14px;border-radius:14px;background:#fff;border:1px solid #d7e6ff}
.gen-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px}
.field label{display:block;font-weight:950;margin-bottom:8px}.field select,.field input{width:100%;padding:15px;border-radius:16px;border:1px solid #d7e6ff;outline:none;font-size:15px;background:#fff}
.features{background:#fff}.feature-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.feature-card{padding:28px;border-radius:26px;background:linear-gradient(180deg,#ffffff,#f8fbff);border:1px solid #dbeafe;box-shadow:0 18px 45px rgba(16,24,40,.06);transition:.25s ease}
.feature-card:hover{transform:translateY(-6px);box-shadow:0 25px 70px rgba(47,125,246,.14)}
.icon{width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,#eaf3ff,#defbf7);display:flex;align-items:center;justify-content:center;font-weight:950;color:#2f7df6;margin-bottom:18px}
.feature-card h3{font-size:21px;margin:0 0 10px}.feature-card p{color:#53657f;line-height:1.7;margin:0}
.pricing{background:linear-gradient(180deg,#ffffff,#f4faff)}.price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.price-card{position:relative;background:#fff;border:1px solid #dbeafe;border-radius:28px;padding:30px;box-shadow:0 22px 60px rgba(16,24,40,.07)}
.price-card.popular{border:2px solid #2f7df6;transform:scale(1.03)}
.pop-badge{position:absolute;top:-18px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#2f7df6,#22c7b8);color:white;padding:9px 20px;border-radius:50px;font-size:12px;font-weight:950}
.amount{font-size:42px;font-weight:950;letter-spacing:-2px}.valid{display:inline-block;margin:10px 0 22px;padding:6px 10px;border-radius:9px;background:#eef6ff;color:#53657f;font-size:13px;font-weight:800}
.price-card ul{padding:0;list-style:none;line-height:2;color:#42526b;margin:0 0 24px}.price-card li:before{content:"✓ ";color:#2f7df6;font-weight:950}
.faq{background:#fff}.faq-box{max-width:860px;margin:auto;display:grid;gap:15px}.faq-item{border:1px solid #dbeafe;border-radius:18px;background:linear-gradient(180deg,#fff,#f8fbff);box-shadow:0 12px 32px rgba(16,24,40,.05);overflow:hidden}.faq-q{padding:20px 22px;font-weight:950;display:flex;justify-content:space-between;cursor:pointer}.faq-a{display:none;padding:0 22px 20px;color:#53657f;line-height:1.7}.faq-item.active .faq-a{display:block}
.footer{background:#eef3f8;border-top:1px solid #dbeafe;padding:55px 18px 0}.footer-grid{max-width:1180px;margin:auto;display:grid;grid-template-columns:2fr 1fr 1fr 1.5fr;gap:36px}
.footer h3,.footer h4{margin:0 0 16px}.footer p,.footer a{color:#53657f;line-height:1.8;font-size:14px;display:block}
.footer-line{max-width:1180px;margin:35px auto 0;border-top:1px solid #d5e2f1;padding:22px 0;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;color:#53657f;font-size:14px}
.copy-strip{background:#0d86ad;color:#fff;text-align:center;padding:13px;font-size:13px}
.whatsapp{position:fixed;right:18px;bottom:18px;background:#22c55e;color:#fff;padding:14px 20px;border-radius:50px;font-weight:950;box-shadow:0 18px 35px rgba(34,197,94,.35);z-index:999}
.dash{padding:55px 18px;min-height:70vh;background:#f4faff}.box{max-width:1100px;margin:auto;background:#fff;border:1px solid #dbeafe;border-radius:26px;padding:28px;box-shadow:0 25px 70px rgba(16,24,40,.08)}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.card{background:#f8fbff;border:1px solid #dbeafe;padding:22px;border-radius:20px}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #e5e7eb;padding:12px;text-align:left}.small{color:#53657f}
@media(max-width:900px){.stats-box,.feature-grid,.price-grid,.footer-grid,.grid{grid-template-columns:1fr 1fr}.pg-logo-area{flex-direction:column;text-align:center;gap:8px}.pg-contact{text-align:center}.pg-nav{flex-direction:column}.pg-menu{justify-content:center}.pg-start{margin:8px}}
@media(max-width:620px){.stats-box,.feature-grid,.price-grid,.footer-grid,.gen-grid,.grid{grid-template-columns:1fr}.hero{padding-top:58px}.gen-card{padding:22px}.price-card.popular{transform:none}}
</style>
</head>
<body>
<header class="pg-top">
  <div class="pg-logo-area">
    <a class="logo" href="/">Paper<span>Genius</span></a>
    <div class="pg-contact">AI Exam Paper Generator<br>WhatsApp Support: ${process.env.WHATSAPP_NUMBER || "0300-0000000"}</div>
  </div>
  <div class="pg-nav-wrap">
    <nav class="pg-nav">
      <div class="pg-menu">
        <a href="/">Home</a><a href="/#generator">Paper Generator</a><a href="/#features">Features</a><a href="/#pricing">Pricing</a><a href="/#faq">FAQ</a><a href="/login">Login</a><a href="/register">Signup</a><a href="/admin-login">Admin Login</a>
      </div>
      <a class="pg-start" href="/#generator">Get Started</a>
    </nav>
  </div>
</header>
${body}
<footer class="footer">
  <div class="footer-grid">
    <div><h3>PaperGenius</h3><p>AI-powered exam paper generator for schools and educators. Create professional papers in minutes.</p></div>
    <div><h4>Quick Links</h4><a href="/">Home</a><a href="/#features">Features</a><a href="/#pricing">Pricing</a><a href="#">CV Builder</a><a href="#">Cover Letter</a></div>
    <div><h4>Legal</h4><a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Refund Policy</a></div>
    <div><h4>Contact</h4><p>${process.env.WHATSAPP_NUMBER || "0300-0000000"}</p><p>support@papergenius.com</p><p>Lahore, Pakistan</p></div>
  </div>
  <div class="footer-line"><span>© 2026 PaperGenius. All rights reserved.</span><span>JazzCash • Easypaisa • Bank Transfer</span></div>
  <div class="copy-strip">Premium AI Paper Generator for Teachers, Schools & Academies</div>
</footer>
<a class="whatsapp" href="https://wa.me/${process.env.WHATSAPP_LINK || "923000000000"}" target="_blank">WhatsApp Support</a>
<script>
document.querySelectorAll(".faq-item").forEach(item=>{
  item.querySelector(".faq-q")?.addEventListener("click",()=>item.classList.toggle("active"));
});
</script>
</body>
</html>`;
}

app.get("/", (req, res) => {
  res.send(appShell("PaperGenius - AI Exam Paper Generator", `
<section class="hero">
  <h1>Create exam papers in <span>minutes</span>, not hours</h1>
  <p>AI-powered paper generator for schools, teachers and academies. Upload your content and create professional exam papers instantly.</p>
  <div class="hero-actions"><a class="btn btn-main" href="#generator">Get Started</a><a class="btn btn-light" href="#pricing">View Pricing</a></div>
</section>

<section class="stats"><div class="stats-box">
  <div class="stat"><b>128,450+</b><span>Papers Generated</span></div>
  <div class="stat"><b>18,700+</b><span>Active Teachers</span></div>
  <div class="stat"><b>74.8%</b><span>Time Saved</span></div>
  <div class="stat"><b>4.9/5</b><span>User Rating</span></div>
</div></section>

<section class="section generator" id="generator">
  <div class="section-title"><span class="badge">Paper Generator</span><h2>Generate Paper From Original File</h2><p>Upload JPG, PNG, PDF or DOCX. Paper will be generated only from uploaded content.</p></div>
  <div class="gen-card">
    <form action="/generate-paper" method="POST" enctype="multipart/form-data">
      <div class="upload-box"><h3>Upload Book Page / Notes / Past Paper</h3><p>Supported: JPG, PNG, PDF, DOCX</p><input type="file" name="paperFile" accept=".jpg,.jpeg,.png,.pdf,.docx" required></div>
      <div class="gen-grid">
        <div class="field"><label>Paper Type</label><select name="paperType"><option>Mixed Paper</option><option>MCQs Only</option><option>Short Questions</option><option>Long Questions</option></select></div>
        <div class="field"><label>Total Marks</label><input type="number" name="marks" placeholder="Example: 50" required></div>
      </div>
      <button class="btn btn-main" type="submit" style="width:100%;margin-top:22px;font-size:16px;">Generate Paper</button>
    </form>
  </div>
</section>

<section class="section features" id="features">
  <div class="section-title"><span class="badge">Features</span><h2>Everything you need to create perfect papers</h2><p>Powerful features designed specifically for educators, schools and academies.</p></div>
  <div class="pg-shell feature-grid">
    <div class="feature-card"><div class="icon">↑</div><h3>Smart file upload</h3><p>Upload PDF, DOCX, JPG or PNG files. AI extracts content automatically.</p></div>
    <div class="feature-card"><div class="icon">AI</div><h3>AI-powered generation</h3><p>Advanced AI analyzes your content and creates structured exam questions.</p></div>
    <div class="feature-card"><div class="icon">PDF</div><h3>Premium PDF output</h3><p>Professional exam papers with clean formatting and school-ready layout.</p></div>
    <div class="feature-card"><div class="icon">↓</div><h3>Multiple formats</h3><p>Download papers as PDF, images, or editable DOCX files later.</p></div>
    <div class="feature-card"><div class="icon">₨</div><h3>Flexible credit system</h3><p>Simple credit packs with expiry tracking.</p></div>
    <div class="feature-card"><div class="icon">✓</div><h3>Auto-delete safety</h3><p>Uploaded files and generated papers delete automatically after 15 minutes.</p></div>
  </div>
</section>

<section class="section pricing" id="pricing">
  <div class="section-title"><span class="badge">Pricing</span><h2>Simple credit plans</h2><p>Choose a pack and start generating papers quickly.</p></div>
  <div class="pg-shell price-grid">
    <div class="price-card"><h3>Basic Pack</h3><div class="amount">Rs 100</div><span class="valid">Valid for 7 days</span><ul><li>5 Credits</li><li>Upload based generation</li><li>PDF export support</li></ul><a class="btn btn-main" style="width:100%" href="/checkout/basic">Select Basic Pack</a></div>
    <div class="price-card popular"><div class="pop-badge">MOST POPULAR</div><h3>Standard Pack</h3><div class="amount">Rs 300</div><span class="valid">Valid for 15 days</span><ul><li>15 Credits</li><li>All paper types</li><li>Best value for teachers</li></ul><a class="btn btn-main" style="width:100%" href="/checkout/standard">Select Standard Pack</a></div>
    <div class="price-card"><h3>Pro Pack</h3><div class="amount">Rs 500</div><span class="valid">Valid for 25 days</span><ul><li>30 Credits</li><li>Priority generation</li><li>Premium support</li></ul><a class="btn btn-main" style="width:100%" href="/checkout/pro">Select Pro Pack</a></div>
  </div>
</section>

<section class="section faq" id="faq">
  <div class="section-title"><span class="badge">FAQ</span><h2>Frequently asked questions</h2><p>Quick answers about PaperGenius.</p></div>
  <div class="faq-box">
    <div class="faq-item"><div class="faq-q">How does the credit system work? <span>⌄</span></div><div class="faq-a">Each generated paper uses 1 credit in this first version.</div></div>
    <div class="faq-item"><div class="faq-q">What file formats can I upload? <span>⌄</span></div><div class="faq-a">JPG, PNG, PDF and DOCX files are supported.</div></div>
    <div class="faq-item"><div class="faq-q">Is fake paper generated? <span>⌄</span></div><div class="faq-a">No. Paper will be generated only from uploaded original content once AI backend is connected.</div></div>
    <div class="faq-item"><div class="faq-q">When are files deleted? <span>⌄</span></div><div class="faq-a">Uploaded files and paper records are deleted automatically after 15 minutes.</div></div>
  </div>
</section>
`));
});

app.get("/register", (req, res) => {
  res.send(appShell("Register", `<section class="dash"><div class="box"><h2>Create Account</h2><form method="POST" action="/register"><div class="field"><label>Name</label><input name="name" required></div><div class="field"><label>Email</label><input name="email" type="email" required></div><div class="field"><label>Password</label><input name="password" type="password" required></div><button class="btn btn-main">Register</button></form><p><a href="/login">Already have account? Login</a></p></div></section>`));
});

app.post("/register", async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    await User.create({ name: req.body.name, email: req.body.email, password: hash });
    res.redirect("/login");
  } catch (e) {
    res.send("Email already exists or database error.");
  }
});

app.get("/login", (req, res) => {
  res.send(appShell("Login", `<section class="dash"><div class="box"><h2>User Login</h2><form method="POST" action="/login"><div class="field"><label>Email</label><input name="email" type="email" required></div><div class="field"><label>Password</label><input name="password" type="password" required></div><button class="btn btn-main">Login</button></form><p><a href="/forgot-password">Forgot Password?</a></p><p><a href="/register">Create Account</a></p></div></section>`));
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.send("User not found");
  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.send("Wrong password");
  req.session.userId = user._id.toString();
  req.session.role = user.role;
  res.redirect(user.role === "admin" ? "/admin" : "/dashboard");
});

app.get("/admin-login", (req, res) => {
  res.send(appShell("Admin Login", `<section class="dash"><div class="box"><h2>Admin Login</h2><form method="POST" action="/admin-login"><div class="field"><label>Email</label><input name="email" type="email" required></div><div class="field"><label>Password</label><input name="password" type="password" required></div><button class="btn btn-main">Login</button></form></div></section>`));
});

app.post("/admin-login", async (req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@papergenius.com";
  const adminPass = process.env.ADMIN_PASSWORD || "admin123";
  if (req.body.email !== adminEmail || req.body.password !== adminPass) return res.send("Wrong admin login");

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: "Admin",
      email: adminEmail,
      password: await bcrypt.hash(adminPass, 10),
      role: "admin",
      credits: 0
    });
  }

  req.session.userId = admin._id.toString();
  req.session.role = "admin";
  res.redirect("/admin");
});

app.get("/forgot-password", (req, res) => {
  res.send(appShell("Forgot Password", `<section class="dash"><div class="box"><h2>Forgot Password</h2><form method="POST" action="/forgot-password"><div class="field"><label>Email</label><input name="email" type="email" required></div><button class="btn btn-main">Create Reset Link</button></form></div></section>`));
});

app.post("/forgot-password", async (req, res) => {
  const token = Math.random().toString(36).substring(2, 15);
  const user = await User.findOneAndUpdate({ email: req.body.email }, { resetToken: token });
  if (!user) return res.send("Email not found");
  res.send(appShell("Reset Link", `<section class="dash"><div class="box"><h2>Reset Link</h2><p>Temporary reset link:</p><a class="btn btn-main" href="/reset-password/${token}">Reset Password</a></div></section>`));
});

app.get("/reset-password/:token", (req, res) => {
  res.send(appShell("Reset Password", `<section class="dash"><div class="box"><h2>Set New Password</h2><form method="POST" action="/reset-password/${req.params.token}"><div class="field"><label>New Password</label><input name="password" type="password" required></div><button class="btn btn-main">Update Password</button></form></div></section>`));
});

app.post("/reset-password/:token", async (req, res) => {
  const user = await User.findOne({ resetToken: req.params.token });
  if (!user) return res.send("Invalid token");
  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetToken = "";
  await user.save();
  res.redirect("/login");
});

app.get("/dashboard", auth, async (req, res) => {
  const user = await User.findById(req.session.userId);
  const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });
  const papers = await Paper.find({ userId: user._id }).sort({ createdAt: -1 });

  res.send(appShell("Dashboard", `<section class="dash"><div class="box">
    <h2>User Dashboard</h2>
    <div class="grid"><div class="card"><h3>Total Credits</h3><h1>${user.credits}</h1></div><div class="card"><h3>Remaining Credits</h3><h1>${user.credits}</h1></div><div class="card"><h3>Renewal</h3><a class="btn btn-main" href="/#pricing">Buy Credits</a></div></div>
    <h2>Generate Paper From Original File</h2>
    <form method="POST" action="/generate-paper" enctype="multipart/form-data">
      <div class="field"><label>Upload File</label><input type="file" name="paperFile" accept=".jpg,.jpeg,.png,.pdf,.docx" required></div>
      <div class="field"><label>Paper Type</label><select name="paperType"><option>Mixed Paper</option><option>MCQs Only</option><option>Short Questions</option><option>Long Questions</option></select></div>
      <div class="field"><label>Total Marks</label><input name="marks" type="number" required></div>
      <button class="btn btn-main">Generate A4 Paper</button>
    </form>
    <h2>My Orders</h2>
    <table><tr><th>Pack</th><th>Price</th><th>Credits</th><th>Status</th></tr>${orders.map(o=>`<tr><td>${o.pack}</td><td>Rs ${o.price}</td><td>${o.credits}</td><td>${o.status}</td></tr>`).join("")}</table>
    <h2>My Papers</h2>
    <table><tr><th>File</th><th>Status</th><th>Delete Time</th></tr>${papers.map(p=>`<tr><td>${p.file}</td><td>${p.status}</td><td>${p.deleteAt ? p.deleteAt.toLocaleString() : ""}</td></tr>`).join("")}</table>
  </div></section>`));
});

app.get("/checkout/:pack", auth, (req, res) => {
  const packs = {
    basic: { pack: "Basic Pack", price: 100, credits: 5, days: 7 },
    standard: { pack: "Standard Pack", price: 300, credits: 15, days: 15 },
    pro: { pack: "Pro Pack", price: 500, credits: 30, days: 25 }
  };
  const p = packs[req.params.pack];
  if (!p) return res.send("Invalid pack");

  res.send(appShell("Checkout", `<section class="dash"><div class="box">
    <h2>Invoice</h2><p><b>${p.pack}</b></p><p>Price: Rs ${p.price}</p><p>Credits: ${p.credits}</p>
    <p>JazzCash: <b>${process.env.JAZZCASH_NUMBER || "03000000000"}</b></p>
    <p>Easypaisa: <b>${process.env.EASYPAISA_NUMBER || "03000000000"}</b></p>
    <form method="POST" action="/place-order/${req.params.pack}" enctype="multipart/form-data">
      <div class="field"><label>Payment Method</label><select name="paymentMethod"><option>JazzCash</option><option>Easypaisa</option></select></div>
      <div class="field"><label>Payment Screenshot</label><input type="file" name="screenshot" accept=".jpg,.jpeg,.png" required></div>
      <button class="btn btn-main">Submit Payment Screenshot</button>
    </form>
  </div></section>`));
});

app.post("/place-order/:pack", auth, upload.single("screenshot"), async (req, res) => {
  const packs = {
    basic: { pack: "Basic Pack", price: 100, credits: 5, days: 7 },
    standard: { pack: "Standard Pack", price: 300, credits: 15, days: 15 },
    pro: { pack: "Pro Pack", price: 500, credits: 30, days: 25 }
  };
  const p = packs[req.params.pack];
  if (!p) return res.send("Invalid pack");

  await Order.create({
    userId: req.session.userId,
    ...p,
    paymentMethod: req.body.paymentMethod,
    screenshot: req.file ? req.file.filename : "",
    status: "pending"
  });

  res.send(appShell("Order Pending", `<section class="dash"><div class="box"><h2>Order Received</h2><p>Your order is pending. Admin approval ke baad credits auto add ho jayenge.</p><a class="btn btn-main" href="/dashboard">Go Dashboard</a></div></section>`));
});

app.post("/generate-paper", auth, upload.single("paperFile"), async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!user || user.credits < 1) return res.send("Not enough credits. Please buy credits.");
  if (!req.file) return res.send("File upload failed.");

  user.credits -= 1;
  await user.save();

  const deleteAt = new Date(Date.now() + 15 * 60 * 1000);
  const paper = await Paper.create({
    userId: user._id,
    file: req.file.filename,
    status: "uploaded-ai-pending",
    deleteAt
  });

  setTimeout(async () => {
    try {
      const filePath = path.join(UPLOAD_DIR, req.file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      await Paper.findByIdAndDelete(paper._id);
    } catch (e) {
      console.log("Auto delete error:", e.message);
    }
  }, 15 * 60 * 1000);

  res.send(appShell("Paper Uploaded", `<section class="dash"><div class="box"><h2>File Uploaded Successfully</h2><p>1 credit deducted. File and record will auto-delete after 15 minutes.</p><p>Real AI generation next step mein connect hoga. Abhi fake paper generate nahi hota.</p><a class="btn btn-main" href="/dashboard">Back Dashboard</a></div></section>`));
});

app.get("/admin", adminOnly, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  const orders = await Order.find().sort({ createdAt: -1 }).populate("userId");

  res.send(appShell("Admin Dashboard", `<section class="dash"><div class="box">
    <h2>Admin Dashboard</h2>
    <div class="grid"><div class="card"><h3>Total Users</h3><h1>${users.length}</h1></div><div class="card"><h3>Pending Orders</h3><h1>${orders.filter(o=>o.status==="pending").length}</h1></div><div class="card"><h3>Approved Orders</h3><h1>${orders.filter(o=>o.status==="approved").length}</h1></div></div>
    <h2>Orders</h2>
    <table><tr><th>User</th><th>Pack</th><th>Price</th><th>Screenshot</th><th>Status</th><th>Action</th></tr>${orders.map(o=>`<tr><td>${o.userId ? o.userId.email : "Deleted"}</td><td>${o.pack}</td><td>Rs ${o.price}</td><td>${o.screenshot ? `<a href="/uploads/${o.screenshot}" target="_blank">View</a>` : ""}</td><td>${o.status}</td><td><a class="btn btn-main" href="/admin/order/${o._id}/approve">Approve</a> <a class="btn btn-light" href="/admin/order/${o._id}/reject">Reject</a></td></tr>`).join("")}</table>
    <h2>Users / Manual Credits</h2>
    <table><tr><th>Name</th><th>Email</th><th>Credits</th><th>Add Credits</th></tr>${users.map(u=>`<tr><td>${u.name}</td><td>${u.email}</td><td>${u.credits}</td><td><form method="POST" action="/admin/add-credits/${u._id}"><input name="credits" type="number" placeholder="Credits"><button class="btn btn-main">Add</button></form></td></tr>`).join("")}</table>
  </div></section>`));
});

app.get("/admin/order/:id/approve", adminOnly, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order && order.status !== "approved") {
    await User.findByIdAndUpdate(order.userId, { $inc: { credits: order.credits } });
    order.status = "approved";
    await order.save();
  }
  res.redirect("/admin");
});

app.get("/admin/order/:id/reject", adminOnly, async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, { status: "rejected" });
  res.redirect("/admin");
});

app.post("/admin/add-credits/:id", adminOnly, async (req, res) => {
  const credits = Number(req.body.credits || 0);
  if (credits > 0) await User.findByIdAndUpdate(req.params.id, { $inc: { credits } });
  res.redirect("/admin");
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

app.listen(PORT, () => {
  console.log("PaperGenius backend running");
});
