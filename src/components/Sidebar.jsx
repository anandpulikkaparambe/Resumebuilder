export const STEPS = [
  { key: 'ai', label: 'AI Assistant' },
  { key: 'personal', label: 'Personal Info' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'skills', label: 'Skills' },
  { key: 'preview', label: 'Preview & Export' },
]

export default function Sidebar({ activeStep, onStepChange, onReset, collapsed, onToggleCollapse }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">R</span>
        <span className="sidebar-brand-name">ResumeForge</span>
        <button
          className="sidebar-toggle"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Open sidebar' : 'Close sidebar'}
          title={collapsed ? 'Open sidebar' : 'Close sidebar'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {STEPS.map((step, index) => (
          <button
            key={step.key}
            className={`sidebar-nav-item ${activeStep === step.key ? 'active' : ''}`}
            onClick={() => onStepChange(step.key)}
            title={step.label}
          >
            <span className="sidebar-nav-index">{index + 1}</span>
            <span className="sidebar-nav-label">{step.label}</span>
          </button>
        ))}
      </nav>

      <button className="sidebar-reset" onClick={onReset} title="Reset resume">
        <span className="sidebar-nav-label">Reset resume</span>
        <span className="sidebar-reset-icon">&#8635;</span>
      </button>
    </aside>
  )
}
