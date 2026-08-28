import { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { supabase } from '../config/supabaseClient';
import { Loader2 } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Sort by: Featured'      },
  { value: 'price_asc',  label: 'Price: Low to High'     },
  { value: 'price_desc', label: 'Price: High to Low'     },
  { value: 'name_asc',   label: 'Name: A → Z'            },
  { value: 'name_desc',  label: 'Name: Z → A'            },
];

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Use the smallest available size price as the sort key (entry-level price per product)
  const getPrice = (p) =>
    Number(p.price_8ml || p.price_20ml || p.price_50ml || p.price_100ml || p.price || 0);

  // Sort products client-side based on selection
  const sorted = useMemo(() => {
    const list = [...products];
    switch (sortBy) {
      case 'price_asc':
        return list.sort((a, b) => getPrice(a) - getPrice(b));
      case 'price_desc':
        return list.sort((a, b) => getPrice(b) - getPrice(a));
      case 'name_asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return list.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return list;
    }
  }, [products, sortBy]);

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
          {/* Toolbar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            borderBottom: '1px solid var(--gray-light)',
            paddingBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <p style={{ color: 'var(--gray-dark)', fontSize: '0.9rem' }}>
              Showing {sorted.length} product{sorted.length !== 1 ? 's' : ''}
            </p>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                border: '1px solid var(--gray-light)',
                background: 'var(--primary)',
                fontSize: '0.85rem',
                color: 'var(--secondary)',
                fontFamily: 'inherit',
                outline: 'none',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                padding: '8px 14px',
                appearance: 'none',
                WebkitAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                paddingRight: '32px',
              }}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Grid */}
          <div className="product-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '60px 32px'
          }}>
            {loading ? (
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', padding: '60px' }}>
                <Loader2 size={32} className="animate-spin" color="var(--gray-dark)" />
              </div>
            ) : sorted.length === 0 ? (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--gray-dark)' }}>No products in the collection yet.</p>
            ) : (
              sorted.map(product => (
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
