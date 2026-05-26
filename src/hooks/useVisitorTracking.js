import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { getSupabase } from '../lib/supabaseClient'

const HEARTBEAT_MS = 30_000

function getSessionId() {
  let id = sessionStorage.getItem('vf_session_id')
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)
    sessionStorage.setItem('vf_session_id', id)
  }
  return id
}

async function sendHeartbeat(path) {
  try {
    const supabase = getSupabase()
    await supabase.from('visitor_sessions').upsert(
      {
        session_id: getSessionId(),
        page_path: path || window.location.pathname,
        user_agent: navigator.userAgent.slice(0, 300),
        referrer: document.referrer?.slice(0, 500) || null,
        last_active_at: new Date().toISOString(),
      },
      { onConflict: 'session_id' }
    )
  } catch {
    /* offline or not configured — silently ignore */
  }
}

export function useVisitorTracking() {
  const location = useLocation()
  const intervalRef = useRef(null)
  const pathRef = useRef(location.pathname)

  useEffect(() => {
    pathRef.current = location.pathname
    sendHeartbeat(location.pathname)

    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        sendHeartbeat(pathRef.current)
      }, HEARTBEAT_MS)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [location.pathname])

  useEffect(() => {
    const send = () => sendHeartbeat(pathRef.current)
    window.addEventListener('beforeunload', send)
    return () => window.removeEventListener('beforeunload', send)
  }, [])
}
