import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-label">BOOKS • PEOPLE • EXCHANGE</p>

        <h1>
          Give books a new
          <span> chapter.</span>
        </h1>

        <p className="hero-text">
          Buy, sell, and exchange books with people who love reading.
        </p>

        <div className="hero-buttons">
          <Link to="/books">
            <button>Browse Books</button>
          </Link>

          <Link to="/list-book">
            <button className="secondary-button">
              List a Book
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero