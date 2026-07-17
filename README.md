<!-- REFERENCE SOLUTION branch. The `main` branch is the starter given to candidates. -->

# Take-Home: AI Flashcard Generator

A Next.js app that turns pasted technical notes into interview flashcards using
an LLM. **The full UI is built and working.** Your job is to build the backend
that makes it real.

## Your task

Implement the flashcard generation, from scratch, against any **OpenAI-compatible
API** (base URL + API key, over HTTP). Do **not** use the local Ollama runtime
or CLI — talk to the model endpoint over HTTP.

Three files are stubbed with `TODO(candidate)` and currently throw / return 501:

| File | What to build |
|------|---------------|
| `lib/prompt.ts` | Design the prompt. Turn notes + options into a prompt that returns ONLY a JSON array of flashcards. |
| `lib/llm.ts` | Call the OpenAI-compatible `/chat/completions` API. Timeout, error handling, JSON extraction + validation, retry-once. |
| `app/api/generate/route.ts` | The endpoint: validate input → build prompt → call model → return `{ cards }` or `{ error }`. |

`lib/types.ts` defines the shared contract (the `Flashcard` shape and the
request options) — code against it. Everything in `app/` UI and
`components/` is done; you should not need to change it.

## What "done" looks like

Paste notes → click **Generate Flashcards** → cards render in the right panel,
flip / next / shuffle all work.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in your own LLM_BASE_URL, LLM_API_KEY, LLM_MODEL
npm run dev                  # http://localhost:3000
```

Use your own API key. Any OpenAI-compatible endpoint works (OpenAI, Groq,
Together, an Ollama-compatible HTTP endpoint, etc.).

## What we look for

- Clean separation of prompt / API / route logic.
- Real error handling: empty input, timeout, rate limit, invalid JSON, network.
- Response validated before it reaches the UI.
- No hardcoded secrets — config from environment only.
- Strong TypeScript typing.

## Stretch (optional)

Export (JSON/CSV/Anki), topic tags, favorites, spaced repetition, a second LLM
provider. Structure your code so these are easy to add later.
