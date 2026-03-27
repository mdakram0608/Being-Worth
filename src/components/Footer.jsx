import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--primary)',
      borderTop: '1px solid var(--gray-light)',
      padding: '80px 24px 40px',
      marginTop: '80px'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        marginBottom: '60px'
      }}>
        <div style={{ paddingRight: '40px' }}>
          <h3 style={{ 
            fontSize: '1.2rem', 
            marginBottom: '24px', 
            letterSpacing: '0.2em',
            fontWeight: 400 
          }}>
            BEING WORTH
          </h3>
          <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem', lineHeight: 1.8 }}>
            A scent that speaks you. Premium luxury perfumes crafted for elegance and presence. Experience the art of fine fragrance.
          </p>
        </div>
        
        <div>
          <h4 style={{ fontSize: '0.85rem', marginBottom: '24px', letterSpacing: '0.1em' }}>SHOP</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li>
              <Link to="/collection" style={{ color: 'var(--gray-dark)', fontSize: '0.9rem' }}>All Perfumes</Link>
            </li>
            <li>
              <Link to="/soaps" style={{ color: 'var(--gray-dark)', fontSize: '0.9rem' }}>Soaps (Coming Soon)</Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 style={{ fontSize: '0.85rem', marginBottom: '24px', letterSpacing: '0.1em' }}>SUPPORT</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li><a href="#" style={{ color: 'var(--gray-dark)', fontSize: '0.9rem' }}>Contact Us</a></li>
            <li><Link to="/terms" style={{ color: 'var(--gray-dark)', fontSize: '0.9rem' }}>Terms & Conditions</Link></li>
            <li><a href="#" style={{ color: 'var(--gray-dark)', fontSize: '0.9rem' }}>FAQ</a></li>
          </ul>
        </div>
      </div>
      
      <div className="container" style={{
        borderTop: '1px solid var(--gray-light)',
        paddingTop: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <p style={{ color: 'var(--gray-dark)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
          &copy; {new Date().getFullYear()} BEING WORTH. ALL RIGHTS RESERVED.
        </p>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="https://www.instagram.com/beingworth.official" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gray-dark)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Instagram</a>
          <a href="https://www.facebook.com/share/18dve85ie7/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gray-dark)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Facebook</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
