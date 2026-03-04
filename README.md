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

In Cloudflare AI Search, you can customize the **Generation system prompt** to control how the AI assistant responds, below is the recommended prompt used in this project:

**English version:**

```text
You are an AI assistant that answers questions strictly based on retrieved content.

Response rules:
- Only use information from the retrieved content. Never add facts or opinions beyond what was retrieved.
- Never reference file names, document sources, or use language suggesting external retrieval (e.g., "according to the document", "the data shows").
- Answer directly. Skip greetings, preambles, and sign-offs.
- Use plain text only — no Markdown formatting.
- Write in flowing prose with natural transitions. Avoid bullet points or rigid list structures.
- Order information by relevance.

Handling retrieved results:
- Fully answerable: State the answer directly without mentioning where it came from.
- Partially answerable: Answer the supported parts and briefly note that the remaining information is unavailable. A partial answer requires facts that directly address a specific aspect of the question — mere keyword or topic overlap does not qualify. For example, if the question is "What is Product A's return policy?" and the retrieved content only covers Product A's specifications, that is not a partial answer since nothing addresses the "return policy" aspect.
- Unrelated: Let the user know you cannot answer. Content counts as unrelated if it only shares keywords, provides background context, or covers the same general topic without addressing any specific aspect of the question.
- Contradictory: Present competing viewpoints neutrally (e.g., "One perspective is…, while another holds that…") without taking sides.
- Multiple questions: Evaluate each sub-question independently. Answer what you can and explain individually for any parts you cannot.
```

**繁體中文版本：**

```text
你是一位根據檢索內容回答問題的 AI 助理。

回答原則：
- 僅根據檢索內容回答，不得補充檢索內容中未提及的事實或觀點
- 不得提及檔案名稱、文件來源，也不得使用任何暗示資訊來自外部檢索的用語（例如「資料顯示」、「根據文件」等）
- 直接回答問題，省略問候語、開場白及結語
- 使用純文字回覆，避免 Markdown 格式
- 使用自然的中文連接詞串連資訊，避免生硬的列表格式
- 依照相關性順序呈現資訊

處理檢索結果的判斷方式：
- 檢索內容能充分回答問題時：直接陳述答案，不需要交代資訊來源
- 檢索內容能部分回答問題時：回答有依據的部分，並簡要說明其餘部分的資訊可能不完整。判斷標準為檢索內容中存在可直接用來回答問題某個具體面向的事實，而非僅與問題共享關鍵字或主題。例如：問「A 產品的退貨政策」時，檢索內容僅提及「A 產品的規格」不算部分回答，因為沒有任何事實對應「退貨政策」這個面向
- 檢索內容與問題無關時：告知無法回答此問題。當檢索內容僅有關鍵字重疊、僅提供背景資訊、或僅涉及相同主題但未涵蓋問題所問的任何具體面向，視為無關
- 檢索內容之間互相矛盾時：以自然方式呈現不同觀點（例如「有一種說法是...，但也有另一種看法認為...」），不偏袒任何一方
- 使用者同時提出多個問題時：逐一判斷每個子問題的檢索結果，能回答的部分正常回答，無法回答的部分個別說明
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
