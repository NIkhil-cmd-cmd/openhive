# OpenHive — Presentation Script

Use this while scrolling through the site. Each block matches one full-screen slide (`#intro` → `#results`).

**Total time:** ~8–10 minutes (demo adds 2–3 min if you run it live)

---

## Slide 01 — Intro (`#intro`)

**Say:**

> OpenHive — agents that think together.
>
> Shared memory for AI agents. Today every agent runs alone; we built one hive so they learn from each other.

**Do:** Scroll down.

---

## Slide 02 — Problem (`#problem`)

**Say:**

> Here's the current state without OpenHive.
>
> Agent A figures out the right tool path. Agent B gets the same kind of request and starts from zero — re-exploring, re-failing, re-billing.
>
> Nothing transfers between them. You're paying for work your fleet already did.

**Point at:** The white lead sentence, then the chart.

**Say:**

> On one real task, three siloed agents burn **28 tool calls**. With OpenHive it's **8** — because the second agent inherits what the first learned.
>
> That's **3.5×** wasted effort when you don't use shared memory.

**Do:** Pause on the chart and **3.5× fewer calls**.

---

## Slide 03 — Solution (`#solution`)

**Say:**

> OpenHive fixes this with one shared memory layer — every agent reads and writes the same vector store.

**Point at:** Hive diagram and the three benefits.

---

## Slide 04 — Technical (`#technical`)

**Say:**

> Under the hood it's straightforward.
>
> OpenHome runs the agents. Supabase pgvector stores embeddings. OpenAI `text-embedding-3-small` for vectors. A Markov router picks the tool sequence. Node serves the API.

**Point at:** Pipeline steps 1–5, then stack list.

**Say:**

> Five steps, every time: embed, retrieve, route, execute, write back.

---

## Slide 05 — Architecture (`#flow`)

**Say:**

> Here's the full routing pipeline.
>
> Every agent embeds its prompt, searches collective memory with KNN, and routes tools through a Markov model trained on what actually worked before.

**Point at:** Interactive flow diagram.

**Say:**

> Read path: embed → memory → KNN → route → execute.
>
> Write path: after execution, results go back into the hive.

**Do (optional):** Click **Play flow**, or toggle **Read path** / **Write path**.

---

## Slide 06 — Demo (`#demo`)

**Say:**

> Same flight request: SFO to Pittsburgh, round trip. Two agents.
>
> **Cold** — no memory, explores blindly.
>
> **Warm** — OpenHive loaded with historical traces, Markov-guided.

**Do:** Click **START DEMO ▶**

**While it runs:**

- Cold side: call out wasted steps and token count climbing.
- Learning phase: mention traces loading into the hive.
- Warm side: call out shorter path, fewer tokens.

**When results appear in demo:**

> Same task — fraction of the tokens and time once memory is shared.

---

## Slide 07 — Results (`#results`)

**Say:**

> Numbers from our runs:
>
> - **71%** fewer tokens, warm vs cold
> - **3.5×** fewer tool calls with shared memory
> - **Under 2 seconds** to route once the hive is warm

**Say:**

> This compounds — every agent makes OpenHive better for the next one.

---

## Closing — Credits

**Say:**

> OpenHive is open source. Code is on GitHub.
>
> Built by Advaiyt Sane and Nikhil Krishnaswamy.

**Do:** Open GitHub link if audience wants to dig in.

---

## Q&A — Short answers

| Question | Answer |
|----------|--------|
| Does it work with any LLM? | Yes — memory and routing are model-agnostic. |
| Where is memory stored? | Supabase + pgvector. |
| What if agents have different tasks? | KNN clusters by intent; Markov buckets per task type. |
| Cost? | Free tier stack; embeddings are the main variable cost. |

---

## Presenter checklist

- [ ] Dev server or production URL loaded
- [ ] Scroll snap working (one slide per scroll on desktop)
- [ ] Demo tested once before presenting (**START DEMO**)
- [ ] GitHub repo link works
- [ ] Browser zoom at 100%
