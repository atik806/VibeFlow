import { useState, useEffect, useRef } from 'react'
import { useSEO } from '../../hooks/useSEO'
import { env } from '../../lib/env'

const PROFILES = {
  max_accuracy: { label: 'Max Accuracy', model: 'yolov8l.pt' },
  balanced: { label: 'Balanced', model: 'yolov8s.pt' },
  fast: { label: 'Fast', model: 'yolov8n.pt' },
}

export function ObjectDetection() {
  useSEO({
    title: 'Play with AI - Object Detection',
    description: 'Real-time YOLOv8 object detection with your webcam.',
  })

  const [isRunning, setIsRunning] = useState(false)
  const [stats, setStats] = useState({
    fps: 0,
    inference_ms: 0,
    total_objects: 0,
    objects: [],
  })
  const [profile, setProfile] = useState('fast')
  const [statusMessage, setStatusMessage] = useState('')
  const [isStarting, setIsStarting] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const videoRef = useRef(null)
  const statsPollTimeoutRef = useRef(null)
  const isStatsRequestInFlightRef = useRef(false)
  const detectionApiBase = env.VITE_OBJECT_DETECTION_API_URL.replace(/\/+$/, '')
  const apiEndpoint = (path) => `${detectionApiBase}${path}`
  const streamUrl = isRunning ? apiEndpoint('/video_feed') : ''
  const stopPaths = ['/stop', '/camera/stop', '/release']

  const toUserMessage = (fallback) =>
    window.location.protocol === 'https:' && detectionApiBase.startsWith('http://')
      ? 'Object detection API uses HTTP while this site is HTTPS. Set VITE_OBJECT_DETECTION_API_URL to an HTTPS endpoint.'
      : fallback

  const fetchStats = async () => {
    if (isStatsRequestInFlightRef.current) return
    isStatsRequestInFlightRef.current = true

    try {
      const res = await fetch(apiEndpoint('/stats'))
      if (res.ok) {
        const data = await res.json()
        setStats({
          fps: data.fps || 0,
          inference_ms: data.inference_ms || 0,
          total_objects: data.total_objects || 0,
          objects: data.objects || [],
        })
        setStatusMessage('')
      }
    } catch {
      setStatusMessage('Unable to reach object detection service. Check whether the backend is running and reachable.')
    } finally {
      isStatsRequestInFlightRef.current = false
    }
  }

  const startDetection = async () => {
    if (isStarting || isRunning) return
    setIsStarting(true)
    try {
      await fetch(apiEndpoint(`/profile?profile=${encodeURIComponent(profile)}`), {
        method: 'POST',
      })
      const res = await fetch(apiEndpoint('/start'), { method: 'POST' })
      if (!res.ok) throw new Error('Failed to start detection service.')
      setIsRunning(true)
      setStatusMessage('')
    } catch {
      setStatusMessage(toUserMessage('Failed to start detection. Make sure the object detection API is available.'))
    } finally {
      setIsStarting(false)
    }
  }

  const stopDetection = async () => {
    if (isStopping || !isRunning) return
    setIsStopping(true)
    try {
      const results = await Promise.allSettled(
        stopPaths.map((path) =>
          fetch(apiEndpoint(path), {
            method: 'POST',
            cache: 'no-store',
          })
        )
      )

      const hasSuccessfulStop = results.some(
        (result) => result.status === 'fulfilled' && result.value.ok
      )
      if (!hasSuccessfulStop) throw new Error('Failed to stop detection service.')

      setIsRunning(false)
      setStats({
        fps: 0,
        inference_ms: 0,
        total_objects: 0,
        objects: [],
      })
      setStatusMessage('')
    } catch {
      setStatusMessage(toUserMessage('Failed to stop detection.'))
    } finally {
      setIsStopping(false)
    }
  }

  const changeProfile = async (newProfile) => {
    setProfile(newProfile)
    try {
      const res = await fetch(apiEndpoint(`/profile?profile=${encodeURIComponent(newProfile)}`), {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to change profile.')
      setStatusMessage('')
    } catch {
      setStatusMessage(toUserMessage('Could not change detection mode.'))
    }
  }

  useEffect(() => {
    let isCancelled = false

    const pollStats = async () => {
      if (isCancelled) return
      await fetchStats()
      if (!isCancelled) {
        statsPollTimeoutRef.current = setTimeout(pollStats, isRunning ? 1200 : 2500)
      }
    }

    pollStats()

    return () => {
      isCancelled = true
      if (statsPollTimeoutRef.current) {
        clearTimeout(statsPollTimeoutRef.current)
      }
    }
  }, [isRunning])

  useEffect(() => {
    if (!isRunning && videoRef.current) {
      // Force-close the MJPEG stream so backend can release camera hardware.
      videoRef.current.src = ''
    }
  }, [isRunning])

  useEffect(() => {
    const stopOnLeave = () => {
      if (!isRunning) return
      try {
        navigator.sendBeacon(apiEndpoint('/stop'))
      } catch {
        // Ignore best-effort shutdown errors during unload.
      }
    }
    const stopOnHidden = () => {
      if (document.hidden) stopOnLeave()
    }

    window.addEventListener('beforeunload', stopOnLeave)
    document.addEventListener('visibilitychange', stopOnHidden)
    return () => {
      window.removeEventListener('beforeunload', stopOnLeave)
      document.removeEventListener('visibilitychange', stopOnHidden)
    }
  }, [isRunning])

  return (
    <div className="object-detection">
      <div className="od-panel">
        <div className="od-header">
          <h2>YOLOv8 Real-Time Detection</h2>
          <p className="od-subtitle">Live webcam feed with bounding boxes, labels, and confidence.</p>
        </div>

        <div className="od-controls">
          <button
            className="od-btn od-btn-primary"
            onClick={startDetection}
            disabled={isRunning || isStarting || isStopping}
          >
            {isStarting ? 'Starting...' : 'Start Detection'}
          </button>
          <button
            className="od-btn od-btn-danger"
            onClick={stopDetection}
            disabled={!isRunning || isStarting || isStopping}
          >
            {isStopping ? 'Stopping...' : 'Stop Detection'}
          </button>
          <label className="od-profile-label">Mode</label>
          <select
            className="od-profile-select"
            value={profile}
            onChange={(e) => changeProfile(e.target.value)}
            disabled={isStarting || isStopping}
          >
            {Object.entries(PROFILES).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        <div className="od-video-wrap">
          {isStarting ? (
            <div className="od-video-placeholder od-video-loading" role="status" aria-live="polite">
              <div className="od-loading-spinner" aria-hidden="true" />
              <p>Starting detection. Initializing camera and model...</p>
            </div>
          ) : isRunning ? (
            <img
              ref={videoRef}
              src={streamUrl}
              alt="Live detection stream"
            />
          ) : (
            <div className="od-video-placeholder">Camera is off. Click Start Detection.</div>
          )}
        </div>

        {statusMessage ? (
          <p className="od-subtitle" role="status" aria-live="polite">
            {statusMessage}
          </p>
        ) : null}

        <div className="od-stats">
          <div className="od-stat-card">
            <span className="od-stat-label">Status</span>
            <strong className="od-stat-value">{isRunning ? 'Running' : 'Paused'}</strong>
          </div>
          <div className="od-stat-card">
            <span className="od-stat-label">FPS</span>
            <strong className="od-stat-value">{stats.fps.toFixed(2)}</strong>
          </div>
          <div className="od-stat-card">
            <span className="od-stat-label">Inference</span>
            <strong className="od-stat-value">{stats.inference_ms.toFixed(2)} ms</strong>
          </div>
          <div className="od-stat-card">
            <span className="od-stat-label">Objects</span>
            <strong className="od-stat-value">{stats.total_objects}</strong>
          </div>
        </div>

        <h3>Detected Classes</h3>
        <ul className="od-object-list">
          {stats.objects.length === 0 ? (
            <li>No objects detected</li>
          ) : (
            stats.objects.map((item, i) => (
              <li key={i}>{item.label}: {item.count}</li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}