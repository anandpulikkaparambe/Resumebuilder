import './App.css'
import './components/Sidebar.css'
import './components/FormControls.css'
import './components/steps/steps.css'
import './components/templates/templates.css'

import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import AIChatStep from './components/steps/AIChatStep.jsx'
import PersonalInfoStep from './components/steps/PersonalInfoStep.jsx'
import ExperienceStep from './components/steps/ExperienceStep.jsx'
import EducationStep from './components/steps/EducationStep.jsx'
import SkillsStep from './components/steps/SkillsStep.jsx'
import PreviewStep from './components/steps/PreviewStep.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { emptyResume, newExperienceEntry, newEducationEntry } from './data/emptyResume.js'

export default function App() {
  const [resumeData, setResumeData] = useLocalStorage('resumeBuilderData', emptyResume)
  const [template, setTemplate] = useLocalStorage('resumeBuilderTemplate', () => 'classic')
  const [activeStep, setActiveStep] = useState('ai')

  function applyGeneratedResume(generated) {
    setResumeData({
      personal: { ...emptyResume().personal, ...generated.personal },
      experience: (generated.experience || []).map((entry) => ({ ...newExperienceEntry(), ...entry })),
      education: (generated.education || []).map((entry) => ({ ...newEducationEntry(), ...entry })),
      skills: generated.skills || [],
    })
    setActiveStep('personal')
  }

  function updatePersonal(field, value) {
    setResumeData((prev) => ({ ...prev, personal: { ...prev.personal, [field]: value } }))
  }

  function addExperience() {
    setResumeData((prev) => ({ ...prev, experience: [...prev.experience, newExperienceEntry()] }))
  }

  function updateExperience(id, field, value) {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)),
    }))
  }

  function removeExperience(id) {
    setResumeData((prev) => ({ ...prev, experience: prev.experience.filter((entry) => entry.id !== id) }))
  }

  function addEducation() {
    setResumeData((prev) => ({ ...prev, education: [...prev.education, newEducationEntry()] }))
  }

  function updateEducation(id, field, value) {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)),
    }))
  }

  function removeEducation(id) {
    setResumeData((prev) => ({ ...prev, education: prev.education.filter((entry) => entry.id !== id) }))
  }

  function addSkill(skill) {
    setResumeData((prev) => ({ ...prev, skills: [...prev.skills, skill] }))
  }

  function removeSkill(skill) {
    setResumeData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }))
  }

  function resetResume() {
    if (confirm('This clears all resume data. Are you sure?')) {
      setResumeData(emptyResume())
    }
  }

  return (
    <div className="app-shell">
      <Sidebar activeStep={activeStep} onStepChange={setActiveStep} onReset={resetResume} />

      <main className="app-content">
        {activeStep === 'ai' && <AIChatStep onResumeGenerated={applyGeneratedResume} />}

        {activeStep === 'personal' && (
          <PersonalInfoStep personal={resumeData.personal} onChange={updatePersonal} />
        )}

        {activeStep === 'experience' && (
          <ExperienceStep
            experience={resumeData.experience}
            onAdd={addExperience}
            onUpdate={updateExperience}
            onRemove={removeExperience}
          />
        )}

        {activeStep === 'education' && (
          <EducationStep
            education={resumeData.education}
            onAdd={addEducation}
            onUpdate={updateEducation}
            onRemove={removeEducation}
          />
        )}

        {activeStep === 'skills' && (
          <SkillsStep skills={resumeData.skills} onAdd={addSkill} onRemove={removeSkill} />
        )}

        {activeStep === 'preview' && (
          <PreviewStep data={resumeData} template={template} onTemplateChange={setTemplate} />
        )}
      </main>
    </div>
  )
}
