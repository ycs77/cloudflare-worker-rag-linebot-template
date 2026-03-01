# Cloudflare Worker RAG LINE Bot Template

This is a template for building a Retrieval-Augmented Generation (RAG) LINE Bot using Cloudflare Workers. It provides a basic structure for integrating with the Line Messaging API and implementing RAG functionality.

## Getting Started

You can create a new repository from this template on GitHub, or create it directly using:

```bash
npx giget gh:ycs77/cloudflare-worker-rag-linebot-template my-new-linebot-repo
```

Then update the "name" fields in `package.json` and `wrangler.jsonc` to match the current repository name (e.g., `my-new-linebot-repo`).

## Installation

Install dependencies via npm:

```bash
npm install
```

## Configuration

1. Update `wrangler.jsonc` with your Cloudflare account details (account_id, zone_id if needed).
2. Add required bindings in `wrangler.jsonc`:
  - LINE channel secret and access token (use wrangler secrets)
  - Any AI, KV, R2, D1, Durable Object, or Vector bindings your bot requires
3. Store secrets securely:

    ```bash
    wrangler secret put LINE_CHANNEL_ACCESS_TOKEN
    wrangler secret put LINE_CHANNEL_SECRET
    wrangler secret put AI_API_KEY
    ```

4. After changing wrangler bindings, run:

    ```bash
    npm run cf-typegen
    ```

## Local Development

Start the local dev server:

```bash
npm run dev
```

Configure a public tunnel (or use Cloudflare Workers preview) and set your LINE webhook URL to the tunnel endpoint.

## Deployment

Build and publish:

```bash
npm run deploy
```

Verify webhook and event delivery in the LINE Developers console.

## Notes

- Do not hardcode secrets in source files.
- Refer to Cloudflare Workers docs for current API limits and platform guidance.
- For bindings and platform limits, consult the AGENTS.md linked in this repo.
