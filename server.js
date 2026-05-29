const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>PaperGenius - AI Paper Generator</title>
<style>
*{box-sizing:border-box}
body{margin:0;font-family:Inter,Arial,sans-serif;background:#f7fff9;color:#101828}
a{text-decoration:none;color:inherit}
.header{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.92);backdrop-filter:blur(14px);border-bottom:1px solid #e8f5ec}
.nav{max-width:1150px;margin:auto;padding:14px 18px;display:flex;align-items:center;justify-content:space-between}
.logo{font-size:24px;font-weight:900;color:#128c3a}
.logo span{color:#25D366}
.menu{display:flex;gap:18px;font-weight:700;font-size:14px;color:#344054}
.btn{background:linear-gradient(135deg,#25D366,#128c3a);color:#fff;padding:12px 18px;border-radius:14px;font-weight:900;box-shadow:0 12px 28px rgba(37,211,102,.25)}
.hero{padding:80px 18px 55px;text-align:center;background:radial-gradient(circle at top,#dfffea,#fff)}
.hero h1{font-size:clamp(36px,6vw,70px);line-height:1.02;margin:0 auto 18px;max-width:900px;letter-spacing:-2px}
.hero p{max-width:720px;margin:auto;color:#667085;font-size:18px;line-height:1.7}
.hero-actions{margin-top:28px;display:flex;justify-content:center;gap:14px;flex-wrap:wrap}
.btn2{padding:12px 18px;border:1px solid #d0d5dd;border-radius:14px;font-weight:900;background:#fff}
.section{padding:65px 18px}
.wrap{max-width:1150px;margin:auto}
.title{text-align:center;max-width:760px;margin:0 auto 34px}
.badge{display:inline-block;background:#e9fff1;color:#128c3a;padding:8px 16px;border-radius:50px;font-size:13px;font-weight:900}
.title h2{font-size:clamp(28px,4vw,46px);margin:14px 0 10px;letter-spacing:-1px}
.title p{color:#667085;line-height:1.7}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.card{background:#fff;border:1px solid #e8f5ec;border-radius:24px;padding:24px;box-shadow:0 18px 50px rgba(0,0,0,.06)}
.card h3{margin:0 0 10px;font-size:22px}
.card p{color:#667085;line-height:1.65}
.price{font-size:36px;font-weight:950;color:#128c3a;margin:12px 0}
.card ul{padding-left:18px;color:#475467;line-height:1.9}
.generator{padding:70px 18px;background:linear-gradient(180deg,#f7fff9,#fff)}
.genbox{max-width:1120px;margin:auto;background:#fff;border:1px solid rgba(37,211,102,.18);border-radius:30px;padding:34px;box-shadow:0 25px 70px rgba(0,0,0,.08)}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.field label{display:block;font-weight:900;margin-bottom:8px;color:#1d2939;font-size:14px}
.field input,.field select,.field textarea{width:100%;border:1px solid #d0d5dd;border-radius:16px;padding:15px;font-size:15px;outline:none;background:#fff}
.field textarea{min-height:140px;resize:vertical}
.field input:focus,.field select:focus,.field textarea:focus{border-color:#25D366;box-shadow:0 0 0 4px rgba(37,211,102,.12)}
.full{margin-top:18px}
.generate{width:100%;margin-top:22px;border:0;border-radius:18px;padding:17px;background:linear-gradient(135deg,#25D366,#128c3a);color:#fff;font-size:17px;font-weight:950;cursor:pointer}
.preview{display:none;margin-top:28px;background:#f9fffb;border:1px dashed #25D366;border-radius:24px;padding:24px}
.preview h3{margin-top:0}
.paper{background:white;border-radius:18px;padding:22px;border:1px solid #e8f5ec;color:#101828;line-height:1.8}
.download{margin-top:16px;display:inline-block;border:0;background:#101828;color:#fff;padding:13px 18px;border-radius:14px;font-weight:900;cursor:pointer}
.faq{max-width:850px;margin:auto;display:grid;gap:14px}
.faq div{background:#fff;border:1px solid #e8f5ec;border-radius:18px;padding:18px}
.footer{background:#101828;color:#fff;padding:34px 18px;text-align:center}
.footer p{color:#98a2b3}
.whatsapp{position:fixed;right:18px;bottom:18px;background:#25D366;color:#fff;padding:14px 18px;border-radius:50px;font-weight:950;box-shadow:0 15px 35px rgba(37,211,102,.35)}
@media(max-width:900px){.cards,.grid{grid-template-columns:1fr 1fr}.menu{display:none}}
@media(max-width:620px){.cards,.grid{grid-template-columns:1fr}.genbox{padding:22px 16px}.hero{padding-top:55px}}
</style>
</head>
<body>

<header class="header">
  <div class="nav">
    <div class="logo">Paper<span>Genius</span></div>
    <nav class="menu">
      <a href="#features">Features</a>
      <a href="#pricing">Pricing</a>
      <a href="#generator">Generator</a>
      <a href="#faq">FAQ</a>
    </nav>
    <a class="btn" href="#generator">Generate</a>
  </div>
</header>

<section class="hero">
  <h1>AI Paper Generator for Schools, Teachers & Academies</h1>
  <p>Create premium test papers, MCQs, short questions, long questions and exam format papers in minutes.</p>
  <div class="hero-actions">
    <a class="btn" href="#generator">Start Generator</a>
    <a class="btn2" href="#pricing">View Pricing</a>
  </div>
</section>

<section class="section" id="features">
  <div class="wrap">
    <div class="title">
      <span class="badge">Premium Features</span>
      <h2>Everything Needed for Smart Paper Making</h2>
      <p>Fast, clean, responsive and simple paper generation system for daily academic use.</p>
    </div>
    <div class="cards">
      <div class="card"><h3>Smart Questions</h3><p>Generate MCQs, short and long questions according to class, subject and topic.</p></div>
      <div class="card"><h3>Clean Format</h3><p>Beautiful paper preview with marks, time, class, subject and instructions.</p></div>
      <div class="card"><h3>Fast System</h3><p>Lightweight Node.js setup made for quick loading on Hostinger hosting.</p></div>
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
    <div class="cards">
      <div class="card"><h3>Starter</h3><div class="price">100 Credits</div><ul><li>Basic paper generation</li><li>MCQs support</li><li>Preview included</li></ul></div>
      <div class="card"><h3>Popular</h3><div class="price">300 Credits</div><ul><li>Mixed papers</li><li>Short questions</li><li>Long questions</li></ul></div>
      <div class="card"><h3>Pro</h3><div class="price">500 Credits</div><ul><li>Full paper system</li><li>Priority support</li><li>Premium formats</li></ul></div>
    </div>
  </div>
</section>

<section class="generator" id="generator">
  <div class="genbox">
    <div class="title">
      <span class="badge">AI Paper Generator</span>
      <h2>Create Your Paper</h2>
      <p>Fill details below and generate a clean paper preview instantly.</p>
    </div>

    <form id="paperForm">
      <div class="grid">
        <div class="field">
          <label>Class / Grade</label>
          <select name="grade" required>
            <option value="">Select Class</option>
            <option>Class 5</option><option>Class 6</option><option>Class 7</option>
            <option>Class 8</option><option>Class 9</option><option>Class 10</option>
            <option>Class 11</option><option>Class 12</option>
          </select>
        </div>

        <div class="field">
          <label>Subject</label>
          <input name="subject" placeholder="English, Math, Biology" required />
        </div>

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
          <label>Difficulty</label>
          <select name="difficulty" required>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div class="field">
          <label>Total Marks</label>
          <input name="marks" type="number" placeholder="50" required />
        </div>

        <div class="field">
          <label>Time Duration</label>
          <input name="duration" placeholder="1 Hour 30 Minutes" required />
        </div>
      </div>

      <div class="field full">
        <label>Chapters / Topics / Syllabus</label>
        <textarea name="topics" placeholder="Write chapters, topics or paste syllabus here..." required></textarea>
      </div>

      <button class="generate" type="submit">Generate Paper</button>
    </form>

    <div class="preview" id="preview">
      <h3>Generated Paper Preview</h3>
      <div class="paper" id="paperOutput"></div>
      <button class="download" onclick="window.print()">Download / Print PDF</button>
    </div>
  </div>
</section>

<section class="section" id="faq">
  <div class="title">
    <span class="badge">FAQ</span>
    <h2>Common Questions</h2>
  </div>
  <div class="faq">
    <div><b>Can I generate papers instantly?</b><p>Yes, this generator creates instant preview based on your selected details.</p></div>
    <div><b>Is it mobile responsive?</b><p>Yes, it works properly on mobile, tablet and desktop.</p></div>
    <div><b>Can PDF download be added?</b><p>Yes, real PDF backend will be added in next step.</p></div>
  </div>
</section>

<footer class="footer">
  <h2>PaperGenius</h2>
  <p>Premium AI paper generator for teachers, schools and academies.</p>
</footer>

<a class="whatsapp" href="https://wa.me/923056583822" target="_blank">WhatsApp Support</a>

<script>
document.getElementById("paperForm").addEventListener("submit", async function(e){
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  const response = await fetch("/generate-paper", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });

  const result = await response.json();

  document.getElementById("preview").style.display = "block";
  document.getElementById("paperOutput").innerHTML = result.paper;
  document.getElementById("preview").scrollIntoView({behavior:"smooth"});
});
</script>

</body>
</html>`);
});

app.post("/generate-paper", (req, res) => {
  const { grade, subject, paperType, difficulty, marks, duration, topics } = req.body;

  const paper = `
    <div style="text-align:center">
      <h2>${subject} Test Paper</h2>
      <p><b>${grade}</b> | <b>${paperType}</b> | Difficulty: <b>${difficulty}</b></p>
      <p>Total Marks: <b>${marks}</b> | Time: <b>${duration}</b></p>
    </div>

    <hr>

    <p><b>Instructions:</b> Attempt all questions carefully. Write neat and clean answers.</p>

    <h3>Topics / Syllabus</h3>
    <p>${topics}</p>

    <h3>Section A: MCQs</h3>
    <ol>
      <li>Write one correct option related to ${subject}.</li>
      <li>Choose the best answer from the given topic.</li>
      <li>Basic concept question from syllabus.</li>
      <li>Important definition based MCQ.</li>
      <li>General understanding question.</li>
    </ol>

    <h3>Section B: Short Questions</h3>
    <ol>
      <li>Define any two important terms from the given topics.</li>
      <li>Write short note on an important chapter concept.</li>
      <li>Explain the main idea in 3 to 4 lines.</li>
      <li>Answer briefly according to syllabus.</li>
      <li>Write difference between two important terms.</li>
    </ol>

    <h3>Section C: Long Questions</h3>
    <ol>
      <li>Explain the most important topic in detail.</li>
      <li>Write a complete answer with examples.</li>
      <li>Describe the chapter concept with proper headings.</li>
    </ol>
  `;

  res.json({
    success: true,
    paper
  });
});

app.listen(PORT, () => {
  console.log("PaperGenius running on port " + PORT);
});
