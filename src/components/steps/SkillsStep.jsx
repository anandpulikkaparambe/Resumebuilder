import { useState } from 'react'
import { TextField } from '../FormControls.jsx'

export default function SkillsStep({ skills, onAdd, onRemove }) {
  const [draft, setDraft] = useState('')

  function submit() {
    const value = draft.trim()
    if (value && !skills.includes(value)) {
      onAdd(value)
    }
    setDraft('')
  }

  return (
    <div className="step">
      <div className="step-header">
        <h2>Skills</h2>
        <p>Add skills one at a time. Press Enter or click Add.</p>
      </div>

      <div className="card">
        <div className="skill-input-row">
          <TextField
            label="Skill"
            value={draft}
            onChange={setDraft}
            placeholder="e.g. React, Figma, SQL"
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
          <button
            className="btn btn-primary"
            style={{ alignSelf: 'flex-end' }}
            onClick={submit}
          >
            Add
          </button>
        </div>

        {skills.length === 0 ? (
          <div className="empty-hint">No skills added yet.</div>
        ) : (
          <div className="tag-list">
            {skills.map((skill) => (
              <span className="tag" key={skill}>
                {skill}
                <button onClick={() => onRemove(skill)}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
