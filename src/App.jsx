import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Experience from './pages/Experience'
import Contact from './pages/Contact'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Nav />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  )
}
