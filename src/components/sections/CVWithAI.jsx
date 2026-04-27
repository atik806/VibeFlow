import { useState, useRef } from 'react'
import { jsPDF } from 'jspdf'
import { FileText, Sparkles, Download, Copy, CheckCircle2 as CheckCircle, Upload, X } from '../../icons'
import { useSEO } from '../../hooks/useSEO'

const sections = [
  { id: 'personal', title: 'Personal Information' },
  { id: 'summary', title: 'Professional Summary' },
  { id: 'skills', title: 'Skills' },
  { id: 'experience', title: 'Work Experience' },
  { id: 'projects', title: 'Projects' },
  { id: 'education', title: 'Education' },
  { id: 'certifications', title: 'Certifications' },
]

export function CVWithAI() {
  useSEO({
    title: 'CV with AI',
    description: 'Create and improve your resume with AI assistance.',
  })

  const [activeStep, setActiveStep] = useState(0)
  const [cvData, setCvData] = useState({
    personal: { name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' },
    summary: '',
    skills: '',
    experience: [{ title: '', company: '', period: '', bullets: '' }],
    projects: [{ name: '', description: '', technologies: '' }],
    education: [{ school: '', degree: '', year: '' }],
    certifications: '',
  })
  const [generatedCV, setGeneratedCV] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setProfileImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const updateCVData = (section, data) => {
    setCvData(prev => ({ ...prev, [section]: data }))
  }

  const generateCV = async () => {
    setIsGenerating(true)
    setGeneratedCV('')
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const cv = `
${cvData.personal.name || 'Your Name'}
${cvData.personal.email || 'email@example.com'} | ${cvData.personal.phone || '+1 234 567 8900'}
${cvData.personal.location || 'City, Country'}
LinkedIn: ${cvData.personal.linkedin || 'linkedin.com/in/yourname'}
Portfolio: ${cvData.personal.portfolio || 'yourportfolio.com'}

PROFESSIONAL SUMMARY
${cvData.summary || 'A motivated professional with excellent skills and experience.'}

SKILLS
${cvData.skills || 'Communication, Leadership, Problem-solving, Technical Skills'}

WORK EXPERIENCE
${cvData.experience.map(exp => `
${exp.title || 'Position Title'}
${exp.company || 'Company Name'} | ${exp.period || '2020 - Present'}
${exp.bullets || '• Responsibilities and achievements'}
`).join('\n')}

PROJECTS
${cvData.projects.map(proj => `
${proj.name || 'Project Name'}
${proj.description || 'Project description'}
Technologies: ${proj.technologies || 'Tools used'}
`).join('\n')}

EDUCATION
${cvData.education.map(edu => `
${edu.degree || 'Degree Name'}, ${edu.school || 'University Name'}
${edu.year || '2020'}
`).join('\n')}

CERTIFICATIONS
${cvData.certifications || 'Any certifications'}
    `.trim()
    
    setGeneratedCV(cv)
    setIsGenerating(false)
    setActiveStep(sections.length)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedCV)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const contentWidth = pageWidth - margin * 2
    let y = 20

    if (imagePreview) {
      try {
        doc.addImage(imagePreview, 'JPEG', pageWidth - margin - 25, 10, 25, 25)
      } catch (e) {
        try {
          doc.addImage(imagePreview, 'PNG', pageWidth - margin - 25, 10, 25, 25)
        } catch (err) {
          console.log('Could not add image:', err)
        }
      }
    }

    doc.setFontSize(20)
    doc.text(cvData.personal.name || 'Your Name', margin, y)
    y += 6

    doc.setFontSize(10)
    const contactLines = [
      cvData.personal.email || 'email@example.com',
      cvData.personal.phone || '+1 234 567 8900',
      cvData.personal.location || 'City, Country',
    ]
    if (cvData.personal.linkedin) contactLines.push(`LinkedIn: ${cvData.personal.linkedin}`)
    if (cvData.personal.portfolio) contactLines.push(`Portfolio: ${cvData.personal.portfolio}`)
    
    contactLines.forEach(line => {
      doc.text(line, margin, y)
      y += 5
    })
    y += 6

    doc.setFontSize(12)
    doc.text('PROFESSIONAL SUMMARY', margin, y)
    y += 6
    
    doc.setFontSize(10)
    const summary = cvData.summary || 'A motivated professional with excellent skills and experience.'
    const summaryLines = doc.splitTextToSize(summary, contentWidth)
    summaryLines.forEach(line => {
      doc.text(line, margin, y)
      y += 5
    })
    y += 6

    doc.setFontSize(12)
    doc.text('SKILLS', margin, y)
    y += 6
    
    doc.setFontSize(10)
    const skills = cvData.skills || 'Communication, Leadership, Problem-solving, Technical Skills'
    const skillLines = doc.splitTextToSize(skills, contentWidth)
    skillLines.forEach(line => {
      doc.text(line, margin, y)
      y += 5
    })
    y += 6

    doc.setFontSize(12)
    doc.text('WORK EXPERIENCE', margin, y)
    y += 6

    cvData.experience.forEach(exp => {
      doc.setFontSize(11)
      doc.text(exp.title || 'Position Title', margin, y)
      y += 5
      
      doc.setFontSize(9)
      doc.text(`${exp.company || 'Company Name'} | ${exp.period || '2020 - Present'}`, margin, y)
      y += 5
      
      const bullets = exp.bullets || '• Responsibilities and achievements'
      const bulletLines = doc.splitTextToSize(bullets, contentWidth - 3)
      bulletLines.forEach(line => {
        doc.text(line, margin + 3, y)
        y += 5
      })
      y += 4
    })

    if (cvData.projects && cvData.projects.some(p => p.name)) {
      doc.setFontSize(12)
      doc.text('PROJECTS', margin, y)
      y += 6

      cvData.projects.forEach(proj => {
        if (proj.name) {
          doc.setFontSize(11)
          doc.text(proj.name || 'Project Name', margin, y)
          y += 5
          
          doc.setFontSize(9)
          if (proj.description) {
            const descLines = doc.splitTextToSize(proj.description, contentWidth)
            descLines.forEach(line => {
              doc.text(line, margin, y)
              y += 5
            })
          }
          if (proj.technologies) {
            doc.text(`Technologies: ${proj.technologies}`, margin, y)
            y += 5
          }
          y += 3
        }
      })
    }

    doc.setFontSize(12)
    doc.text('EDUCATION', margin, y)
    y += 6

    cvData.education.forEach(edu => {
      doc.setFontSize(10)
      const eduText = `${edu.degree || 'Degree Name'}, ${edu.school || 'University Name'} (${edu.year || '2020'})`
      doc.text(eduText, margin, y)
      y += 5
    })

    if (cvData.certifications) {
      y += 4
      doc.setFontSize(12)
      doc.text('CERTIFICATIONS', margin, y)
      y += 6
      
      doc.setFontSize(10)
      const certLines = doc.splitTextToSize(cvData.certifications, contentWidth)
      certLines.forEach(line => {
        doc.text(line, margin, y)
        y += 5
      })
    }

    const fileName = cvData.personal.name 
      ? `${cvData.personal.name.replace(/\s+/g, '_')}_CV.pdf` 
      : 'resume.pdf'
    
    doc.save(fileName)
  }

  return (
    <div className="cv-section">
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>ATS Resume Builder</h2>

      <div className="cv-wizard">
        <div className="cv-steps">
          {sections.map((section, index) => (
            <button
              key={section.id}
              className={`cv-step ${activeStep === index ? 'active' : ''} ${activeStep > index ? 'completed' : ''}`}
              onClick={() => setActiveStep(index)}
            >
              {index + 1}. {section.title}
            </button>
          ))}
          <button
            className={`cv-step ${activeStep === sections.length ? 'active' : ''}`}
            onClick={() => generatedCV && setActiveStep(sections.length)}
          >
            <Sparkles size={14} />
            Generate
          </button>
        </div>

        <div className="cv-form">
          {activeStep === 0 && (
            <div className="cv-form-section">
              <h3>Personal Information</h3>
              <div className="cv-profile-upload">
                {imagePreview ? (
                  <div className="cv-image-preview">
                    <img src={imagePreview} alt="Profile" />
                    <button className="cv-remove-image" onClick={removeImage}>
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="cv-image-upload" onClick={() => fileInputRef.current?.click()}>
                    <Upload size={24} />
                    <span>Upload Photo</span>
                    <span className="cv-image-hint">Optional</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
              <div className="cv-form-grid">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={cvData.personal.name}
                  onChange={e => updateCVData('personal', { ...cvData.personal, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={cvData.personal.email}
                  onChange={e => updateCVData('personal', { ...cvData.personal, email: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={cvData.personal.phone}
                  onChange={e => updateCVData('personal', { ...cvData.personal, phone: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={cvData.personal.location}
                  onChange={e => updateCVData('personal', { ...cvData.personal, location: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="LinkedIn URL"
                  className="full-width"
                  value={cvData.personal.linkedin}
                  onChange={e => updateCVData('personal', { ...cvData.personal, linkedin: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Portfolio URL (optional)"
                  className="full-width"
                  value={cvData.personal.portfolio}
                  onChange={e => updateCVData('personal', { ...cvData.personal, portfolio: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="GitHub URL"
                  className="full-width"
                  value={cvData.personal.github}
                  onChange={e => updateCVData('personal', { ...cvData.personal, github: e.target.value })}
                />
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="cv-form-section">
              <h3>Professional Summary</h3>
              <textarea
                placeholder="Brief overview of your professional background..."
                value={cvData.summary}
                onChange={e => updateCVData('summary', e.target.value)}
                rows={4}
              />
            </div>
          )}

          {activeStep === 2 && (
            <div className="cv-form-section">
              <h3>Skills</h3>
              <textarea
                placeholder="List your technical and soft skills (comma-separated)..."
                value={cvData.skills}
                onChange={e => updateCVData('skills', e.target.value)}
                rows={4}
              />
            </div>
          )}

          {activeStep === 3 && (
            <div className="cv-form-section">
              <h3>Work Experience</h3>
              {cvData.experience.map((exp, i) => (
                <div key={i} className="cv-form-experience">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={exp.title}
                    onChange={e => {
                      const newExp = [...cvData.experience]
                      newExp[i] = { ...exp, title: e.target.value }
                      updateCVData('experience', newExp)
                    }}
                  />
                  <div className="cv-form-row">
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={e => {
                        const newExp = [...cvData.experience]
                        newExp[i] = { ...exp, company: e.target.value }
                        updateCVData('experience', newExp)
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Period (e.g., 2020-2023)"
                      value={exp.period}
                      onChange={e => {
                        const newExp = [...cvData.experience]
                        newExp[i] = { ...exp, period: e.target.value }
                        updateCVData('experience', newExp)
                      }}
                    />
                  </div>
                  <textarea
                    placeholder="Bullet points (use • to start each point)..."
                    value={exp.bullets}
                    onChange={e => {
                      const newExp = [...cvData.experience]
                      newExp[i] = { ...exp, bullets: e.target.value }
                      updateCVData('experience', newExp)
                    }}
                    rows={4}
                  />
                </div>
              ))}
              <button
                className="cv-add-btn"
                onClick={() => updateCVData('experience', [...cvData.experience, { title: '', company: '', period: '', bullets: '' }])}
              >
                + Add Experience
              </button>
            </div>
          )}

          {activeStep === 4 && (
            <div className="cv-form-section">
              <h3>Projects</h3>
              {cvData.projects.map((proj, i) => (
                <div key={i} className="cv-form-experience">
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={proj.name}
                    onChange={e => {
                      const newProj = [...cvData.projects]
                      newProj[i] = { ...proj, name: e.target.value }
                      updateCVData('projects', newProj)
                    }}
                  />
                  <textarea
                    placeholder="Project description with impact..."
                    value={proj.description}
                    onChange={e => {
                      const newProj = [...cvData.projects]
                      newProj[i] = { ...proj, description: e.target.value }
                      updateCVData('projects', newProj)
                    }}
                    rows={2}
                  />
                  <input
                    type="text"
                    placeholder="Technologies used"
                    value={proj.technologies}
                    onChange={e => {
                      const newProj = [...cvData.projects]
                      newProj[i] = { ...proj, technologies: e.target.value }
                      updateCVData('projects', newProj)
                    }}
                  />
                </div>
              ))}
              <button
                className="cv-add-btn"
                onClick={() => updateCVData('projects', [...cvData.projects, { name: '', description: '', technologies: '' }])}
              >
                + Add Project
              </button>
            </div>
          )}

          {activeStep === 5 && (
            <div className="cv-form-section">
              <h3>Education</h3>
              {cvData.education.map((edu, i) => (
                <div key={i} className="cv-form-education">
                  <input
                    type="text"
                    placeholder="School/University"
                    value={edu.school}
                    onChange={e => {
                      const newEdu = [...cvData.education]
                      newEdu[i] = { ...edu, school: e.target.value }
                      updateCVData('education', newEdu)
                    }}
                  />
                  <div className="cv-form-row">
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={e => {
                        const newEdu = [...cvData.education]
                        newEdu[i] = { ...edu, degree: e.target.value }
                        updateCVData('education', newEdu)
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Year"
                      value={edu.year}
                      onChange={e => {
                        const newEdu = [...cvData.education]
                        newEdu[i] = { ...edu, year: e.target.value }
                        updateCVData('education', newEdu)
                      }}
                    />
                  </div>
                </div>
              ))}
              <button
                className="cv-add-btn"
                onClick={() => updateCVData('education', [...cvData.education, { school: '', degree: '', year: '' }])}
              >
+ Add Education
              </button>
            </div>
          )}

          {activeStep === 6 && (
            <div className="cv-form-section">
              <h3>Certifications (optional)</h3>
              <textarea
                placeholder="List any certifications you have..."
                value={cvData.certifications}
                onChange={e => updateCVData('certifications', e.target.value)}
                rows={4}
              />
            </div>
          )}

          {activeStep === 4 && (
            <div className="cv-form-section">
              <h3>Skills</h3>
              <textarea
                placeholder="List your key skills (e.g., JavaScript, Leadership, Project Management)..."
                value={cvData.skills}
                onChange={e => updateCVData('skills', e.target.value)}
                rows={4}
              />
            </div>
          )}

          {activeStep === sections.length && (
            <div className="cv-generated">
              {isGenerating ? (
                <div className="cv-generating">
                  <div className="cv-spinner"></div>
                  <p>Generating your CV...</p>
                </div>
              ) : generatedCV ? (
                <>
                  <div className="cv-output">
                    <pre>{generatedCV}</pre>
                  </div>
                  <div className="cv-actions">
                    <button className="cv-action-btn" onClick={copyToClipboard}>
                      {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                      {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                    <button className="cv-action-btn primary" onClick={downloadPDF}>
                      <Download size={18} />
                      Download PDF
                    </button>
                  </div>
                </>
              ) : (
                <div className="cv-empty">
                  <p>Fill in your details above and click Generate to create your CV</p>
                </div>
              )}
            </div>
          )}

          <div className="cv-nav">
            {activeStep > 0 && activeStep < sections.length && (
              <button className="cv-nav-btn" onClick={() => setActiveStep(s => s - 1)}>
                Previous
              </button>
            )}
            {activeStep < sections.length - 1 && (
              <button className="cv-nav-btn primary" onClick={() => setActiveStep(s => s + 1)}>
                Next
              </button>
            )}
            {activeStep === sections.length - 1 && !generatedCV && (
              <button className="cv-nav-btn primary" onClick={generateCV}>
                <Sparkles size={16} />
                Generate CV
              </button>
            )}
            {generatedCV && (
              <button className="cv-nav-btn" onClick={() => setActiveStep(0)}>
                Start Over
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}