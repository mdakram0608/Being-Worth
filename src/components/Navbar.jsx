import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { setIsCartOpen, setIsSearchOpen, cartItems } = useCart();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);

  const linkStyle = { textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em' };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      backgroundColor: 'var(--primary)',
      zIndex: 100,
      borderBottom: '1px solid var(--gray-light)',
      padding: '20px 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flex: 1 }}>
          {/* Hamburger — mobile only */}
          <button
            className="nav-menu-btn"
            style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>

          {/* Inline links — desktop only */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="nav-links">
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/collection" style={linkStyle}>Collection</Link>
            <Link to="/soaps" style={linkStyle}>Soaps</Link>
          </div>
        </div>

        <Link to="/" className="nav-brand" style={{
          fontSize: '1.5rem',
          fontWeight: 400,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          textAlign: 'center',
          flex: 1,
          whiteSpace: 'nowrap',
        }}>
          BEING WORTH
        </Link>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
          <button
            style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Search"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={20} strokeWidth={1.5} />
          </button>
          <button
            style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}
            aria-label="Shopping Bag"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartItemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '0',
                right: '0',
                backgroundColor: 'var(--secondary)',
                color: 'var(--primary)',
                fontSize: '0.65rem',
                minWidth: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                transform: 'translate(25%, -25%)'
              }}>
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="nav-mobile-menu" style={{
          borderTop: '1px solid var(--gray-light)',
          padding: '8px 24px 12px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            style={{ ...linkStyle, padding: '14px 0', borderBottom: '1px solid var(--gray-light)' }}
          >
            Home
          </Link>
          <Link
            to="/collection"
            onClick={() => setMenuOpen(false)}
            style={{ ...linkStyle, padding: '14px 0', borderBottom: '1px solid var(--gray-light)' }}
          >
            Collection
          </Link>
          <Link
            to="/soaps"
            onClick={() => setMenuOpen(false)}
            style={{ ...linkStyle, padding: '14px 0' }}
          >
            Soaps
          </Link>
        </div>
      )}

      <style>{`
        /* Hamburger hidden on desktop, shown on mobile */
        .nav-menu-btn { display: none; }
        .nav-mobile-menu { display: none; }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-menu-btn { display: inline-flex !important; }
          .nav-mobile-menu { display: flex !important; }
          .nav-brand {
            font-size: 1.1rem !important;
            letter-spacing: 0.12em !important;
          }
        }
        @media (max-width: 360px) {
          .nav-brand { font-size: 0.95rem !important; letter-spacing: 0.08em !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
