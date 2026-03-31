# Thinkerton — Technical Build Plan

## What It Is

A decision-support tool that reasons through your problems using the documented mental models and frameworks of elite thinkers (Munger, Singleton, Buffett, Kahneman, Feynman, etc.) — not generic AI, but curated reasoning from a high-signal corpus.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                 │
│  Problem Input → Lens Selection → Reasoning Display  │
└──────────────────┬───────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│                  API Layer (Next.js API)              │
│  Auth · Rate Limiting · Session Management           │
└──────────────────┬───────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│              Reasoning Engine (Core)                  │
│                                                      │
│  1. Problem Parser — extracts domain, constraints,   │
│     decision type from user input                    │
│                                                      │
│  2. Model Matcher — selects relevant mental models   │
│     based on problem classification                  │
│                                                      │
│  3. Reasoning Chain Builder — constructs structured   │
│     analysis using retrieved frameworks + LLM        │
│                                                      │
│  4. Output Formatter — produces the final structured │
│     response with model, logic, precedent, insight   │
└──────────────────┬───────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│            Knowledge Layer (The Moat)                 │
│                                                      │
│  Vector DB (Pinecone/Pgvector)                       │
│  ├── Curated source documents                        │
│  │   ├── Shareholder letters                         │
│  │   ├── Speeches & interviews                       │
│  │   ├── Biographies (key excerpts)                  │
│  │   ├── Nobel lectures                              │
│  │   └── Documented decision frameworks              │
│  │                                                   │
│  └── Structured mental model definitions             │
│      ├── Model name & thinker                        │
│      ├── Core principle                              │
│      ├── When to apply (problem types)               │
│      ├── How to apply (reasoning steps)              │
│      ├── Historical examples                         │
│      └── Common misapplications                      │
└──────────────────────────────────────────────────────┘
```

---

## Phase 1 — Foundation (Weeks 1-3)

### 1.1 Mental Model Knowledge Base

This is the moat. Start here.

- **Curate 20-30 mental models** from 6-8 thinkers to start
- Structure each model as a JSON document:

```json
{
  "id": "singleton-opportunistic-capital-allocation",
  "thinker": "Henry Singleton",
  "model_name": "Opportunistic Capital Allocation",
  "core_principle": "Never commit to a fixed allocation strategy. Evaluate each option against the current opportunity cost of capital.",
  "problem_types": ["capital allocation", "investment", "resource allocation", "strategic planning"],
  "reasoning_steps": [
    "Identify all available uses of capital",
    "Assess current market conditions and valuations",
    "Calculate risk-adjusted return for each option",
    "Compare against opportunity cost",
    "Avoid dogmatic commitment to any single category"
  ],
  "historical_examples": [
    {
      "context": "Teledyne 1972-1984",
      "action": "Repurchased 90% of outstanding shares when stock was undervalued",
      "outcome": "Massively increased per-share value"
    }
  ],
  "anti_patterns": ["Treating allocation as permanent policy", "Ignoring market conditions"],
  "source_documents": ["teledyne-annual-reports", "outsiders-ch1"]
}
```

- **Embed source documents** into a vector store (Pinecone or pgvector)
- **Manually tag** relevant passages with model IDs for high-precision retrieval

### 1.2 Reasoning Engine (MVP)

- Use Claude API as the LLM backbone
- Build the prompt pipeline:
  1. User problem → classify problem type
  2. Problem type → retrieve relevant mental models (vector search + tag matching)
  3. Retrieved models + source passages → structured reasoning prompt
  4. LLM generates analysis following a strict output schema

### 1.3 Simple Web Interface

- Next.js app with:
  - Text input for problem description
  - Thinker/model selector (optional — auto-match by default)
  - Structured output display (model → logic → precedent → insight)
  - Responsive, clean UI matching the landing page aesthetic

---

## Phase 2 — Core Features (Weeks 4-6)

### 2.1 "Think Like" Mode

- Side-by-side comparison of 2-3 thinkers on the same problem
- Each thinker's analysis follows their specific reasoning patterns
- Highlight where they agree and diverge

### 2.2 Reasoning Chain Transparency

- Show the full chain: mental model selected → why it applies → reasoning steps → precedent → conclusion
- Confidence indicator based on how well the problem matches the model's domain
- Source citations linking back to original documents

### 2.3 Decision Journal

- User accounts (NextAuth / Clerk)
- Save decisions with timestamps
- Each decision auto-tagged with mental models applied
- Historical view showing patterns in your decision-making

---

## Phase 3 — Differentiation (Weeks 7-10)

### 3.1 Adversarial Review Mode

- User submits their own analysis
- Thinkerton identifies which mental models the user implicitly used
- Flags cognitive biases (anchoring, confirmation, sunk cost)
- Suggests frameworks the user didn't consider

### 3.2 Expanded Knowledge Base

- Scale to 100+ mental models across 20+ thinkers
- Add domain-specific thinkers (technology: Grove, Christensen; science: Feynman, Shannon)
- Community submissions with editorial review

### 3.3 Team Features

- Shared decision journals
- Collaborative analysis sessions
- Decision review meetings with Thinkerton as facilitator

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | Next.js 14 (App Router) | SSR, API routes, fast iteration |
| Styling | Tailwind CSS | Matches the landing page aesthetic, rapid UI dev |
| Auth | Clerk or NextAuth | Simple, handles OAuth + email |
| Database | PostgreSQL (Supabase) | Relational data + pgvector for embeddings |
| Vector Search | pgvector (or Pinecone if scaling) | Keep it simple in one DB to start |
| LLM | Claude API (Anthropic) | Best reasoning quality for structured analysis |
| Hosting | Vercel | Zero-config Next.js deployment |
| Payments | Stripe (Phase 3) | Standard, well-documented |

---

## Data Pipeline for the Knowledge Base

```
Source Material (PDFs, text)
        │
        ▼
Manual Curation (select high-signal passages)
        │
        ▼
Structuring (tag with thinker, model, problem types)
        │
        ▼
Embedding (text-embedding-3-large or similar)
        │
        ▼
Vector Store (pgvector) + Structured DB (PostgreSQL)
        │
        ▼
Retrieval at query time (hybrid: vector similarity + tag matching)
```

---

## Key Insight: Where the Moat Lives

The moat is NOT in the AI or the code. It's in the **curation layer**:

1. **What gets included** — hand-selecting primary source material, not scraping everything
2. **How it's structured** — each mental model coded as a reusable reasoning framework, not just text
3. **Quality of tagging** — knowing when a model applies and when it doesn't
4. **Anti-patterns** — knowing the common misapplications prevents the tool from giving misleading advice

This is a content + structure moat, similar to how Bloomberg's value isn't in the terminal software but in the data pipeline behind it.

---

## MVP Scope (Ship in 2-3 weeks)

- [ ] 20 curated mental models from 6 thinkers
- [ ] Single problem input → auto-matched model analysis
- [ ] "Think Like" mode with 1 thinker at a time
- [ ] Structured output (model → logic → precedent → insight)
- [ ] Clean web UI
- [ ] Waitlist → early access flow
- [ ] No auth required for first use (rate-limited)

---

## Source Material: Where the Information Comes From

### Tier 1 — Freely Available Primary Sources (Gold)

These are public, high-signal, and legally clean. Start here.

| Thinker | Free Sources |
|---------|-------------|
| **Warren Buffett** | Berkshire Hathaway annual shareholder letters (1977–present), all free on berkshirehathaway.com. ~50 years of capital allocation reasoning. Also: annual meeting transcripts (many transcribed by fans), CNBC interview archive. |
| **Charlie Munger** | "The Psychology of Human Misjudgment" speech (full transcript widely available), Wesco Financial shareholder letters, Daily Journal annual meeting transcripts, USC Law School commencement speech, multiple Berkshire meeting Q&A transcripts. |
| **Henry Singleton** | Teledyne annual reports (available through SEC EDGAR for later years). The primary structured source is *The Outsiders* by William Thorndike (Chapter 1) — you'd paraphrase, not quote. |
| **Daniel Kahneman** | Nobel Prize lecture (free on nobelprize.org), multiple academic papers on JSTOR/Google Scholar (many open access), TED talks (transcripts available), long-form interviews with Tyler Cowen, Tim Ferriss, etc. |
| **Richard Feynman** | Caltech commencement address "Cargo Cult Science" (public), *The Character of Physical Law* lectures (transcripts), multiple published lecture transcripts, interviews, "Surely You're Joking" anecdotes widely discussed. |
| **Claude Shannon** | "A Mathematical Theory of Communication" (original paper, public domain at this point), Bell Labs papers, MIT lecture transcripts, multiple published interviews. |
| **Andy Grove** | Intel annual letters, "Only the Paranoid Survive" framework widely discussed, Stanford GSB lectures, multiple published interviews. |
| **Nassim Taleb** | Extensive public writing on fooledbyrandness.com / Medium, academic papers (freely available), YouTube lectures, Twitter/X threads (massive corpus of reasoning in public). |
| **Ray Dalio** | "Principles" — many core principles published free on principles.com before the book, LinkedIn articles, multiple TED/conference talks, Bridgewater "Daily Observations" excerpts. |
| **Peter Thiel** | Stanford CS183 lecture notes (published as "Zero to One" but original notes are public), multiple long-form interviews, debate transcripts. |

### Tier 2 — Books (Paraphrase, Don't Quote)

You cannot embed copyrighted book text verbatim. But you **can**:

- **Extract the mental model structure** — the framework itself (e.g., "inversion thinking") is an idea, not copyrightable
- **Paraphrase the reasoning pattern** — describe HOW the thinker approaches problems in your own words
- **Reference historical decisions** — facts about what Singleton did at Teledyne are historical facts, not copyrighted
- **Create original structured frameworks** inspired by documented approaches

Key books to study and distill frameworks from:

| Book | What You Extract |
|------|-----------------|
| *Poor Charlie's Almanack* | Munger's 25 cognitive biases, latticework of mental models, inversion framework |
| *The Outsiders* (Thorndike) | Capital allocation frameworks of Singleton, Malone, Buffett, etc. |
| *Thinking, Fast and Slow* (Kahneman) | System 1/System 2, prospect theory, anchoring, availability bias frameworks |
| *Antifragile* / *The Black Swan* (Taleb) | Barbell strategy, via negativa, skin in the game decision framework |
| *Only the Paranoid Survive* (Grove) | Strategic inflection points, 10X forces framework |
| *Principles* (Dalio) | Radical transparency, believability-weighted decision making |
| *Zero to One* (Thiel) | Definite optimism, monopoly vs. competition, secrets framework |
| *The Art of Strategy* (Dixit & Nalebuff) | Game theory applied to business decisions |
| *Influence* (Cialdini) | 6 principles of persuasion as decision-awareness tools |
| *Superforecasting* (Tetlock) | Calibration, reference class forecasting, updating framework |

### Tier 3 — Academic & Institutional Sources

- **Nobel Prize lectures** — nobelprize.org hosts full texts/videos of every laureate's lecture. Free.
- **NBER working papers** — many behavioral economics papers freely accessible
- **Google Scholar** — search for foundational papers on specific mental models
- **University lecture series** — MIT OpenCourseWare, Stanford eCorner, Yale Open Courses
- **SEC filings** — EDGAR has decades of annual reports, proxy statements, shareholder letters

### How to Build It Legally

1. **Don't embed book text.** Create your own structured mental model definitions inspired by documented frameworks.
2. **Public speeches, letters, and papers are fair game.** Embed these directly (with attribution).
3. **Facts and ideas are not copyrightable.** "Singleton bought back 90% of Teledyne's shares" is a fact. The specific sentences in a biography describing it are copyrighted.
4. **Your structured framework IS the product.** The value is in how you codify "here's when to apply inversion thinking" — that's your original work.

### Practical Data Pipeline

```
Phase 1: Manual curation (you + 1-2 people read primary sources)
    → Extract 20-30 mental models
    → Write structured model definitions in your own words
    → Tag with: thinker, problem types, reasoning steps, anti-patterns

Phase 2: Embed public source documents
    → Shareholder letters, speeches, papers, lectures
    → Chunk and embed into vector store
    → Link chunks to relevant mental model IDs

Phase 3: Expand via community
    → Let expert users submit new thinker frameworks
    → Editorial review before inclusion
    → This becomes a flywheel
```

---

## Pricing Strategy

### Philosophy: Price for the Value of Better Decisions

The reference frame is NOT "what do AI tools cost" ($20/mo).
The reference frame is "what does better decision-making cost":

- Executive coaching: **$500–1,000/hour**
- Strategy consulting (McKinsey, Bain): **$500K–$2M per engagement**
- Bad capital allocation decision on $2M: **costs $2M**
- A single avoided cognitive bias in a fundraise or acquisition: **worth $50K–$500K+**

Thinkerton should be priced like a premium decision tool for serious operators, not like another ChatGPT wrapper.

### Recommended Tiers

#### Operator — $199/month (or $1,990/year)

- 30 deep analyses per month
- All thinkers and mental models
- "Think Like" mode with any single thinker
- Full reasoning chains with source citations
- Decision journal (personal)
- Export to PDF/Notion

*Who it's for: Founders, solo operators, investors making daily decisions.*

#### Principal — $499/month (or $4,990/year)

- Unlimited analyses
- Multi-lens comparison (side-by-side thinkers)
- Adversarial review mode
- Decision journal with pattern tracking over time
- Priority processing (faster, deeper analysis)
- API access (100 calls/month)
- Custom thinker profiles (add frameworks from your own mentors/sources)

*Who it's for: Fund managers, CEOs, serious capital allocators who make decisions worth millions.*

#### Partnership — $2,500/month (custom annual)

- Everything in Principal
- Team accounts (up to 10 seats)
- Shared decision journals and collaborative analysis
- Custom knowledge base (upload your firm's own frameworks, past decisions, internal memos)
- Dedicated onboarding
- Quarterly framework updates curated for your industry
- White-glove support

*Who it's for: Investment firms, PE/VC funds, executive teams at growth-stage companies.*

### Why High Pricing Works Here

1. **Filtering signal** — $199/mo filters for people making real decisions, not tire-kickers. The quality of feedback and community improves dramatically.

2. **Value anchoring** — If your next capital allocation decision is about $500K+, a $199/mo tool that helps you think more clearly about it is absurdly cheap. The price is trivial relative to the decision sizes.

3. **Perceived seriousness** — A $20/mo tool feels like a toy. A $499/mo tool feels like a professional instrument. You want people to take the output seriously and actually use it in their decision process.

4. **Sustainable economics** — At $499/mo, you need ~200 Principal subscribers to hit $1.2M ARR. That's achievable with a focused audience of fund managers and CEOs. No need for mass-market growth hacking.

5. **Comparable pricing signals:**
   - Bloomberg Terminal: ~$24,000/year
   - Stratechery (newsletter): $120/year
   - Masterclass: $120/year (entertainment-grade learning)
   - Executive coaching: $2,000–$5,000/month
   - Thinkerton at $499/mo sits between premium content and professional advisory — exactly where it should be.

### Launch Strategy

1. **Waitlist → Founding Members** — First 100 users get "Founding Member" pricing locked in at $149/mo for life (Operator tier). Creates urgency and early adoption.
2. **No free tier.** Offer a 7-day free trial instead. Free tiers attract the wrong users and devalue the tool.
3. **Annual discount** — ~17% off for annual commitment. This is standard and improves cash flow.
4. **Raise prices as the knowledge base grows.** More thinkers, more models, more value = higher price. Early users lock in lower rates forever.

---

## Open Questions

1. **Standalone product vs. feature?** — The landing page assumes standalone. If this is a feature inside something else, the architecture stays the same but the frontend integration changes.
2. **Thinker prioritization** — Which 6-8 thinkers to start with? Suggested first batch: Munger, Singleton, Buffett, Kahneman, Feynman, Shannon, Grove, Taleb.
