import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import { RECORD_RESUME_TOOL } from './resumeTool.js'

const PORT = process.env.PORT || 3001
const MODEL = 'claude-opus-5'

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn(
    '\n[resume-builder] Warning: ANTHROPIC_API_KEY is not set.\n' +
      'Copy server/.env.example to .env in the project root and add your key.\n',
  )
}

const client = new Anthropic()

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

const CHAT_SYSTEM_PROMPT = `You are a friendly, efficient resume-intake assistant. Your job is to interview the
candidate about their professional background so their resume can be built from the conversation.

Guidelines:
- Ask one or two focused questions at a time (name/title, then work history, then education, then skills).
- Keep replies short and conversational, no more than a few sentences.
- Once you have name, at least one job or project, education, and a handful of skills, tell the candidate
  they can click "Generate My Resume" whenever they're ready.
- Never fabricate details the candidate hasn't told you.`

const EXTRACT_SYSTEM_PROMPT = `You extract structured resume data from a conversation between an assistant and a
candidate. Use only information the candidate actually stated. Leave fields empty ("" or []) rather than
guessing. Turn any raw descriptions of work into concise, achievement-focused resume bullet points.`

function isValidMessages(messages) {
  return (
    Array.isArray(messages) &&
    messages.every(
      (m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string',
    )
  )
}

function handleAnthropicError(err, res) {
  console.error(err)
  if (err instanceof Anthropic.AuthenticationError) {
    return res.status(500).json({ error: 'The server’s Anthropic API key is missing or invalid.' })
  }
  if (err instanceof Anthropic.RateLimitError) {
    return res.status(429).json({ error: 'Rate limited by Anthropic. Please try again shortly.' })
  }
  if (err instanceof Anthropic.BadRequestError) {
    return res.status(400).json({ error: err.message })
  }
  if (err instanceof Anthropic.APIError) {
    return res.status(502).json({ error: err.message })
  }
  return res.status(500).json({ error: 'AI request failed.' })
}

app.post('/api/chat', async (req, res) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY. See server/.env.example.' })
  }
  const { messages } = req.body
  if (!isValidMessages(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages must be a non-empty array of {role, content}' })
  }

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      output_config: { effort: 'low' },
      system: CHAT_SYSTEM_PROMPT,
      messages,
    })

    const textBlock = response.content.find((block) => block.type === 'text')
    res.json({ reply: textBlock ? textBlock.text : '' })
  } catch (err) {
    handleAnthropicError(err, res)
  }
})

app.post('/api/extract', async (req, res) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY. See server/.env.example.' })
  }
  const { messages } = req.body
  if (!isValidMessages(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages must be a non-empty array of {role, content}' })
  }

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: EXTRACT_SYSTEM_PROMPT,
      tools: [RECORD_RESUME_TOOL],
      tool_choice: { type: 'tool', name: 'record_resume' },
      messages: [
        ...messages,
        {
          role: 'user',
          content: 'Based on everything I told you, call record_resume now with my complete resume information.',
        },
      ],
    })

    const toolUse = response.content.find((block) => block.type === 'tool_use')
    if (!toolUse) {
      return res.status(502).json({ error: 'The AI did not return structured resume data. Try again.' })
    }
    res.json({ resume: toolUse.input })
  } catch (err) {
    handleAnthropicError(err, res)
  }
})

app.listen(PORT, () => {
  console.log(`AI backend listening on http://localhost:${PORT}`)
})
