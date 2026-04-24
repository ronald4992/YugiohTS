import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router';
import './App.css';
import Home from './Home';
import Favorito from './Favorito';
import Original from './Original';
import Informativa from './Informativa';
import Usuario from './Usuario';

const navLinks = [
  { to: '/',           label: 'Home' },
  { to: '/favorito',   label: 'Favoritos' },
  { to: '/original',   label: 'Original' },
  { to: '/informativa', label: 'Informativa' },
  { to: '/usuario',    label: 'Usuarios' },
];

function NavBar() {
  const location = useLocation();

  return (
    <nav className="c-menu">
      {navLinks.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          className={location.pathname === to ? 'active' : ''}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

function App() {
  return (
    <Router>
      <NavBar />
      <main className="c-contenido">
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/home"        element={<Home />} />
          <Route path="/favorito"    element={<Favorito />} />
          <Route path="/original"    element={<Original />} />
          <Route path="/informativa" element={<Informativa />} />
          <Route path="/usuario"     element={<Usuario />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;