import { Link } from 'react-router-dom';

const Candles = () => {
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
          CANDLES
        </h1>
        <p style={{
          color: 'var(--gray-dark)',
          lineHeight: 1.8,
          marginBottom: '48px',
          fontWeight: 300
        }}>
          We are preparing to illuminate your space with the signature essences of Being Worth. The ultimate home fragrance collection is currently in curation.
        </p>
        <Link to="/collection" className="luxury-btn">
          Explore Perfumes
        </Link>
      </div>
    </div>
  );
};

export default Candles;
