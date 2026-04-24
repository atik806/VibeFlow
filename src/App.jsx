import { useState } from 'react'
import { generateImageFromPrompt } from './imageGenerator'
import './index.css'

const LightningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
)

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
)

const CpuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
  </svg>
)

const SparkleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18"/><path d="M3 12h18"/><path d="M12 3l-2 9"/><path d="M12 3l2 9"/><path d="M12 21l-2-9"/><path d="M12 21l2-9"/><path d="M3 12l9-2"/><path d="M3 12l9 2"/><path d="M21 12l-9-2"/><path d="M21 12l-9 2"/>
  </svg>
)

const PaletteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/>
  </svg>
)

const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
)

const SmartphoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
)

const MonitorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
)

const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
)

const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
)

const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
)

const VideoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
)

const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
  </svg>
)

const BarChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
  </svg>
)

const MessageCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
)

const PresentationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
)

const DatabaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
)

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)

const MegaphoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
  </svg>
)

const LaptopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
)

const LayoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
  </svg>
)

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
)

const WandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 4-2.2 2.2"/><path d="m18 7-2.2-2.2"/><path d="M15 20l2.2-2.2"/><path d="m18 17l2.2 2.2"/><path d="m9 9 2.2-2.2"/><path d="m7 7 2.2 2.2"/><path d="m14 14-2.2 2.2"/><path d="m12 12 2.2 2.2"/><path d="M7.5 13.5 5 16"/><path d="m10.5 16.5 2.5 2.5"/><path d="M14.5 10.5 17 8"/><path d="m16.5 7.5 2.5 2.5"/><path d="M9.5 5.5 7 3"/><path d="m6.5 3.5-2.5 2.5"/><path d="m21 3-2 2"/><path d="m18 6 2-2"/><path d="M3 16v3a1 1 0 0 0 1 1h3"/><path d="M16 21h3a1 1 0 0 0 1-1v-3"/><line x1="2" y1="2" x2="22" y2="22"/><line x1="6.5" y1="6.5" x2="17.5" y2="17.5"/>
  </svg>
)

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#EAB308" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const allSubcategories = {
  'Design Services': ['Graphic Designer', 'Logo Designer', 'UI/UX Designer', 'Social Media Post Design', 'Banner/Poster Designer', 'Thumbnail Designer'],
  'Development Services': ['Web Development (Frontend/Backend)', 'Website Design (Portfolio, Business)', 'E-commerce Website', 'Mobile App Development (Android/iOS)', 'Desktop Software Development'],
  'Writing & Content': ['Content Writing', 'Blog Writing', 'Resume/CV Writing', 'Script Writing'],
  'Tech & Advanced': ['Machine Learning Projects', 'AI Model Development', 'Data Analysis', 'Chatbot Development'],
  'Image Generation (Free)': ['AI Image Generation', 'Art Generation', 'Concept Art', 'Character Design', 'Logo Generation'],
  'Other Services': ['Presentation Design', 'Data Entry', 'Virtual Assistant', 'Translation Service', 'Social Media Marketing']
}

function App() {
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    subcategory: '',
    description: '',
    budget: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [generatedImage, setGeneratedImage] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState('')

  const generateImage = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    try {
      const imageUrl = await generateImageFromPrompt(prompt)
      setGeneratedImage(imageUrl)
    } catch (error) {
      console.error('Error generating image:', error)
      alert('Failed to generate image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    console.log('Request submitted:', formData)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'service' ? { subcategory: '' } : {})
    }))
  }
  const services = [
    { 
      icon: PaletteIcon, 
      title: 'Design Services', 
      desc: 'Graphic Designer, Logo, UI/UX, Social Media, Banners & Thumbnails',
      subcategories: ['Graphic Designer', 'Logo Designer', 'UI/UX Designer', 'Social Media Post Design', 'Banner/Poster Designer', 'Thumbnail Designer']
    },
    { 
      icon: CodeIcon, 
      title: 'Development Services', 
      desc: 'Web, Mobile Apps, E-commerce, Desktop Software & More',
      subcategories: ['Web Development (Frontend/Backend)', 'Website Design (Portfolio, Business)', 'E-commerce Website', 'Mobile App Development (Android/iOS)', 'Desktop Software Development']
    },
    { 
      icon: ImageIcon, 
      title: 'Image Generation (Free)', 
      desc: 'AI-powered image generation - Art, Logos, Concept Art & More',
      subcategories: ['AI Image Generation', 'Art Generation', 'Concept Art', 'Character Design', 'Logo Generation']
    },
    { 
      icon: FileTextIcon, 
      title: 'Writing & Content', 
      desc: 'Content, Blogs, Resumes, Scripts & Creative Writing',
      subcategories: ['Content Writing', 'Blog Writing', 'Resume/CV Writing', 'Script Writing']
    },
    { 
      icon: BrainIcon, 
      title: 'Tech & Advanced', 
      desc: 'AI, Machine Learning, Data Analysis & Chatbots',
      subcategories: ['Machine Learning Projects', 'AI Model Development', 'Data Analysis', 'Chatbot Development']
    },
    { 
      icon: SparkleIcon, 
      title: 'Other Services', 
      desc: 'Presentations, Data Entry, VA, Translation & Marketing',
      subcategories: ['Presentation Design', 'Data Entry', 'Virtual Assistant', 'Translation Service', 'Social Media Marketing']
    }
  ]

  const features = [
    { icon: UserIcon, title: 'No Hiring Hassle', desc: 'No need to browse profiles or negotiate. Just tell us what you need.' },
    { icon: LightningIcon, title: 'Expert Team Ready', desc: 'A dedicated team of skilled professionals at your service.' },
    { icon: CpuIcon, title: 'Fast Turnaround', desc: 'Quick delivery without compromising on quality.' },
    { icon: SparkleIcon, title: 'Secure & Confidential', desc: 'Your data and projects are protected with strict confidentiality.' }
  ]

  const testimonials = [
    { name: 'Sarah Mitchell', role: 'Startup Founder', quote: 'Vibe Flow transformed our vision into reality. Submitted one request, received a stunning product.', initials: 'SM' },
    { name: 'James Chen', role: 'Marketing Director', quote: 'The team handled everything end-to-end. Incredible experience from start to finish.', initials: 'JC' },
    { name: 'Elena Rodriguez', role: 'Entrepreneur', quote: 'Finally, a service that just works. No hassle, no stress—just results.', initials: 'ER' }
  ]

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">
            <div className="logo-icon"><LightningIcon /></div>
            <span>Vibe Flow</span>
          </div>
          <div className="nav-links">
            <a href="#services">Services</a>
            <a href="#image-generation">AI Generator</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#about-us">About</a>
          </div>
          <button className="nav-cta" onClick={() => setShowRequestModal(true)}>Submit a Request</button>
          <button className="mobile-menu-btn"><MenuIcon /></button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>Tell Us What You Need. We'll Handle the Rest.</h1>
            <p>Simply submit your request and the Vibe Flow expert team delivers. No browsing, no hiring—just tell us what you need.</p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => setShowRequestModal(true)}>Submit a Request</button>
              <button className="btn-ghost" onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}>See What We Do</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="glow-ring"></div>
            <div className="mockup-card">
              <div className="mockup-header">
                <div className="mockup-dot red"></div>
                <div className="mockup-dot yellow"></div>
                <div className="mockup-dot green"></div>
                <span className="mockup-title">New Request</span>
              </div>
              <div className="mockup-form">
                <input className="mockup-input" placeholder="Your name" />
                <input className="mockup-input" placeholder="Email address" />
                <textarea className="mockup-textarea" placeholder="Describe what you need..."></textarea>
                <button className="mockup-submit">Submit Request</button>
              </div>
              <div className="mockup-status">
                <span className="status-dot"></span>
                Team is working on it...
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <span className="section-label">How It Works</span>
          <h2 className="section-title">Simple. Seamless. Stress-Free.</h2>
          <p className="section-subtitle">Three easy steps to get your project done. Just tell us what you need.</p>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Submit Your Request</h3>
              <p>Tell us what you need through our simple form. No browsing or hiring required.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>We Assign the Expert</h3>
              <p>Our team selects the right professional for your task and gets to work immediately.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>You Receive the Result</h3>
              <p>Get your completed project delivered to your inbox. That's all there is to it.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="services" id="services">
        <div className="container">
          <span className="section-label">Services</span>
          <h2 className="section-title">What We Can Do For You</h2>
          <p className="section-subtitle">Five core categories with detailed subcategories covering all your creative and technical needs.</p>
          <div className="services-grid">
            {services.map((service, index) => (
              <div className="service-card" key={index}>
                <div className="service-icon"><service.icon /></div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <div className="subcategories">
                  {service.subcategories.map((sub, idx) => (
                    <span key={idx} className="subcategory-tag">{sub}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="image-generation-section" id="image-generation">
        <div className="container">
          <span className="section-label">Free Tool</span>
          <h2 className="section-title">AI Image Generator</h2>
          <p className="section-subtitle">Generate stunning images instantly with AI. It's completely free!</p>
          
          <div className="image-generator">
            <div className="generator-input">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate... (e.g., Astronaut riding a horse)"
                onKeyPress={(e) => e.key === 'Enter' && generateImage()}
              />
              <button 
                className="btn-primary generate-btn" 
                onClick={generateImage}
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <>
                    <WandIcon /> Generate
                  </>
                )}
              </button>
            </div>
            
            {generatedImage && (
              <div className="generated-image-container">
                <img src={generatedImage} alt="Generated" className="generated-image" />
                <a 
                  href={generatedImage} 
                  download="vibeflow-generated-image.png" 
                  className="download-btn"
                >
                  Download Image
                </a>
              </div>
            )}
            
            {!generatedImage && !isGenerating && (
              <div className="generator-placeholder">
                <div className="placeholder-icon"><ImageIcon /></div>
                <p>Your generated image will appear here</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="container">
          <span className="section-label">Why Vibe Flow</span>
          <h2 className="section-title">The Premium Service Experience</h2>
          <p className="section-subtitle">We're not a marketplace. We're your dedicated team.</p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon"><feature.icon /></div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section" id="about-us">
        <div className="container">
          <span className="section-label">About Us</span>
          <h2 className="section-title">Built on Trust, Driven by Results</h2>
          
          <div className="about-content">
            <div className="about-text">
              <p className="about-lead">Vibe Flow was born from a simple idea: getting professional work done shouldn't be complicated.</p>
              <p>Founded in 2024, we set out to eliminate the friction of traditional freelance platforms. No more endless browsing, negotiating, or worrying about quality. Just tell us what you need, and our expert team delivers.</p>
              <p>We're a team of passionate designers, developers, writers, and technologists who believe in the power of exceptional work. Every project we take on is an opportunity to create something great.</p>
              
              <div className="about-stats">
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Projects Completed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Client Satisfaction</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Expert Team Members</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24h</span>
                  <span className="stat-label">Average Response Time</span>
                </div>
              </div>
            </div>
            
            <div className="about-values">
              <h3>Our Values</h3>
              <div className="values-grid">
                <div className="value-card">
                  <div className="value-icon"><LightningIcon /></div>
                  <h4>Quality First</h4>
                  <p>We never compromise on the quality of our work. Every deliverable meets our high standards.</p>
                </div>
                <div className="value-card">
                  <div className="value-icon"><SparkleIcon /></div>
                  <h4>Simplicity</h4>
                  <p>We make things easy. No complex processes, just straightforward solutions.</p>
                </div>
                <div className="value-card">
                  <div className="value-icon"><UsersIcon /></div>
                  <h4>Partnership</h4>
                  <p>We work with you as partners, not just vendors. Your success is our success.</p>
                </div>
                <div className="value-card">
                  <div className="value-icon"><CheckIcon /></div>
                  <h4>Reliability</h4>
                  <p>When we commit, we deliver. Count on us to meet deadlines and exceed expectations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <span className="section-label">Testimonials</span>
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">Don't just take our word for it.</p>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div className="testimonial-card" key={index}>
                <div className="testimonial-header">
                  <div className="testimonial-avatar">{testimonial.initials}</div>
                  <div className="testimonial-info">
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
                <div className="testimonial-stars">
                  <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                </div>
                <p className="testimonial-quote">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-content">
          <h2>Got Something in Mind? Just Ask.</h2>
          <p>Tell us what you need and watch it come to life.</p>
          <button className="cta-button" onClick={() => setShowRequestModal(true)}>Submit Your Request</button>
        </div>
      </section>

      {showRequestModal && (
        <div className="modal-overlay" onClick={() => { setShowRequestModal(false); setSubmitted(false); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setShowRequestModal(false); setSubmitted(false); }}>
              <CloseIcon />
            </button>
            
            {submitted ? (
              <div className="success-message">
                <div className="success-icon"><CheckIcon /></div>
                <h2>Request Submitted!</h2>
                <p>Thank you for your request. Our team will review it and get back to you within 24 hours.</p>
                <button className="btn-primary" onClick={() => { setShowRequestModal(false); setSubmitted(false); setFormData({ name: '', email: '', service: '', subcategory: '', description: '', budget: '' }); }}>
                  Submit Another Request
                </button>
              </div>
            ) : (
              <>
                <h2>Submit a Request</h2>
                <p className="modal-subtitle">Tell us what you need and we'll handle the rest.</p>
                
                <form onSubmit={handleSubmit} className="request-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Your Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        placeholder="John Doe" 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        placeholder="john@example.com" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Service Category</label>
                      <select name="service" value={formData.service} onChange={handleInputChange} required>
                        <option value="">Select a service</option>
                        {Object.keys(allSubcategories).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Subcategory</label>
                      <select 
                        name="subcategory" 
                        value={formData.subcategory} 
                        onChange={handleInputChange}
                        disabled={!formData.service}
                        required
                      >
                        <option value="">Select subcategory</option>
                        {formData.service && allSubcategories[formData.service]?.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Project Description</label>
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange} 
                      placeholder="Describe your project in detail..." 
                      rows="4"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Budget Range (USD)</label>
                    <select name="budget" value={formData.budget} onChange={handleInputChange} required>
                      <option value="">Select budget range</option>
                      <option value="under-500">Under $500</option>
                      <option value="500-1000">$500 - $1,000</option>
                      <option value="1000-2500">$1,000 - $2,500</option>
                      <option value="2500-5000">$2,500 - $5,000</option>
                      <option value="5000+">$5,000+</option>
                    </select>
                  </div>
                  
                  <button type="submit" className="btn-primary submit-btn">
                    Submit Request
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <div className="logo-icon"><LightningIcon /></div>
                <span>Vibe Flow</span>
              </div>
              <p>Your request. Our expertise. Perfect flow.</p>
              <div className="footer-social">
                <a href="#" className="social-link"><TwitterIcon /></a>
                <a href="#" className="social-link"><GithubIcon /></a>
                <a href="#" className="social-link"><LinkedInIcon /></a>
              </div>
            </div>
            <div className="footer-column">
              <h4>Services</h4>
              <ul>
                <li><a href="#">Design Services</a></li>
                <li><a href="#">Development Services</a></li>
                <li><a href="#">Writing & Content</a></li>
                <li><a href="#">Tech & Advanced</a></li>
                <li><a href="#">Other Services</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">How It Works</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Vibe Flow. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App