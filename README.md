# Cloudflare Worker RAG LINE Bot Template

This is a template for building a Retrieval-Augmented Generation (RAG) LINE Bot using Cloudflare Workers. It provides a basic structure for integrating with the LINE Messaging API and implementing RAG functionality.

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

## Prerequisites

- **Cloudflare R2**: Create a bucket to store the data files.
- **Cloudflare AI Search**: Create an index for retrieval with the following settings:
  - Embedding: `@cf/qwen/qwen3-embedding-0.6b` (Default)
  - Query rewrite (true): `@cf/zai-org/glm-4.7-flash`
  - Reranking (true): `@cf/baai/bge-reranker-base` (Default)
  - Generation: `@cf/zai-org/glm-4.7-flash`
- **Cloudflare Worker**: Create a Worker and link it to the current GitHub repository.
- **LINE Official Account Manager**: Create an official account and enable the Messaging API channel.
  - Obtain the Channel secret.
  - Disable `Auto-reply messages`.
- **LINE Developers**: Create a new Messaging API channel and obtain credentials.
  - Generate a Channel access token.
  - Webhook settings:
    - Webhook URL (e.g., `https://your-worker.your-domain.workers.dev/webhook`)
    - Enable **Use webhook**.
- Once you have all credentials, configure the following Secrets in your Cloudflare Worker:
  - `AI_SEARCH_AGENT_ID`: The index ID created in Cloudflare AI Search.
  - `LINE_CHANNEL_ACCESS_TOKEN`: The Channel access token from LINE Developers.
  - `LINE_CHANNEL_SECRET`: The Channel secret from LINE Developers.

## Data Preparation

Convert your data files into txt or Markdown format, place them in the `data` folder, and upload them to the R2 bucket you created.

## Deploy

Since the Worker is linked to your GitHub repository, every push to the main branch will automatically trigger a deployment via Cloudflare's CI/CD integration.

To monitor live logs after deployment:

```bash
npm run tail
```

## Local Development

Start the local dev server:

```bash
npm run dev
```

Set the environment variables in `.env`:

```env
AI_SEARCH_AGENT_ID=your Cloudflare AI Search index ID
LINE_CHANNEL_ACCESS_TOKEN=your LINE Channel access token
LINE_CHANNEL_SECRET=your LINE Channel secret
```
