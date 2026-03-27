import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { setIsCartOpen, setIsSearchOpen, cartItems } = useCart();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      backgroundColor: 'var(--primary)',
      zIndex: 100,
      borderBottom: '1px solid var(--gray-light)',
      padding: '24px 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flex: 1 }}>
          <button style={{ padding: '8px' }} aria-label="Menu">
            <Menu size={20} strokeWidth={1.5} />
          </button>
          
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="nav-links">
             <Link to="/collection" style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em' }}>Collection</Link>
             <Link to="/soaps" style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em' }}>Soaps</Link>
          </div>
        </div>
        
        <Link to="/" style={{ 
          fontSize: '1.5rem', 
          fontWeight: 400, 
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          textAlign: 'center',
          flex: 1
        }}>
          BEING WORTH
        </Link>
        
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
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

      <style>{`
        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
