import Anthropic from '@anthropic-ai/sdk'

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514'

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error(
      'AI is not configured. Add ANTHROPIC_API_KEY to Vercel → Settings → Environment Variables, then redeploy.'
    )
  }
  return new Anthropic({ apiKey })
}

export async function POST(req) {
  try {
    const client = getClient()
    const { system, user, images, pdf } = await req.json()
    const content = []
    if (pdf) {
      const data = pdf.includes(',') ? pdf.split(',')[1] : pdf
      content.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data } })
    }
    if (images?.length) {
      for (const img of images) {
        const [header, data] = img.split(',')
        const mediaType = header.match(/data:(.*?);/)?.[1] || 'image/jpeg'
        content.push({ type: 'image', source: { type: 'base64', media_type: mediaType, data } })
      }
    }
    content.push({ type: 'text', text: user })
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content }],
    })
    return Response.json({ text: msg.content[0].text })
  } catch (e) {
    const message = e?.message || 'AI request failed'
    const status = message.includes('ANTHROPIC_API_KEY') ? 503 : 500
    return Response.json({ error: message }, { status })
  }
}
