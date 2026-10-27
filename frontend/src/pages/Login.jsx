import { useState } from 'react'
import { Link } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    setMessage('')

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

   const data = await response.json()

   console.log('LOGIN RESPONSE:', data)

   localStorage.setItem('token', data.token)
   localStorage.setItem('userId', data.userId)

   console.log('TOKEN:', localStorage.getItem('token'))
   console.log('USER ID:', localStorage.getItem('userId'))

   setMessage('Login successful!')
    } catch (error) {
      console.error('Login error:', error)
      setMessage('Invalid email or password.')
    }
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <p className="login-label">WELCOME BACK</p>

        <h1>Login</h1>

        <p className="login-description">
          Sign in to continue to ReadCycle.
        </p>

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

        </form>

        {message && (
          <p className="login-message">
            {message}
          </p>

        )}

        <p className="login-description">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>

      </div>

    </div>
  )
}

export default Login