import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch } from '../api/api'

function BookDetails() {
  const { id } = useParams()

  const [book, setBook] = useState(null)

  const [isWishlisted, setIsWishlisted] = useState(false)
  const [wishlistId, setWishlistId] = useState(null)
  const [wishlistMessage, setWishlistMessage] = useState('')

  const [exchangeMessage, setExchangeMessage] = useState('')
  const [exchangeLoading, setExchangeLoading] = useState(false)
  const [exchangeRequestId, setExchangeRequestId] = useState(null)

  useEffect(() => {
    fetch(`https://readcycle-backend-wgl6.onrender.com/books/${id}`)
      .then(response => response.json())
      .then(data => {
        setBook(data)
      })
      .catch(error => {
        console.error('Error fetching book:', error)
      })
  }, [id])

  useEffect(() => {
    const userId = localStorage.getItem('userId')

    if (!userId) {
      return
    }

    const checkWishlist = async () => {
      try {
        const data = await apiFetch(`/wishlist/${userId}`)

        const wishlistItem = data.find(
          item => item.bookId === Number(id)
        )

        if (wishlistItem) {
          setIsWishlisted(true)
          setWishlistId(wishlistItem.id)
        }
      } catch (error) {
        console.error('Error checking wishlist:', error)
      }
    }

    checkWishlist()
  }, [id])

  useEffect(() => {
    const userId = localStorage.getItem('userId')

    if (!userId) {
      return
    }

    const checkExchangeRequest = async () => {
      try {
        const data = await apiFetch('/exchange')

        const pendingRequest = data.find(
          request =>
            request.requesterId === Number(userId) &&
            request.bookId === Number(id) &&
            request.status === 'PENDING'
        )

        if (pendingRequest) {
          setExchangeRequestId(pendingRequest.id)
        }
      } catch (error) {
        console.error(
          'Error checking exchange request:',
          error
        )
      }
    }

    checkExchangeRequest()
  }, [id])

  const handleWishlist = async () => {
    const userId = localStorage.getItem('userId')

    if (!userId) {
      setWishlistMessage('Please login to use your wishlist.')
      return
    }

    try {
      if (isWishlisted) {
        await apiFetch(`/wishlist/${wishlistId}`, {
          method: 'DELETE'
        })

        setIsWishlisted(false)
        setWishlistId(null)
        setWishlistMessage('Removed from wishlist.')
      } else {
        const data = await apiFetch('/wishlist', {
          method: 'POST',
          body: JSON.stringify({
            bookId: Number(id)
          })
        })

        setIsWishlisted(true)
        setWishlistId(data.id)
        setWishlistMessage('Added to wishlist.')
      }
    } catch (error) {
      console.error('Wishlist error:', error)
      setWishlistMessage('Something went wrong.')
    }
  }

  const handleExchangeRequest = async () => {
    const userId = localStorage.getItem('userId')

    if (!userId) {
      setExchangeMessage('Please login to request an exchange.')
      return
    }

    setExchangeLoading(true)
    setExchangeMessage('')

    try {
      if (exchangeRequestId) {
        await apiFetch(`/exchange/${exchangeRequestId}`, {
          method: 'DELETE'
        })

        setExchangeRequestId(null)
        setExchangeMessage('Exchange request cancelled.')
      } else {
        const data = await apiFetch('/exchange', {
          method: 'POST',
          body: JSON.stringify({
            requesterId: Number(userId),
            bookId: Number(id)
          })
        })

        setExchangeRequestId(data.id)
        setExchangeMessage(
          'Exchange request sent successfully.'
        )
      }
    }  catch (error) {
        console.error(
          'Exchange request error:',
          error
        )
        setExchangeMessage(error.message)
      }

    }


  if (!book) {
    return <p className="loading">Loading...</p>
  }

  return (
    <div className="book-details-page">

      <Link to="/books" className="back-link">
        ← Back to Books
      </Link>

      <div className="book-details-card">

        <div className="details-cover">
          <span>BOOK</span>
        </div>

        <div className="details-info">

          <p className="details-label">
            BOOK DETAILS
          </p>

          <h1>{book.title}</h1>

          <h2>by {book.author}</h2>

          <p className="details-description">
            {book.description}
          </p>

          <div className="book-status">
            <span
              className={
                book.available
                  ? 'status available'
                  : 'status unavailable'
              }
            >
              {book.available
                ? 'Available'
                : 'Not Available'}
            </span>
          </div>

          <p className="owner-info">
            Owner ID: {book.ownerId}
          </p>

          <div className="details-actions">

            <button
              className="exchange-button"
              onClick={handleWishlist}
            >
              {isWishlisted
                ? 'Remove from Wishlist'
                : 'Add to Wishlist'}
            </button>

            <button
              className="exchange-button"
              onClick={handleExchangeRequest}
              disabled={exchangeLoading}
            >
              {exchangeLoading
                ? 'Processing...'
                : exchangeRequestId
                  ? 'Cancel Exchange Request'
                  : 'Request Exchange'}
            </button>

          </div>

          {wishlistMessage && (
            <p className="wishlist-message">
              {wishlistMessage}
            </p>
          )}

          {exchangeMessage && (
            <p className="exchange-message">
              {exchangeMessage}
            </p>
          )}

        </div>

      </div>

    </div>
  )
}

export default BookDetails