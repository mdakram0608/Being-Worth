import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'var(--primary)',
      borderBottom: '1px solid var(--gray-light)'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px',
        alignItems: 'center',
        padding: '0 24px',
        width: '100%'
      }}>
        <div className="fade-in" style={{ zIndex: 2 }}>
          <p style={{
            fontSize: '0.85rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--gray-dark)',
            marginBottom: '16px'
          }}>
            New Arrival
          </p>
          <h1 style={{
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            marginBottom: '24px',
            letterSpacing: '0.05em'
          }}>
            BEING WORTH
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--gray-dark)',
            marginBottom: '40px',
            maxWidth: '400px',
            fontWeight: 300,
            lineHeight: 1.8
          }}>
            A scent that speaks you. Discover the essence of premium luxury crafted for elegance and presence.
          </p>
          <Link to="/collection" className="luxury-btn">
            Discover Collection
          </Link>
        </div>
        
        <div className="fade-in" style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          minHeight: '60vh',
          backgroundColor: 'var(--gray-light)'
        }}>
          <img 
            src="/bottle.png" 
            alt="Being Worth Eau de Parfum" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800";
            }}
            style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '80%',
              maxHeight: '70vh',
              objectFit: 'contain',
              mixBlendMode: 'multiply'
            }} 
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
