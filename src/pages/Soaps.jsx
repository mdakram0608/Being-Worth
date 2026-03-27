import { Link } from 'react-router-dom';

const Soaps = () => {
  return (
    <div className="fade-in" style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '600px' }}>
        <p style={{
          fontSize: '0.85rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--gray-dark)',
          marginBottom: '24px'
        }}>
          Coming Soon
        </p>
        <h1 style={{
          fontSize: 'clamp(3rem, 6vw, 4rem)',
          fontWeight: 300,
          letterSpacing: '0.15em',
          marginBottom: '32px'
        }}>
          SOAPS
        </h1>
        <p style={{
          color: 'var(--gray-dark)',
          lineHeight: 1.8,
          marginBottom: '48px',
          fontWeight: 300
        }}>
          A luxurious soap collection is in the making — crafted with the same signature elegance as every Being Worth creation. Stay tuned.
        </p>
        <Link to="/collection" className="luxury-btn">
          Explore Perfumes
        </Link>
      </div>
    </div>
  );
};

export default Soaps;
