import { useEffect, useRef, useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { emptyResume } from '../../data/emptyResume.js'
import ResumeUpload from '../ResumeUpload.jsx'

const GREETING =
  "Hi! I'll ask a few quick questions and build your resume as we go — this runs fully offline, no AI API needed. What's your full name?"

const PERSONAL_FIELDS = [
  { key: 'fullName', prompt: "What's your full name?" },
  { key: 'title', prompt: 'What job title or role are you aiming for?' },
  { key: 'email', prompt: 'Best email address to put on your resume?' },
  { key: 'phone', prompt: 'Phone number?' },
  { key: 'location', prompt: "City and state/country you're based in?" },
  { key: 'linkedin', prompt: 'LinkedIn or portfolio URL? (type "skip" to leave this out)' },
  { key: 'summary', prompt: 'In a sentence or two, how would you describe your professional background and goals?' },
]

function parseYesNo(text) {
  const t = text.trim().toLowerCase()
  if (['y', 'yes', 'yeah', 'yep', 'sure'].includes(t)) return true
  if (['n', 'no', 'nope', 'nah'].includes(t)) return false
  return null
}

function initialState() {
  return {
    messages: [{ role: 'assistant', content: GREETING }],
    stage: 'personal:0',
    data: emptyResume(),
    currentExp: null,
    currentEdu: null,
  }
}

function advance(state, answerText) {
  const data = {
    ...state.data,
    personal: { ...state.data.personal },
    experience: [...state.data.experience],
    education: [...state.data.education],
    skills: [...state.data.skills],
  }
  let stage = state.stage
  let currentExp = state.currentExp ? { ...state.currentExp } : null
  let currentEdu = state.currentEdu ? { ...state.currentEdu } : null
  let botReply = ''

  function reject(question) {
    botReply = `Just "yes" or "no" — ${question}`
  }

  if (stage.startsWith('personal:')) {
    const index = Number(stage.split(':')[1])
    const field = PERSONAL_FIELDS[index]
    const isSkip = field.key === 'linkedin' && answerText.trim().toLowerCase() === 'skip'
    data.personal[field.key] = isSkip ? '' : answerText.trim()
    const nextIndex = index + 1
    if (nextIndex < PERSONAL_FIELDS.length) {
      stage = `personal:${nextIndex}`
      botReply = PERSONAL_FIELDS[nextIndex].prompt
    } else {
      stage = 'askExperience'
      botReply = 'Want to add a job to your work history? (yes/no)'
    }
  } else if (stage === 'askExperience') {
    const yes = parseYesNo(answerText)
    if (yes === null) reject('want to add a job? (yes/no)')
    else if (yes) {
      currentExp = { company: '', role: '', location: '', startDate: '', endDate: '', current: false, description: '' }
      stage = 'exp:company'
      botReply = 'What company?'
    } else {
      stage = 'askEducation'
      botReply = 'Want to add your education? (yes/no)'
    }
  } else if (stage === 'exp:company') {
    currentExp.company = answerText.trim()
    stage = 'exp:role'
    botReply = 'What was your role/title there?'
  } else if (stage === 'exp:role') {
    currentExp.role = answerText.trim()
    stage = 'exp:location'
    botReply = 'Where was it located? (city, or "remote")'
  } else if (stage === 'exp:location') {
    currentExp.location = answerText.trim()
    stage = 'exp:start'
    botReply = 'When did you start? (e.g. "Jan 2022")'
  } else if (stage === 'exp:start') {
    currentExp.startDate = answerText.trim()
    stage = 'exp:current'
    botReply = 'Do you currently work here? (yes/no)'
  } else if (stage === 'exp:current') {
    const yes = parseYesNo(answerText)
    if (yes === null) reject('do you currently work here? (yes/no)')
    else {
      currentExp.current = yes
      if (yes) {
        stage = 'exp:description'
        botReply = 'Give me a couple of accomplishments or responsibilities (one message is fine).'
      } else {
        stage = 'exp:end'
        botReply = 'When did it end? (e.g. "Mar 2024")'
      }
    }
  } else if (stage === 'exp:end') {
    currentExp.endDate = answerText.trim()
    stage = 'exp:description'
    botReply = 'Give me a couple of accomplishments or responsibilities (one message is fine).'
  } else if (stage === 'exp:description') {
    currentExp.description = answerText.trim()
    data.experience.push(currentExp)
    currentExp = null
    stage = 'askExperience'
    botReply = 'Got it. Add another job? (yes/no)'
  } else if (stage === 'askEducation') {
    const yes = parseYesNo(answerText)
    if (yes === null) reject('want to add your education? (yes/no)')
    else if (yes) {
      currentEdu = { school: '', degree: '', field: '', startDate: '', endDate: '' }
      stage = 'edu:school'
      botReply = 'What school did you attend?'
    } else {
      stage = 'skills'
      botReply = 'Last one — list your top skills, separated by commas.'
    }
  } else if (stage === 'edu:school') {
    currentEdu.school = answerText.trim()
    stage = 'edu:degree'
    botReply = "What degree? (e.g. \"B.S.\", or leave blank if none)"
  } else if (stage === 'edu:degree') {
    currentEdu.degree = answerText.trim()
    stage = 'edu:field'
    botReply = 'Field of study?'
  } else if (stage === 'edu:field') {
    currentEdu.field = answerText.trim()
    stage = 'edu:start'
    botReply = 'What year did you start?'
  } else if (stage === 'edu:start') {
    currentEdu.startDate = answerText.trim()
    stage = 'edu:end'
    botReply = 'What year did you finish (or expect to)?'
  } else if (stage === 'edu:end') {
    currentEdu.endDate = answerText.trim()
    data.education.push(currentEdu)
    currentEdu = null
    stage = 'askEducation'
    botReply = 'Got it. Add another school? (yes/no)'
  } else if (stage === 'skills') {
    data.skills = answerText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    stage = 'done'
    botReply = 'All set! Click "Generate My Resume" below to fill everything in — you can still edit any of it afterward.'
  } else {
    botReply = 'You\'re all done here — click "Generate My Resume" below, or use "Start over".'
  }

  return {
    data,
    stage,
    currentExp,
    currentEdu,
    messages: [...state.messages, { role: 'user', content: answerText }, { role: 'assistant', content: botReply }],
  }
}

export default function AIChatStep({ onResumeGenerated }) {
  const [state, setState] = useLocalStorage('resumeBuilderChatState', initialState)
  const [draft, setDraft] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [state.messages.length])

  function submit() {
    const text = draft.trim()
    if (!text) return
    setDraft('')
    setState((prev) => advance(prev, text))
  }

  function startOver() {
    if (confirm('Clear this conversation and start over?')) {
      setState(initialState())
    }
  }

  function generate() {
    onResumeGenerated(state.data)
  }

  return (
    <div className="step ai-step">
      <div className="step-header">
        <h2>AI Assistant</h2>
        <p>Answer a few questions in the chat, then generate your resume — no API key needed.</p>
      </div>

      <ResumeUpload onResumeParsed={onResumeGenerated} />

      <div className="chat-card">
        <div className="chat-log" ref={listRef}>
          {state.messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.role}`}>
              {msg.content}
            </div>
          ))}
        </div>

        <div className="chat-input-row">
          <textarea
            className="field-input chat-input"
            rows={2}
            value={draft}
            placeholder="Type your answer…"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                submit()
              }
            }}
          />
          <button className="btn btn-primary" onClick={submit} disabled={!draft.trim()}>
            Send
          </button>
        </div>

        <div className="chat-actions-row">
          <button className="btn btn-secondary" onClick={generate}>
            Generate My Resume
          </button>
          <button className="btn btn-danger" onClick={startOver}>
            Start over
          </button>
        </div>
      </div>
    </div>
  )
}
