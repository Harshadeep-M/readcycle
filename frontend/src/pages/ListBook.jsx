import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { apiFetch } from '../api/api'

function ListBook() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [available, setAvailable] = useState(true)

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()

    if (!localStorage.getItem('token')) {
      setMessage('Please login to list a book.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const book = await apiFetch('/books', {
        method: 'POST',
        body: JSON.stringify({
          title,
          author,
          description,
          available
        })
      })

      setMessage('Book listed successfully!')

      setTitle('')
      setAuthor('')
      setDescription('')
      setAvailable(true)

      setTimeout(() => {
        navigate(`/books/${book.id}`)
      }, 800)
    } catch (error) {
      console.error('Error listing book:', error)
      setMessage('Could not list the book.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />

      <div className="list-book-page">
        <div className="books-header">
          <p>READCYCLE</p>
          <h1>List a Book</h1>
          <p>
            Give your book a new home by listing it on ReadCycle.
          </p>
        </div>

        <div className="list-book-card">
          <form onSubmit={handleSubmit}>

            <label>
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder="Enter book title"
              required
            />

            <label>
              Author
            </label>

            <input
              type="text"
              value={author}
              onChange={event => setAuthor(event.target.value)}
              placeholder="Enter author name"
              required
            />

            <label>
              Description
            </label>

            <textarea
              value={description}
              onChange={event =>
                setDescription(event.target.value)
              }
              placeholder="Describe the book"
              rows="5"
              required
            />

            <label className="availability-label">
              <input
                type="checkbox"
                checked={available}
                onChange={event =>
                  setAvailable(event.target.checked)
                }
              />

              Available for exchange
            </label>

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Listing...' : 'List Book'}
            </button>

          </form>

          {message && (
            <p className="list-book-message">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ListBook