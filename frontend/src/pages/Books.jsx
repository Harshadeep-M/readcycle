
import { useEffect, useState } from 'react'
import BookCard from '../components/BookCard'

function Books() {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)

  const [sortBy, setSortBy] = useState('id')
  const [direction, setDirection] = useState('asc')

  const fetchBooks = (
      pageNumber = 0,
      searchTerm = '',
      sortField = sortBy,
      sortDirection = direction
  ) => {
    setLoading(true)

    let url

    if (searchTerm.trim() === '') {
      url =
          `https://readcycle-backend-wgl6.onrender.com/books` +
          `?page=${pageNumber}` +
          `&size=5` +
          `&sortBy=${sortField}` +
          `&direction=${sortDirection}`
    } else {
      url =
          `https://readcycle-backend-wgl6.onrender.com/books/search` +
          `?title=${encodeURIComponent(searchTerm)}` +
          `&page=${pageNumber}` +
          `&size=5` +
          `&sortBy=${sortField}` +
          `&direction=${sortDirection}`
    }

    fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch books')
          }
          return response.json()
        })
        .then(data => {
          setBooks(data.content)
          setPage(data.currentPage)
          setTotalPages(data.totalPages)
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching books:', error)
          setLoading(false)
        })
  }

  const searchBooks = () => {
    setPage(0)
    fetchBooks(0, search, sortBy, direction)
  }

  const handleSortChange = event => {
    const newSortBy = event.target.value

    setSortBy(newSortBy)
    setPage(0)

    fetchBooks(0, search, newSortBy, direction)
  }

  const handleDirectionChange = event => {
    const newDirection = event.target.value

    setDirection(newDirection)
    setPage(0)

    fetchBooks(0, search, sortBy, newDirection)
  }

  const goToNextPage = () => {
    if (page < totalPages - 1) {
      fetchBooks(page + 1, search, sortBy, direction)
    }
  }

  const goToPreviousPage = () => {
    if (page > 0) {
      fetchBooks(page - 1, search, sortBy, direction)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  return (
      <div className="books-page">
        <div className="books-header">
          <p>BROWSE</p>
          <h1>Browse Books</h1>
          <p>Find your next great read.</p>
        </div>

        <div className="books-search">
          <input
              type="text"
              placeholder="Search by book title..."
              value={search}
              onChange={event => setSearch(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  searchBooks()
                }
              }}
          />

          <button onClick={searchBooks}>
            Search
          </button>
        </div>

        <div className="sorting">
          <label htmlFor="sortBy">Sort by:</label>

          <select
              id="sortBy"
              value={sortBy}
              onChange={handleSortChange}
          >
            <option value="id">ID</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>

          <select
              value={direction}
              onChange={handleDirectionChange}
          >
            <option value="asc">A → Z / Ascending</option>
            <option value="desc">Z → A / Descending</option>
          </select>
        </div>

        {loading ? (
            <p className="loading">Loading books...</p>
        ) : books.length === 0 ? (
            <p className="no-results">No books found.</p>
        ) : (
            <>
              <div className="books-grid">
                {books.map(book => (
                    <BookCard
                        key={book.id}
                        id={book.id}
                        title={book.title}
                        author={book.author}
                    />
                ))}
              </div>

              {totalPages > 1 && (
                  <div className="pagination">
                    <button
                        onClick={goToPreviousPage}
                        disabled={page === 0}
                    >
                      ← Previous
                    </button>

                    <span>
                Page {page + 1} of {totalPages}
              </span>

                    <button
                        onClick={goToNextPage}
                        disabled={page === totalPages - 1}
                    >
                      Next →
                    </button>
                  </div>
              )}
            </>
        )}
      </div>
  )
}

export default Books
