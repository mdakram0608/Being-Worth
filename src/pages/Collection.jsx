import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { supabase } from '../config/supabaseClient';
import { Loader2 } from 'lucide-react';

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <div className="fade-in">
      <section style={{
        padding: '120px 24px 60px',
        textAlign: 'center',
        backgroundColor: 'var(--gray-light)',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div className="container">
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 300,
            letterSpacing: '0.15em',
            marginBottom: '24px'
          }}>
            THE COLLECTION
          </h1>
          <p style={{
            color: 'var(--gray-dark)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.8,
            fontWeight: 300
          }}>
            Discover our full range of masterfully blended fragrances. Each scent is a unique statement, crafted for those who define their own worth.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            borderBottom: '1px solid var(--gray-light)',
            paddingBottom: '16px'
          }}>
            <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem' }}>Showing {products.length} products</p>
            <div style={{ display: 'flex', gap: '24px' }}>
              <select style={{
                border: 'none',
                background: 'transparent',
                fontSize: '0.9rem',
                color: 'var(--secondary)',
                fontFamily: 'inherit',
                outline: 'none',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '60px 32px'
          }}>
            {loading ? (
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', padding: '60px' }}>
                <Loader2 size={32} className="animate-spin" color="var(--gray-dark)" />
              </div>
            ) : products.length === 0 ? (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--gray-dark)' }}>No products in the collection yet.</p>
            ) : (
              products.map(product => (
                <ProductCard key={product.id} {...product} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Collection;
