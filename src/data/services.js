import {
  Palette,
  Code2,
  Image as ImageIcon,
  FileText,
  BrainCircuit,
  Sparkles,
} from 'lucide-react'

export const services = [
  {
    id: 'design',
    icon: Palette,
    title: 'Design Services',
    desc: 'Graphic Designer, Logo, UI/UX, Social Media, Banners & Thumbnails',
    subcategories: [
      'Graphic Designer',
      'Logo Designer',
      'UI/UX Designer',
      'Social Media Post Design',
      'Banner/Poster Designer',
      'Thumbnail Designer',
    ],
  },
  {
    id: 'development',
    icon: Code2,
    title: 'Development Services',
    desc: 'Web, Mobile Apps, E-commerce, Desktop Software & More',
    subcategories: [
      'Web Development (Frontend/Backend)',
      'Website Design (Portfolio, Business)',
      'E-commerce Website',
      'Mobile App Development (Android/iOS)',
      'Desktop Software Development',
    ],
  },
  {
    id: 'image-generation',
    icon: ImageIcon,
    title: 'Image Generation (Free)',
    desc: 'AI-powered image generation — Art, Logos, Concept Art & More',
    subcategories: [
      'AI Image Generation',
      'Art Generation',
      'Concept Art',
      'Character Design',
      'Logo Generation',
    ],
  },
  {
    id: 'writing',
    icon: FileText,
    title: 'Writing & Content',
    desc: 'Content, Blogs, Resumes, Scripts & Creative Writing',
    subcategories: [
      'Content Writing',
      'Blog Writing',
      'Resume/CV Writing',
      'Script Writing',
    ],
  },
  {
    id: 'tech',
    icon: BrainCircuit,
    title: 'Tech & Advanced',
    desc: 'AI, Machine Learning, Data Analysis & Chatbots',
    subcategories: [
      'Machine Learning Projects',
      'AI Model Development',
      'Data Analysis',
      'Chatbot Development',
    ],
  },
  {
    id: 'other',
    icon: Sparkles,
    title: 'Other Services',
    desc: 'Presentations, Data Entry, VA, Translation & Marketing',
    subcategories: [
      'Presentation Design',
      'Data Entry',
      'Virtual Assistant',
      'Translation Service',
      'Social Media Marketing',
    ],
  },
]

export const serviceTitles = services.map((s) => s.title)
