import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { ToastProvider } from './context/ToastContext'
import { Spinner } from './components/ui/Spinner'

const Home = lazy(() => import('./routes/Home'))
const ServicesPage = lazy(() => import('./routes/ServicesPage'))
const AIGeneratorPage = lazy(() => import('./routes/AIGeneratorPage'))
const AIFeaturesPage = lazy(() => import('./routes/AIFeaturesPage'))
const PlayWithAIPage = lazy(() => import('./routes/PlayWithAIPage'))
const ObjectDetectionPage = lazy(() => import('./routes/ObjectDetectionPage'))
const GamesPage = lazy(() => import('./routes/GamesPage'))
const CVWithAIPage = lazy(() => import('./routes/CVWithAIPage'))
const AboutPage = lazy(() => import('./routes/AboutPage'))
const FAQPage = lazy(() => import('./routes/FAQPage'))
const ContactPage = lazy(() => import('./routes/ContactPage'))
const PrivacyPage = lazy(() => import('./routes/PrivacyPage'))
const TermsPage = lazy(() => import('./routes/TermsPage'))
const NotFoundPage = lazy(() => import('./routes/NotFoundPage'))

function PageFallback() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Spinner size="lg" />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="services" element={<ServicesPage />} />
                <Route path="ai-generator" element={<AIGeneratorPage />} />
                <Route path="ai-features" element={<AIFeaturesPage />} />
                <Route path="play-with-ai" element={<PlayWithAIPage />} />
                <Route path="cv-with-ai" element={<CVWithAIPage />} />
                <Route path="object-detection" element={<ObjectDetectionPage />} />
                <Route path="games" element={<GamesPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  )
}
