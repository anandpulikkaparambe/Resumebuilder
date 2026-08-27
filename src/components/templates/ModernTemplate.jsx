export default function ModernTemplate({ data }) {
  const { personal, experience, education, skills } = data

  return (
    <div className="resume modern-template">
      <aside className="modern-sidebar">
        <h1>{personal.fullName || 'Your Name'}</h1>
        {personal.title && <p className="modern-title">{personal.title}</p>}

        <div className="modern-sidebar-section">
          <h3>Contact</h3>
          <ul>
            {personal.email && <li>{personal.email}</li>}
            {personal.phone && <li>{personal.phone}</li>}
            {personal.location && <li>{personal.location}</li>}
            {personal.linkedin && <li>{personal.linkedin}</li>}
          </ul>
        </div>

        {skills.length > 0 && (
          <div className="modern-sidebar-section">
            <h3>Skills</h3>
            <div className="modern-skill-list">
              {skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div className="modern-sidebar-section">
            <h3>Education</h3>
            {education.map((entry) => (
              <div key={entry.id} className="modern-edu-entry">
                <strong>{entry.school || 'School'}</strong>
                <span>{[entry.degree, entry.field].filter(Boolean).join(', ')}</span>
                <span>{[entry.startDate, entry.endDate].filter(Boolean).join(' – ')}</span>
              </div>
            ))}
          </div>
        )}
      </aside>

      <main className="modern-main">
        {personal.summary && (
          <section className="modern-section">
            <h2>Summary</h2>
            <p>{personal.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="modern-section">
            <h2>Experience</h2>
            {experience.map((entry) => (
              <div className="modern-entry" key={entry.id}>
                <div className="modern-entry-top">
                  <strong>{entry.role || 'Role'}{entry.company ? ` — ${entry.company}` : ''}</strong>
                  <span>{[entry.startDate, entry.current ? 'Present' : entry.endDate].filter(Boolean).join(' – ')}</span>
                </div>
                {entry.location && <div className="modern-entry-sub">{entry.location}</div>}
                {entry.description && <p className="modern-entry-desc">{entry.description}</p>}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}
