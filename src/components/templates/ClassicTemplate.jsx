export default function ClassicTemplate({ data }) {
  const { personal, experience, education, skills } = data

  return (
    <div className="resume classic-template">
      <header className="classic-header">
        <h1>{personal.fullName || 'Your Name'}</h1>
        {personal.title && <p className="classic-title">{personal.title}</p>}
        <div className="classic-contact">
          {[personal.email, personal.phone, personal.location, personal.linkedin]
            .filter(Boolean)
            .join('  ·  ')}
        </div>
      </header>

      {personal.summary && (
        <section className="classic-section">
          <h2>Summary</h2>
          <p>{personal.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="classic-section">
          <h2>Experience</h2>
          {experience.map((entry) => (
            <div className="classic-entry" key={entry.id}>
              <div className="classic-entry-top">
                <strong>{entry.role || 'Role'}{entry.company ? ` — ${entry.company}` : ''}</strong>
                <span>{[entry.startDate, entry.current ? 'Present' : entry.endDate].filter(Boolean).join(' – ')}</span>
              </div>
              {entry.location && <div className="classic-entry-sub">{entry.location}</div>}
              {entry.description && <p className="classic-entry-desc">{entry.description}</p>}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="classic-section">
          <h2>Education</h2>
          {education.map((entry) => (
            <div className="classic-entry" key={entry.id}>
              <div className="classic-entry-top">
                <strong>{entry.school || 'School'}</strong>
                <span>{[entry.startDate, entry.endDate].filter(Boolean).join(' – ')}</span>
              </div>
              {(entry.degree || entry.field) && (
                <div className="classic-entry-sub">{[entry.degree, entry.field].filter(Boolean).join(', ')}</div>
              )}
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="classic-section">
          <h2>Skills</h2>
          <p>{skills.join('  ·  ')}</p>
        </section>
      )}
    </div>
  )
}
