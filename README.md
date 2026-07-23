# Jitume Agency OS 🚀
> **Built by Team Agentic AIMS for the 48-Hour AI Hackathon 2026**

Jitume Agency OS is a dual-node agentic workflow system that automates client onboarding and commercial proposal generation for digital agencies. It turns raw discovery call recordings into structured contact reports, auto-schedules team production syncs on Google Calendar, and synthesizes polished HTML proposals with itemized budget invoices—reducing onboarding turnarounds from hours to minutes.

---

## ⚡ The Problem

Traditional digital agency onboarding is filled with repetitive manual tasks:
* **Manual Note-Taking**: Spending hours transcribing discovery calls into structured outlines.
* **Scheduling Friction**: Endless back-and-forth emails finding a slot for the internal production team.
* **Proposal Bottlenecks**: Spending 4+ hours per client formatting scope deliverables, timelines, and pricing tables by hand.

---

## 🛠 How It Works (Dual-Node Architecture)

Jitume Agency OS splits the pipeline into two clear execution nodes:

```
[ Client Discovery Call ] ──> ( Fathom AI Webhook )
                                      │
                                      ▼
                        ┌──────────────────────────┐
                        │  PHASE 1: ZERO-TOUCH     │
                        │  AUTOMATION NODE         │
                        └─────────────┬────────────┘
                                      │
             ┌────────────────────────┴────────────────────────┐
             ▼                                                 ▼
( Gemini 1.5 Contact Report )                     ( Google Calendar Auto-Sync )
             │                                                 │
             └────────────────────────┬────────────────────────┘
                                      │
                                      ▼
                           [ Email Sent via Resend ]
                                      │
                                      ▼
                        ┌──────────────────────────┐
                        │  PHASE 2: HUMAN-IN-THE-  │
                        │  LOOP SYNTHESIS NODE     │
                        └─────────────┬────────────┘
                                      │
                                      ▼
                       ( Mission Control Review Queue )
                                      │
                        [ Admin One-Click Dispatch ]
```

### Phase 1: Zero-Touch Automation Node
1. **Webhook Ingestion**: Receives live meeting transcripts & summaries from Fathom AI (`/api/webhooks/fathom`).
2. **AI Contact Report**: Gemini 1.5 Pro extracts executive summaries, client requirements, and action items.
3. **Auto-Scheduling**: Calculates tomorrow's first business slot (10:00 AM) and books an internal team production meeting via Google Calendar API, complete with a Google Meet link.
4. **Instant Notification**: Dispatches the Contact Report and meeting invite to both client and internal team via Resend.

### Phase 2: Human-in-the-Loop (HITL) Synthesis Node
1. **Multi-Transcript Synthesis**: Merges Stage 1 client discovery notes with Stage 2 internal production brainstorms.
2. **Proposal & Invoice Generation**: Gemini synthesizes a complete commercial proposal including milestone timelines and formatted HTML invoice tables.
3. **Mission Control Review**: Pauses at `/admin/review/[projectId]` for human oversight, letting admins edit call notes or HTML markup inline before dispatching.

---

## 🧰 Tech Stack

* **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS v4 (Zinc 950 Stealth Aesthetic)
* **AI Engines**:
  * **Primary**: Google Gemini 1.5 Pro (`@google/generative-ai`)
  * **Fallback**: NVIDIA NIM (`meta/llama-3.3-70b-instruct`) for automatic rate-limit failover
* **Database & ORM**: Prisma ORM v6 with SQLite (`prisma/dev.db`)
* **Integrations**:
  * **Fathom AI**: Webhook ingestion & speaker transcript parsing
  * **Google Calendar API**: Service Account authentication for automated scheduling
  * **Resend API**: Transactional email dispatches from verified domain

---

## 🚀 Quick Start

### Prerequisites
* Node.js 18+
* npm

### 1. Clone the Repository & Install Dependencies
```bash
git clone https://github.com/sharlmon/AGENTIC-AIMS.git
cd AGENTIC-AIMS
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your API credentials in `.env.local`:
```env
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your_gemini_api_key"
NVIDIA_API_KEY="your_nvidia_api_key"
RESEND_API_KEY="your_resend_api_key"
RESEND_FROM_EMAIL="Sharlmon <hello@sharl-tech.co.ke>"
FATHOM_API_KEY="your_fathom_api_key"
FATHOM_WEBHOOK_SECRET="your_fathom_webhook_secret"
GOOGLE_APPLICATION_CREDENTIALS="./jitume-agency-os-196fb3a23ed3.json"
```

### 3. Initialize the Database
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000/admin](http://localhost:3000/admin) to access **Mission Control**.
Open [http://localhost:3000/presentation](http://localhost:3000/presentation) to view the **Interactive Pitch Deck**.

---

## 👥 The Team (Agentic AIMS)

* **Sharlmon Junior** — Technical Lead & Presenter (Built Dual-Node Pipeline & HITL Engine)
* **Suleiman** — Lead Developer (Built Prisma ORM & Webhook Ingestion)
* **Joshua** — AI Engineer (Built Gemini 1.5 Pro & NIM Fallback)
* **Kofa** — Product Designer (Built Zinc 950 Stealth UI Workspace)
* **Sharlmon** — Pitch & Ops Lead (Built Resend Email & Calendar Engine)

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
