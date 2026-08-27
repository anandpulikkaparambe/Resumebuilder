export const STEPS = [
  { key: 'ai', label: 'AI Assistant' },
  { key: 'personal', label: 'Personal Info' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'skills', label: 'Skills' },
  { key: 'preview', label: 'Preview & Export' },
]

export default function Sidebar({ activeStep, onStepChange, onReset }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">R</span>
        <span className="sidebar-brand-name">ResumeForge</span>
      </div>

      <nav className="sidebar-nav">
        {STEPS.map((step, index) => (
          <button
            key={step.key}
            className={`sidebar-nav-item ${activeStep === step.key ? 'active' : ''}`}
            onClick={() => onStepChange(step.key)}
          >
            <span className="sidebar-nav-index">{index + 1}</span>
            <span>{step.label}</span>
          </button>
        ))}
      </nav>

      <button className="sidebar-reset" onClick={onReset}>
        Reset resume
      </button>
    </aside>
  )
}
