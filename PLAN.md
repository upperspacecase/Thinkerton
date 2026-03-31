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

## Open Questions

1. **Standalone product vs. feature?** — The landing page assumes standalone. If this is a feature inside something else, the architecture stays the same but the frontend integration changes.
2. **Pricing model?** — Freemium (3 analyses/day free, unlimited paid) vs. flat subscription vs. per-query credits.
3. **Source material licensing** — Some source documents (shareholder letters) are public. Books/biographies need to be summarized/paraphrased, not quoted directly. Need to define fair-use boundaries.
4. **Thinker prioritization** — Which 6-8 thinkers to start with? Suggested first batch: Munger, Singleton, Buffett, Kahneman, Feynman, Shannon, Grove, Taleb.
