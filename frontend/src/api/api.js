const API_URL = 'http://localhost:8080'

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  })

  const contentType = response.headers.get('content-type')

  if (!response.ok) {
    let errorMessage = `Request failed: ${response.status}`

    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json()
      errorMessage = errorData.message || errorMessage
    } else {
      const errorText = await response.text()
      if (errorText) {
        errorMessage = errorText
      }
    }

    throw new Error(errorMessage)
  }

  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}