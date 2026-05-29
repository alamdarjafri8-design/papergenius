const http = require("http");

const html = `
<!DOCTYPE html>
<html>
<head>
<title>PaperGenius - AI Paper Generator</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body{margin:0;font-family:Arial;background:#f5fbf8;color:#0f172a}
.header{background:white;padding:18px 7%;display:flex;justify-content:space-between;align-items:center;box-shadow:0 4px 20px #0001}
.logo{font-size:26px;font-weight:800;color:#16a34a}
.nav a{margin:0 12px;text-decoration:none;color:#111}
.btn{background:#16a34a;color:white;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:700}
.hero{padding:80px 7%;text-align:center}
.hero h1{font-size:52px;margin:0}
.hero p{font-size:20px;color:#475569}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px;padding:30px 7%}
.card{background:white;padding:28px;border-radius:20px;box-shadow:0 10px 30px #0001;text-align:center}
.card h2{color:#16a34a}
.price{font-size:36px;font-weight:900}
.footer{text-align:center;padding:30px;background:#052e1b;color:white;margin-top:40px}
.whatsapp{position:fixed;right:22px;bottom:22px;background:#22c55e;color:white;padding:16px 18px;border-radius:50%;font-size:26px;text-decoration:none}
</style>
</head>
<body>
<div class="header">
<div class="logo">PaperGenius</div>
<div class="nav">
<a href="/">Home</a>
<a href="#pricing">Pricing</a>
<a href="#">CV Builder</a>
<a href="#">Cover Letter</a>
<a class="btn" href="#">Login</a>
</div>
</div>

<section class="hero">
<h1>AI Exam Paper Generator</h1>
<p>Upload file, select paper settings, and generate premium school-style papers.</p>
<a class="btn" href="#pricing">Get Started</a>
</section>

<section class="cards" id="pricing">
<div class="card"><h2>Single Paper</h2><div class="price">Rs 30</div><p>1 Paper • Valid 1 Day</p><a class="btn">Buy Now</a></div>
<div class="card"><h2>Basic Pack</h2><div class="price">Rs 100</div><p>5 Papers • Valid 7 Days</p><a class="btn">Buy Now</a></div>
<div class="card"><h2>Starter Pack</h2><div class="price">Rs 180</div><p>10 Papers • Valid 7 Days</p><a class="btn">Buy Now</a></div>
<div class="card"><h2>Standard Pack</h2><div class="price">Rs 300</div><p>20 Papers • Valid 15 Days</p><a class="btn">Buy Now</a></div>
<div class="card"><h2>Monthly Pack</h2><div class="price">Rs 500</div><p>50 Papers • Valid 30 Days</p><a class="btn">Buy Now</a></div>
</section>

<div class="footer">© 2026 PaperGenius. Premium Education Tools.</div>
<a class="whatsapp" href="https://wa.me/923056583822">☏</a>
</body>
</html>
`;

http.createServer((req,res)=>{
res.writeHead(200,{"Content-Type":"text/html"});
res.end(html);
}).listen(3000,()=>console.log("PaperGenius running"));
