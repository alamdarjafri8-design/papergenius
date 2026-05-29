const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MongoStore = require("connect-mongo");
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

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("MongoDB connected");
});

app.use(session({
  secret: process.env.SESSION_SECRET || "papergenius_secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
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
  paperHtml: String,
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
    if (!allowed.includes(ext)) return cb(new Error("Only JPG, PNG, PDF and DOCX allowed"));
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

function page(title, body) {
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
body{font-family:Arial,sans-serif;margin:0;background:#f6fbff;color:#07142f}
a{text-decoration:none;color:inherit}
.box{max-width:1100px;margin:30px auto;background:#fff;padding:25px;border-radius:22px;box-shadow:0 20px 60px rgba(0,0,0,.08)}
.nav{background:#fff;border-bottom:1px solid #dbeafe;padding:15px 25px;display:flex;justify-content:space-between;align-items:center}
.logo{font-size:26px;font-weight:900}.logo span{color:#2f7df6}
.btn{display:inline-block;background:linear-gradient(135deg,#2f7df6,#22c7b8);color:#fff;padding:11px 18px;border-radius:12px;font-weight:800;border:0;cursor:pointer}
input,select{width:100%;padding:13px;border:1px solid #dbeafe;border-radius:12px;margin:8px 0 15px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.card{background:#f8fbff;border:1px solid #dbeafe;padding:20px;border-radius:18px}
table{width:100%;border-collapse:collapse;background:#fff}
td,th{border-bottom:1px solid #e5e7eb;padding:12px;text-align:left}
.badge{padding:5px 10px;border-radius:20px;background:#eaf3ff;color:#2f7df6;font-weight:800}
@media(max-width:800px){.grid{grid-template-columns:1fr}.box{margin:15px}}
</style>
</head>
<body>
<div class="nav"><a class="logo" href="/">Paper<span>Genius</span></a><div><a class="btn" href="/dashboard">Dashboard</a> <a class="btn" href="/logout">Logout</a></div></div>
${body}
</body>
</html>`;
}

app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

app.get("/register", (req, res) => {
  res.send(page("Register", `<div class="box"><h2>Create Account</h2>
<form method="POST" action="/register">
<input name="name" placeholder="Full Name" required>
<input name="email" type="email" placeholder="Email" required>
<input name="password" type="password" placeholder="Password" required>
<button class="btn">Register</button>
</form><p>Already have account? <a href="/login">Login</a></p></div>`));
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hash });
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.send(page("Login", `<div class="box"><h2>User Login</h2>
<form method="POST" action="/login">
<input name="email" type="email" placeholder="Email" required>
<input name="password" type="password" placeholder="Password" required>
<button class="btn">Login</button>
</form><p><a href="/forgot-password">Forgot Password?</a></p><p>No account? <a href="/register">Register</a></p></div>`));
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.send("User not found");
  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.send("Wrong password");
  req.session.userId = user._id;
  req.session.role = user.role;
  res.redirect(user.role === "admin" ? "/admin" : "/dashboard");
});

app.get("/admin-login", (req, res) => {
  res.send(page("Admin Login", `<div class="box"><h2>Admin Login</h2>
<form method="POST" action="/admin-login">
<input name="email" type="email" placeholder="Admin Email" required>
<input name="password" type="password" placeholder="Admin Password" required>
<button class="btn">Login</button>
</form></div>`));
});

app.post("/admin-login", async (req, res) => {
  if (req.body.email !== process.env.ADMIN_EMAIL || req.body.password !== process.env.ADMIN_PASSWORD) {
    return res.send("Wrong admin login");
  }

  let admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!admin) {
    admin = await User.create({
      name: "Admin",
      email: process.env.ADMIN_EMAIL,
      password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
      role: "admin",
      credits: 0
    });
  }

  req.session.userId = admin._id;
  req.session.role = "admin";
  res.redirect("/admin");
});

app.get("/forgot-password", (req, res) => {
  res.send(page("Forgot Password", `<div class="box"><h2>Forgot Password</h2>
<form method="POST" action="/forgot-password">
<input name="email" type="email" placeholder="Enter your email" required>
<button class="btn">Create Reset Link</button>
</form></div>`));
});

app.post("/forgot-password", async (req, res) => {
  const token = Math.random().toString(36).substring(2, 15);
  const user = await User.findOneAndUpdate({ email: req.body.email }, { resetToken: token });
  if (!user) return res.send("Email not found");
  res.send(page("Reset Link", `<div class="box"><h2>Reset Link</h2><p>Temporary reset link:</p><a class="btn" href="/reset-password/${token}">Reset Password</a></div>`));
});

app.get("/reset-password/:token", async (req, res) => {
  res.send(page("Reset Password", `<div class="box"><h2>Set New Password</h2>
<form method="POST" action="/reset-password/${req.params.token}">
<input name="password" type="password" placeholder="New Password" required>
<button class="btn">Update Password</button>
</form></div>`));
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

  res.send(page("User Dashboard", `<div class="box">
<h2>User Dashboard</h2>
<div class="grid">
<div class="card"><h3>Total Credits</h3><h1>${user.credits}</h1></div>
<div class="card"><h3>Remaining Credits</h3><h1>${user.credits}</h1></div>
<div class="card"><h3>Renewal</h3><a class="btn" href="/pricing">Buy Credits</a></div>
</div>

<h2>Generate Paper From Original File</h2>
<form method="POST" action="/generate-paper" enctype="multipart/form-data">
<input type="file" name="paperFile" accept=".jpg,.jpeg,.png,.pdf,.docx" required>
<select name="paperType"><option>Mixed Paper</option><option>MCQs Only</option><option>Short Questions</option><option>Long Questions</option></select>
<input name="marks" type="number" placeholder="Total Marks" required>
<button class="btn">Generate A4 Paper</button>
</form>

<h2>My Orders</h2>
<table><tr><th>Pack</th><th>Price</th><th>Credits</th><th>Status</th></tr>
${orders.map(o => `<tr><td>${o.pack}</td><td>Rs ${o.price}</td><td>${o.credits}</td><td><span class="badge">${o.status}</span></td></tr>`).join("")}
</table>

<h2>My Papers</h2>
<table><tr><th>File</th><th>Status</th><th>Delete Time</th></tr>
${papers.map(p => `<tr><td>${p.file}</td><td>${p.status}</td><td>${p.deleteAt ? p.deleteAt.toLocaleString() : ""}</td></tr>`).join("")}
</table>
</div>`));
});

app.get("/pricing", auth, (req, res) => {
  res.send(page("Buy Credits", `<div class="box"><h2>Buy Credits</h2>
<div class="grid">
<div class="card"><h3>Basic Pack</h3><h1>Rs 100</h1><p>5 Credits - 7 Days</p><a class="btn" href="/checkout/basic">Select</a></div>
<div class="card"><h3>Standard Pack</h3><h1>Rs 300</h1><p>15 Credits - 15 Days</p><a class="btn" href="/checkout/standard">Select</a></div>
<div class="card"><h3>Pro Pack</h3><h1>Rs 500</h1><p>30 Credits - 25 Days</p><a class="btn" href="/checkout/pro">Select</a></div>
</div></div>`));
});

app.get("/checkout/:pack", auth, (req, res) => {
  const packs = {
    basic: { pack: "Basic Pack", price: 100, credits: 5, days: 7 },
    standard: { pack: "Standard Pack", price: 300, credits: 15, days: 15 },
    pro: { pack: "Pro Pack", price: 500, credits: 30, days: 25 }
  };
  const p = packs[req.params.pack];
  if (!p) return res.send("Invalid pack");

  res.send(page("Checkout", `<div class="box"><h2>Invoice</h2>
<p><b>${p.pack}</b></p><p>Price: Rs ${p.price}</p><p>Credits: ${p.credits}</p>
<p>JazzCash: <b>${process.env.JAZZCASH_NUMBER}</b></p>
<p>Easypaisa: <b>${process.env.EASYPAISA_NUMBER}</b></p>
<form method="POST" action="/place-order/${req.params.pack}" enctype="multipart/form-data">
<select name="paymentMethod"><option>JazzCash</option><option>Easypaisa</option></select>
<input type="file" name="screenshot" accept=".jpg,.jpeg,.png" required>
<button class="btn">Submit Payment Screenshot</button>
</form></div>`));
});

app.post("/place-order/:pack", auth, upload.single("screenshot"), async (req, res) => {
  const packs = {
    basic: { pack: "Basic Pack", price: 100, credits: 5, days: 7 },
    standard: { pack: "Standard Pack", price: 300, credits: 15, days: 15 },
    pro: { pack: "Pro Pack", price: 500, credits: 30, days: 25 }
  };
  const p = packs[req.params.pack];
  await Order.create({
    userId: req.session.userId,
    ...p,
    paymentMethod: req.body.paymentMethod,
    screenshot: req.file.filename,
    status: "pending"
  });
  res.send(page("Order Pending", `<div class="box"><h2>Order Received</h2><p>Your payment screenshot has been sent to admin. Credits will be added after approval.</p><a class="btn" href="/dashboard">Go Dashboard</a></div>`));
});

app.post("/generate-paper", auth, upload.single("paperFile"), async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (user.credits < 1) return res.send("Not enough credits. Please buy credits.");

  user.credits -= 1;
  await user.save();

  const deleteAt = new Date(Date.now() + 15 * 60 * 1000);

  const paper = await Paper.create({
    userId: user._id,
    file: req.file.filename,
    status: "uploaded-ai-pending",
    paperHtml: "",
    deleteAt
  });

  setTimeout(async () => {
    try {
      const filePath = path.join(UPLOAD_DIR, req.file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      await Paper.findByIdAndDelete(paper._id);
    } catch (e) {
      console.log("Auto delete error", e.message);
    }
  }, 15 * 60 * 1000);

  res.send(page("Paper Uploaded", `<div class="box"><h2>File Uploaded Successfully</h2>
<p>1 credit deducted. File will auto-delete after 15 minutes.</p>
<p>Real AI image/file reading next step mein connect hoga. Abhi system uploaded file se fake paper nahi banayega.</p>
<a class="btn" href="/dashboard">Back Dashboard</a></div>`));
});

app.get("/admin", adminOnly, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  const orders = await Order.find().sort({ createdAt: -1 }).populate("userId");

  res.send(page("Admin Dashboard", `<div class="box"><h2>Admin Dashboard</h2>
<div class="grid">
<div class="card"><h3>Total Users</h3><h1>${users.length}</h1></div>
<div class="card"><h3>Pending Orders</h3><h1>${orders.filter(o=>o.status==="pending").length}</h1></div>
<div class="card"><h3>Approved Orders</h3><h1>${orders.filter(o=>o.status==="approved").length}</h1></div>
</div>

<h2>Orders</h2>
<table><tr><th>User</th><th>Pack</th><th>Price</th><th>Screenshot</th><th>Status</th><th>Action</th></tr>
${orders.map(o => `<tr>
<td>${o.userId ? o.userId.email : "User deleted"}</td>
<td>${o.pack}</td>
<td>Rs ${o.price}</td>
<td>${o.screenshot ? `<a href="/uploads/${o.screenshot}" target="_blank">View</a>` : ""}</td>
<td><span class="badge">${o.status}</span></td>
<td>
<a class="btn" href="/admin/order/${o._id}/approve">Approve</a>
<a class="btn" href="/admin/order/${o._id}/reject">Reject</a>
</td>
</tr>`).join("")}
</table>

<h2>Users / Manual Credits</h2>
<table><tr><th>Name</th><th>Email</th><th>Credits</th><th>Add Credits</th></tr>
${users.map(u => `<tr>
<td>${u.name}</td><td>${u.email}</td><td>${u.credits}</td>
<td><form method="POST" action="/admin/add-credits/${u._id}"><input name="credits" type="number" placeholder="Credits"><button class="btn">Add</button></form></td>
</tr>`).join("")}
</table>
</div>`));
});

app.get("/admin/order/:id/approve", adminOnly, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.send("Order not found");
  if (order.status !== "approved") {
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
  req.session.destroy(() => res.redirect("/login"));
});

app.listen(PORT, () => console.log("PaperGenius backend running"));
