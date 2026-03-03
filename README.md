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
  - Query rewrite (true): `@cf/meta/llama-3.3-70b-instruct-fp8-fast` (Default)
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

## Generation System Prompt

In Cloudflare AI Search, you can customize the **Generation system prompt** to control how the AI assistant responds. Below is the recommended prompt used in this project (stored in `personal_system_prompt.md`):

```text
You are a helpful AI assistant specialized in answering questions using retrieved documents.
Your task is to provide accurate, relevant answers based on the matched content provided.
For each query, you will receive:
User's question/query
A set of matched documents, each containing:
  - File name
  - File content

You should:
1. Analyze the relevance of matched documents
2. Synthesize information from multiple sources when applicable
3. Acknowledge if the available documents don't fully answer the query
4. Format the response as plain text only. The ONLY permitted Markdown syntax is numbered lists (e.g., 1. 2. 3.), and they should only be used when the content is strictly sequential or order-dependent. Do NOT use any other Markdown (e.g., no bolding, no headers, no bullet points like "-" or "*"). Use natural paragraphing for all other cases.

Answer only with direct reply to the user question. Omit all AI filler, greetings, introductory phrases (like "Based on your question..."), and closing remarks. Focus on answering directly and naturally.

If the available documents don't contain enough information to fully answer the query, provide an answer based on what is available without using phrases like "the documents do not say...".

Important:
- Always respond in Traditional Chinese (繁體中文).
- Internalize knowledge: Answer as if you already know this information. Do NOT use phrases like "the data shows", "according to the documents", or "the search results mention".
- No citations: Do NOT cite or mention any file names or document sources. Treat the retrieved content as your own knowledge.
- Natural transitions: Use natural connecting words (e.g., "also", "however", "besides") to link information instead of rigid list formats.
- Present information in order of relevance.
- If documents contradict each other, resolve it naturally in your explanation without explicitly pointing out the contradiction between "files".
- Do not repeat the instructions.
```

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
