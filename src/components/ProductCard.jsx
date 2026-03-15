import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ 
  id = 1, 
  name = "BEING WORTH", 
  type = "Eau de Parfum", 
  price = 4500,
  formattedPrice = "4,500.00",
  image = "/bottle.png" 
}) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent link navigation
    addToCart({ id, name, type, price, formattedPrice, image });
  };

  return (
    <Link to={`/collection`} style={{ display: 'block' }} className="product-card">
      <div style={{
        position: 'relative',
        backgroundColor: 'var(--gray-light)',
        padding: '10%',
        marginBottom: '24px',
        aspectRatio: '3/4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <img 
          src={image} 
          alt={name} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800";
          }}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            transition: 'transform 0.5s ease',
            mixBlendMode: 'multiply'
          }}
          className="product-image"
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '24px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          display: 'flex',
          justifyContent: 'center'
        }} className="quick-add">
           <button 
             onClick={handleAddToCart}
             style={{
               backgroundColor: 'var(--primary)',
               color: 'var(--secondary)',
               padding: '12px 24px',
               width: '100%',
               textTransform: 'uppercase',
               letterSpacing: '0.1em',
               fontSize: '0.8rem',
               border: 'none',
               cursor: 'pointer'
             }}
           >
             Add to Cart
           </button>
        </div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <p style={{ 
          fontSize: '0.75rem', 
          color: 'var(--gray-dark)', 
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '8px'
        }}>
          {type}
        </p>
        <h3 style={{ 
          fontSize: '1.2rem', 
          fontWeight: 300, 
          letterSpacing: '0.1em',
          marginBottom: '8px'
        }}>
          {name}
        </h3>
        <p style={{ 
          fontSize: '1rem', 
          color: 'var(--secondary)',
          fontWeight: 300
        }}>
          ₹ {formattedPrice}
        </p>
      </div>

      <style>{`
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        .product-card:hover .quick-add {
          opacity: 1 !important;
        }
      `}</style>
    </Link>
  );
};

export default ProductCard;
