import { TextField, TextAreaField, CheckboxField } from '../FormControls.jsx'

export default function ExperienceStep({ experience, onAdd, onUpdate, onRemove }) {
  return (
    <div className="step">
      <div className="step-header">
        <h2>Experience</h2>
        <p>Add your work history, most recent first.</p>
      </div>

      {experience.length === 0 && (
        <div className="empty-hint">No experience added yet.</div>
      )}

      {experience.map((entry, index) => (
        <div className="entry-card" key={entry.id}>
          <div className="entry-card-header">
            <span className="entry-card-title">
              {entry.role || entry.company ? `${entry.role || 'Role'} at ${entry.company || 'Company'}` : `Position ${index + 1}`}
            </span>
            <button className="btn btn-danger" onClick={() => onRemove(entry.id)}>Remove</button>
          </div>

          <div className="field-grid">
            <TextField label="Company" value={entry.company} onChange={(v) => onUpdate(entry.id, 'company', v)} placeholder="Acme Inc." />
            <TextField label="Role" value={entry.role} onChange={(v) => onUpdate(entry.id, 'role', v)} placeholder="Senior Engineer" />
            <TextField label="Location" value={entry.location} onChange={(v) => onUpdate(entry.id, 'location', v)} placeholder="Remote" />
            <TextField label="Start date" value={entry.startDate} onChange={(v) => onUpdate(entry.id, 'startDate', v)} placeholder="Jan 2022" />
            <TextField
              label="End date"
              value={entry.endDate}
              onChange={(v) => onUpdate(entry.id, 'endDate', v)}
              placeholder="Present"
            />
            <CheckboxField label="I currently work here" checked={entry.current} onChange={(v) => onUpdate(entry.id, 'current', v)} />
          </div>

          <TextAreaField
            label="Description"
            value={entry.description}
            onChange={(v) => onUpdate(entry.id, 'description', v)}
            placeholder="Key responsibilities and achievements. One per line works well."
          />
        </div>
      ))}

      <button className="btn btn-secondary" onClick={onAdd}>+ Add experience</button>
    </div>
  )
}
