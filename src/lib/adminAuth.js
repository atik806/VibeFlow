const AUTH_KEY = 'admin_authenticated'
const TOKEN_KEY = 'admin_token'

export function isAdminAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === 'true'
}

export function setAdminAuthenticated(value, token) {
  if (value) {
    sessionStorage.setItem(AUTH_KEY, 'true')
    if (token) sessionStorage.setItem(TOKEN_KEY, token)
  } else {
    sessionStorage.removeItem(AUTH_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
  }
}

export function getAdminToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}
