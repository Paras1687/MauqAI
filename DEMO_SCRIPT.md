# 🎙️ Opportunity Radar — Hackathon Demo Script & Submission Guide
> **TinyFish × DTU Student Bounty Drop 001: Personal Agents**  
> *Target Duration: 2 to 3 minutes*

---

## 📌 Scene 1: The Hook & Problem Statement (0:00 - 0:30)

**Speaker (Voiceover / Screen):**  
"Hey everyone! If you're a college student or early-career developer, you know the pain of opportunity hunting. Every season, we spend dozens of hours scrolling through outdated spreadsheets, dead links on job boards, and Discord servers. You spend hours applying, only to find out the program closed three weeks ago, doesn't sponsor visas, or only accepts students graduating in 2025 when you graduate in 2026.

Normal AI chatbots don't solve this because they hallucinate fake links, make up fictional deadlines, and can't interact with live websites.

That's why we built **Opportunity Radar** — a personal AI agent powered by **TinyFish Web Agent & Browser Automation** that searches the live web, navigates real websites across 3+ endpoints, verifies deadlines and compensation, and scores opportunities tailored to your exact profile."

---

## 📌 Scene 2: Live Walkthrough — Search Run 1 (0:30 - 1:15)

**Action:** Open browser to `http://localhost:3001`.

**Speaker:**  
"Here is the Opportunity Radar dashboard. Notice the clean, dark cyber-aesthetic and our status indicator. We've built in 1-click presets for common student archetypes.

Let's click **'AI/ML Undergrad 2026'**. Notice how it pre-populates:
- Opportunity Type: *Internship*
- Skills: *Python, PyTorch, Machine Learning, Data Structures*
- Education Level: *Undergraduate (Class of 2026)*
- Target Companies: *OpenAI, Google*

Now, let's hit **'Launch Opportunity Radar'**."

**Visual:** The rotating radar dish activates, and the real-time Server-Sent Events (SSE) feed streams live:
- **Endpoint 1 (Discovery):** *Querying search index for student opportunities...*
- **Endpoint 2 (Extraction):** *Navigating to official career portals at Google & OpenAI...*
- **Endpoint 3 (Verification):** *Verifying active application links and deadline constraints...*
- **Step 4 (Normalization):** *Ranking match scores...*

**Speaker:**  
"Look at that live activity feed! Opportunity Radar isn't querying a static database — it's executing a genuine multi-step pipeline across three distinct browser endpoints:
1. First, discovering candidate listings.
2. Second, extracting official descriptions and eligibility requirements.
3. Third, verifying that application portals are live and accepting submissions.

Here are the results! Look at our top matches: **OpenAI Research & Engineering Residency (98% Match)** and **Google STEP (96% Match)**. 
Notice the transparent match reason explaining *exactly* why this opportunity fits your skills and graduation year, along with verified compensation numbers and direct application links."

---

## 📌 Scene 3: Search Run 2 — Proving Dynamic Personalization (1:15 - 1:55)

**Action:** Switch to preset **'Global Web3 & AI Hackathons'** (or enter custom inputs: *Rust, Solana, $10,000+ Prize*).

**Speaker:**  
"Now, let's prove this is a real personal agent and not a hardcoded demo. 
Let's switch inputs to **'Global Web3 & AI Hackathons'**, requiring 100% remote eligibility and a minimum $10,000 prize pool.

Let's launch the radar scan again."

**Visual:** The radar runs the 4-step pipeline and updates the dashboard.

**Speaker:**  
"Notice how the results completely shifted! Now our top match is the **Solana Radar Global Hackathon (98% Match)** with a verified $600,000+ prize pool, followed by **CalHacks 12.0**.
Every card displays:
- Verified endpoints count
- Real source links and separate direct application links
- Clear warnings whenever a deadline is rolling rather than fabricating dates."

---

## 📌 Scene 4: Interactive Verification & Safety (1:55 - 2:30)

**Action:** Click the **'Verify Link'** button on a card, then toggle the **'View 3 browser endpoints'** accordion.

**Speaker:**  
"Users can also click **'Verify Link'** at any time to have TinyFish test reachability and form status on the fly. And with **'View browser endpoints'**, you can inspect the exact URLs visited by the agent.

We also strictly follow safety guidelines: Opportunity Radar **never** submits applications or sends emails without user confirmation — it prepares everything and puts the student in control."

---

## 📌 Scene 5: Wrap-up & Scoring Tier Alignment (2:30 - 2:45)

**Speaker:**  
"Opportunity Radar was built from scratch for the **TinyFish × DTU Student Bounty Drop 001: Personal Agents** challenge:
- Built with official `@tiny-fish/sdk`
- Targets the **200-point scoring tier** with 3+ live endpoints
- Solves a real, recurring student problem
- Features single-command startup with `npm start` and a 100% passing test suite.

Thank you!"
