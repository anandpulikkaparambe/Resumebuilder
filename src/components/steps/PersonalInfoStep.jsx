import { TextField, TextAreaField } from '../FormControls.jsx'

export default function PersonalInfoStep({ personal, onChange }) {
  return (
    <div className="step">
      <div className="step-header">
        <h2>Personal Info</h2>
        <p>This appears at the top of your resume.</p>
      </div>

      <div className="card">
        <div className="field-grid">
          <TextField label="Full name" value={personal.fullName} onChange={(v) => onChange('fullName', v)} placeholder="Jordan Lee" />
          <TextField label="Job title" value={personal.title} onChange={(v) => onChange('title', v)} placeholder="Product Designer" />
          <TextField label="Email" type="email" value={personal.email} onChange={(v) => onChange('email', v)} placeholder="jordan@email.com" />
          <TextField label="Phone" value={personal.phone} onChange={(v) => onChange('phone', v)} placeholder="+1 555 123 4567" />
          <TextField label="Location" value={personal.location} onChange={(v) => onChange('location', v)} placeholder="San Francisco, CA" />
          <TextField label="LinkedIn / Portfolio" value={personal.linkedin} onChange={(v) => onChange('linkedin', v)} placeholder="linkedin.com/in/jordanlee" />
        </div>
        <TextAreaField
          label="Summary"
          value={personal.summary}
          onChange={(v) => onChange('summary', v)}
          placeholder="A short 2-3 sentence summary of your experience and goals."
        />
      </div>
    </div>
  )
}
