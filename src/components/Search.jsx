import { useState, useEffect } from 'react';
import { Search as SearchIcon, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';
import { supabase } from '../config/supabaseClient';

const Search = () => {
  const { isSearchOpen, setIsSearchOpen } = useCart();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*');
      
    if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isSearchOpen && products.length === 0) {
      fetchProducts();
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = query === '' 
    ? [] 
    : products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) || 
        product.type.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div 
      className="fade-in"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className="container" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ width: '24px' }}></div>
          <h2 style={{ fontSize: '1rem', letterSpacing: '0.2em', fontWeight: 300 }}>SEARCH</h2>
          <button 
            onClick={() => setIsSearchOpen(false)}
            style={{ padding: '8px', cursor: 'pointer', background: 'none', border: 'none' }}
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          width: '100%',
          position: 'relative',
          marginBottom: '60px'
        }}>
          <input
            type="text"
            placeholder="Search fragrances..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 48px',
              fontSize: '1.2rem',
              border: 'none',
              borderBottom: '1px solid var(--gray-dark)',
              background: 'transparent',
              outline: 'none',
              fontFamily: 'inherit',
              fontWeight: 300,
              letterSpacing: '0.05em'
            }}
            autoFocus
          />
          <SearchIcon 
            size={20} 
            strokeWidth={1.5} 
            color="var(--gray-dark)"
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
          />
        </div>

        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%',
          overflowY: 'auto'
        }}>
           {loading ? (
             <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
               <Loader2 size={32} className="animate-spin" color="var(--gray-dark)" />
             </div>
           ) : query !== '' && filteredProducts.length === 0 ? (
             <p style={{ textAlign: 'center', color: 'var(--gray-dark)' }}>
               No results found for "{query}"
             </p>
           ) : (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '32px' }}>
                {filteredProducts.map(product => (
                  <div key={product.id}>
                    <ProductCard {...product} />
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Search;
