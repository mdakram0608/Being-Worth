import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { supabase } from '../config/supabaseClient';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .limit(4)
        .order('created_at', { ascending: false });
        
      if (data) {
        setFeatured(data);
      }
      setLoading(false);
    };

    fetchFeatured();
  }, []);

  return (
    <div className="fade-in">
      <Hero />
      
      <section className="section-padding">
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '60px'
          }}>
            <div>
              <p style={{
                fontSize: '0.85rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--gray-dark)',
                marginBottom: '8px'
              }}>
                Curated Selection
              </p>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 300,
                letterSpacing: '0.1em'
              }}>
                FEATURED SCENTS
              </h2>
            </div>
            <a href="/collection" style={{
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'underline',
              textUnderlineOffset: '4px'
            }}>
              View All
            </a>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            {loading ? (
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <Loader2 size={32} className="animate-spin" color="var(--gray-dark)" />
              </div>
            ) : featured.length === 0 ? (
              <p style={{ gridColumn: '1 / -1', color: 'var(--gray-dark)' }}>No products found yet.</p>
            ) : (
              featured.map(product => (
                <ProductCard key={product.id} {...product} />
              ))
            )}
          </div>
        </div>
      </section>

      <section style={{
        backgroundColor: 'var(--secondary)',
        color: 'var(--primary)',
        padding: '120px 24px',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 300,
            letterSpacing: '0.1em',
            marginBottom: '32px'
          }}>
            THE ART OF PRESENCE
          </h2>
          <p style={{
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: 'var(--gray-light)',
            marginBottom: '40px',
            fontWeight: 300
          }}>
            Every creation at Being Worth is an orchestration of the finest ingredients, designed not just to be worn, but to be experienced. We believe in scent as an extension of your persona—minimalistic, profound, and unmistakably elegant.
          </p>
          <a href="/collection" className="luxury-btn-outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
            Explore Our Philosophy
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
