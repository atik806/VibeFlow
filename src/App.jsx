import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { AdminLayout } from './components/admin/AdminLayout'
import { AdminGuard } from './components/admin/AdminGuard'
import { UserGuard } from './components/auth/UserGuard'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import { Spinner } from './components/ui/Spinner'
import { VisitorTracker } from './components/VisitorTracker'

const Home = lazy(() => import('./routes/Home'))
const ServicesPage = lazy(() => import('./routes/ServicesPage'))
const AIGeneratorPage = lazy(() => import('./routes/AIGeneratorPage'))
const AIFeaturesPage = lazy(() => import('./routes/AIFeaturesPage'))
const PlayWithAIPage = lazy(() => import('./routes/PlayWithAIPage'))
const MapPosterPage = lazy(() => import('./routes/MapPosterPage'))
const ObjectDetectionPage = lazy(() => import('./routes/ObjectDetectionPage'))
const GamesPage = lazy(() => import('./routes/GamesPage'))
const CVWithAIPage = lazy(() => import('./routes/CVWithAIPage'))
const AboutPage = lazy(() => import('./routes/AboutPage'))
const FAQPage = lazy(() => import('./routes/FAQPage'))
const ContactPage = lazy(() => import('./routes/ContactPage'))
const PrivacyPage = lazy(() => import('./routes/PrivacyPage'))
const TermsPage = lazy(() => import('./routes/TermsPage'))
const NotFoundPage = lazy(() => import('./routes/NotFoundPage'))

const LoginPage = lazy(() => import('./routes/LoginPage'))
const SignUpPage = lazy(() => import('./routes/SignUpPage'))
const ClientDashboard = lazy(() => import('./routes/ClientDashboard'))

const AdminLogin = lazy(() => import('./routes/AdminLogin'))
const AdminDashboard = lazy(() => import('./routes/AdminDashboard'))
const AdminRequests = lazy(() => import('./routes/AdminRequests'))
const AdminMessages = lazy(() => import('./routes/AdminMessages'))
const AdminSettings = lazy(() => import('./routes/AdminSettings'))

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
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<PageFallback />}>
              <VisitorTracker />
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="services" element={<ServicesPage />} />
                  <Route path="ai-features" element={<AIFeaturesPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="faq" element={<FAQPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="privacy" element={<PrivacyPage />} />
                  <Route path="terms" element={<TermsPage />} />

                  <Route path="login" element={<LoginPage />} />
                  <Route path="signup" element={<SignUpPage />} />

                  <Route element={<UserGuard />}>
                    <Route path="dashboard" element={<ClientDashboard />} />
                  </Route>

                  <Route element={<UserGuard />}>
                    <Route path="ai-generator" element={<AIGeneratorPage />} />
                    <Route path="play-with-ai" element={<PlayWithAIPage />} />
                    <Route path="cv-with-ai" element={<CVWithAIPage />} />
                    <Route path="object-detection" element={<ObjectDetectionPage />} />
                    <Route path="games" element={<GamesPage />} />
                  </Route>

                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                <Route path="/admin/login" element={<AdminLogin />} />

                <Route
                  path="/map-poster"
                  element={
                    <UserGuard>
                      <MapPosterPage />
                    </UserGuard>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <AdminGuard>
                      <AdminLayout />
                    </AdminGuard>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="requests" element={<AdminRequests />} />
                  <Route path="messages" element={<AdminMessages />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}
