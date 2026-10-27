
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch } from '../api/api'

function Signup() {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSignup = async event => {
        event.preventDefault()
        setMessage('')
        setLoading(true)

        try {
            await apiFetch('/users', {
                method: 'POST',
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    password
                })
            })

            setMessage('Account created successfully! Redirecting to login...')

            setTimeout(() => {
                navigate('/login')
            }, 1200)
        } catch (error) {
            console.error('Signup error:', error)
            setMessage(error.message || 'Could not create your account.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <p className="login-label">JOIN READCYCLE</p>

                <h1>Sign Up</h1>

                <p className="login-description">
                    Create an account to start exchanging books.
                </p>

                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label htmlFor="signup-name">Name</label>
                        <input
                            id="signup-name"
                            type="text"
                            value={name}
                            onChange={event => setName(event.target.value)}
                            placeholder="Enter your name"
                            maxLength={100}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="signup-email">Email</label>
                        <input
                            id="signup-email"
                            type="email"
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="signup-password">Password</label>
                        <input
                            id="signup-password"
                            type="password"
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                            placeholder="At least 6 characters"
                            minLength={6}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                {message && (
                    <p className="login-message" role="status">
                        {message}
                    </p>
                )}

                <p className="login-description">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Signup
