import type { TextMessage, WebhookRequestBody } from '@line/bot-sdk'
import * as LINE from '@line/bot-sdk'

async function validateLineSignature(
  body: string,
  channelSecret: string,
  signature: string,
): Promise<boolean> {
  const encoder = new TextEncoder()

  // 匯入 HMAC-SHA256 金鑰
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(channelSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )

  // 計算 HMAC digest
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(body),
  )

  // 將 LINE header 的 Base64 signature 解碼後比對
  const expectedSignature = Uint8Array.from(
    atob(signature),
    (c) => c.charCodeAt(0),
  )

  const actual = new Uint8Array(signatureBuffer)

  // 長度不同直接回傳 false（防止 timing attack 的最基本防護）
  if (actual.length !== expectedSignature.length) {
    return false
  }

  // 逐 byte 比對（constant-time compare）
  let result = 0
  for (let i = 0; i < actual.length; i++) {
    result |= actual[i] ^ expectedSignature[i]
  }

  return result === 0
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const { pathname } = new URL(request.url)

    if (pathname === '/') {
      return new Response(JSON.stringify({ hello: 'world' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (request.method === 'POST' && pathname === '/webhook') {
      const accessToken: string = env.LINE_CHANNEL_ACCESS_TOKEN
      const channelSecret: string = env.LINE_CHANNEL_SECRET

      // 取得 LINE 簽名 header
      const signature = request.headers.get('x-line-signature')
      if (!signature) {
        return new Response('Missing LINE signature', { status: 401 })
      }

      // 讀取原始 body（必須在驗證前讀取，不可提前 consume）
      let rawBody: string
      try {
        rawBody = await request.text()
      } catch {
        return new Response('Failed to read request body', { status: 400 })
      }

      // 驗證簽名
      const isValid = await validateLineSignature(rawBody, channelSecret, signature)
      if (!isValid) {
        return new Response('Invalid signature', { status: 401 })
      }

      // 解析 JSON body
      let body: WebhookRequestBody
      try {
        body = JSON.parse(rawBody)
      } catch {
        return new Response('Invalid JSON body', { status: 400 })
      }

      const events = body.events
      const event = events[0]

      if (event && event.type === 'message' && event.message.type === 'text') {
        const { replyToken } = event
        const { text } = event.message

        const client = new LINE.messagingApi.MessagingApiClient({
          channelAccessToken: accessToken,
        })

        // 使用 waitUntil 在背景處理 AI Search + 回覆，避免 LINE webhook 2 秒逾時
        ctx.waitUntil((async () => {
          const aiResult = await env.AI
            .autorag(env.AI_SEARCH_AGENT_ID)
            .aiSearch({
              query: text,
            })

          const response: TextMessage = {
            type: 'text',
            text: aiResult.response,
          }

          await client.replyMessage({
            replyToken,
            messages: [response],
          })
        })())
      }

      return new Response(JSON.stringify({ message: 'ok' }), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    return new Response('Not Found', { status: 404 })
  },
} satisfies ExportedHandler<Env>
