import { useRef, useState } from 'react'
import { API_BASE } from '../apiBase.js'

export default function ResumeUpload({ onResumeParsed }) {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const inputRef = useRef(null)

  async function handleFile(file) {
    if (!file) return
    setFileName(file.name)
    setError('')
    setStatus('reading')

    try {
      const { extractResumeText } = await import('../lib/extractResumeText.js')
      const text = await extractResumeText(file)
      if (!text.trim()) {
        throw new Error('Could not find any text in that file.')
      }

      setStatus('parsing')
      const response = await fetch(`${API_BASE}/api/parse-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to parse resume.')
      }

      setStatus('done')
      onResumeParsed(payload.resume)
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Something went wrong reading that file.')
    }
  }

  return (
    <div className="card resume-upload">
      <div className="resume-upload-text">
        <strong>Already have a resume?</strong>
        <p>Upload a PDF, DOCX, or TXT file and I'll pull the details into the form for you.</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <button
        className="btn btn-secondary"
        onClick={() => inputRef.current?.click()}
        disabled={status === 'reading' || status === 'parsing'}
      >
        {status === 'reading' && 'Reading file…'}
        {status === 'parsing' && 'Extracting details…'}
        {(status === 'idle' || status === 'done' || status === 'error') && 'Upload resume'}
      </button>

      {fileName && status !== 'idle' && <span className="resume-upload-filename">{fileName}</span>}
      {status === 'done' && <span className="resume-upload-success">Details extracted — check the other tabs.</span>}
      {error && <div className="chat-error">{error}</div>}
    </div>
  )
}
