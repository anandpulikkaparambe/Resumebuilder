import ClassicTemplate from '../templates/ClassicTemplate.jsx'
import ModernTemplate from '../templates/ModernTemplate.jsx'

const TEMPLATES = [
  { key: 'classic', label: 'Classic', Component: ClassicTemplate },
  { key: 'modern', label: 'Modern', Component: ModernTemplate },
]

export default function PreviewStep({ data, template, onTemplateChange }) {
  const active = TEMPLATES.find((t) => t.key === template) ?? TEMPLATES[0]
  const ActiveTemplate = active.Component

  return (
    <div className="step preview-step">
      <div className="step-header">
        <h2>Preview & Export</h2>
        <p>Choose a template and download your resume as a PDF.</p>
      </div>

      <div className="preview-toolbar">
        <div className="template-picker">
          {TEMPLATES.map((t) => (
            <button
              key={t.key}
              className={`template-option ${template === t.key ? 'active' : ''}`}
              onClick={() => onTemplateChange(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => window.print()}>
          Download PDF
        </button>
      </div>

      <div id="resume-print-area" className="preview-canvas">
        <ActiveTemplate data={data} />
      </div>
    </div>
  )
}
