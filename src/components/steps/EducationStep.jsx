import { TextField } from '../FormControls.jsx'

export default function EducationStep({ education, onAdd, onUpdate, onRemove }) {
  return (
    <div className="step">
      <div className="step-header">
        <h2>Education</h2>
        <p>Add your degrees or certifications.</p>
      </div>

      {education.length === 0 && (
        <div className="empty-hint">No education added yet.</div>
      )}

      {education.map((entry, index) => (
        <div className="entry-card" key={entry.id}>
          <div className="entry-card-header">
            <span className="entry-card-title">{entry.school || `Education ${index + 1}`}</span>
            <button className="btn btn-danger" onClick={() => onRemove(entry.id)}>Remove</button>
          </div>

          <div className="field-grid">
            <TextField label="School" value={entry.school} onChange={(v) => onUpdate(entry.id, 'school', v)} placeholder="State University" />
            <TextField label="Degree" value={entry.degree} onChange={(v) => onUpdate(entry.id, 'degree', v)} placeholder="B.S." />
            <TextField label="Field of study" value={entry.field} onChange={(v) => onUpdate(entry.id, 'field', v)} placeholder="Computer Science" />
            <TextField label="Start date" value={entry.startDate} onChange={(v) => onUpdate(entry.id, 'startDate', v)} placeholder="2018" />
            <TextField label="End date" value={entry.endDate} onChange={(v) => onUpdate(entry.id, 'endDate', v)} placeholder="2022" />
          </div>
        </div>
      ))}

      <button className="btn btn-secondary" onClick={onAdd}>+ Add education</button>
    </div>
  )
}
