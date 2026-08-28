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
          
          <div className="product-grid" style={{
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

      {/* OUR STORY */}
      <section style={{ padding: '120px 24px', borderTop: '1px solid var(--gray-light)' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.6fr)',
            gap: '80px',
            alignItems: 'start',
          }} className="story-grid">

            {/* Left — decorative label + big heading */}
            <div style={{ position: 'sticky', top: '120px' }}>
              <p style={{
                fontSize: '0.75rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--gray-dark)',
                marginBottom: '20px',
              }}>
                Our Story
              </p>
              <h2 style={{
                fontSize: 'clamp(2.8rem, 6vw, 5rem)',
                fontWeight: 300,
                letterSpacing: '0.05em',
                lineHeight: 1.05,
                color: 'var(--secondary)',
              }}>
                BEING<br />WORTH
              </h2>
              <div style={{
                width: '40px',
                height: '1px',
                backgroundColor: 'var(--secondary)',
                marginTop: '32px',
              }} />
            </div>

            {/* Right — story text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <p style={{
                fontSize: '1.25rem',
                fontWeight: 300,
                lineHeight: 1.75,
                letterSpacing: '0.01em',
                color: 'var(--secondary)',
              }}>
                BEING WORTH began with a question —<br />
                <em>Why should luxury feel out of reach?</em>
              </p>

              <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 1.9, color: '#444' }}>
                As someone who always valued presentation, confidence, and identity, I saw a gap.
                Fragrances that felt premium were either too expensive, or lacked soul.
              </p>

              <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 1.9, color: '#444' }}>
                So I built something different. A brand where every bottle represents confidence.
                A brand that allows you to experience luxury without compromise.
              </p>

              <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 1.9, color: '#444' }}>
                Starting small, focusing on quality, and building with intention — BEING WORTH is more than a business.
                It's a mindset.
              </p>

              {/* Pull quote */}
              <blockquote style={{
                borderLeft: '2px solid var(--secondary)',
                paddingLeft: '24px',
                margin: '12px 0',
              }}>
                <p style={{
                  fontSize: '1.05rem',
                  fontWeight: 300,
                  lineHeight: 1.8,
                  fontStyle: 'italic',
                  color: 'var(--secondary)',
                }}>
                  "Because in the end, it's not just about how you smell.<br />
                  It's about how you show up in the world."
                </p>
              </blockquote>

              <p style={{
                fontSize: '1rem',
                fontWeight: 400,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--secondary)',
              }}>
                And that… is BEING WORTH.
              </p>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 700px) {
            .story-grid {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }
            .story-grid > div:first-child {
              position: static !important;
            }
          }
        `}</style>
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
