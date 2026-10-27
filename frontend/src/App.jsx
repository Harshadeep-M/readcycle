import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import './App.css'
import Books from './pages/Books'
import BookDetails from './pages/BookDetails'
import Login from './pages/Login'
import Wishlist from './pages/Wishlist'
import ExchangeRequests from './pages/ExchangeRequests'
import ListBook from './pages/ListBook'
import Signup from './pages/Signup'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/exchange" element={<ExchangeRequests />} />
        <Route path="/list-book" element={<ListBook />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App