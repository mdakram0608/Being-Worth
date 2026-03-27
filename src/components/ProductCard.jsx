import { useState } from 'react';
import ProductModal from './ProductModal';

const ProductCard = ({ 
  id = 1, 
  name = "BEING WORTH", 
  type = "Eau de Parfum", 
  image = "/bottle.png",
  sizes = [],
  // Legacy flat fields still accepted so Supabase rows without sizes still render
  price,
  formattedPrice,
  ...rest
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Build sizes the same way as ProductModal — works for both static JS and Supabase data
  const derivedSizes = sizes?.length > 0
    ? sizes
    : [8, 20, 50, 100]
        .map(ml => {
          const p = rest[`price_${ml}ml`];
          if (!p) return null;
          const img = rest[`image_${ml}ml`] || image;
          return { ml, price: p, image: img };
        })
        .filter(Boolean)
        .concat(
          !rest.price_8ml && !rest.price_20ml && !rest.price_50ml
            ? [{ ml: 50, price: price ?? 0, image }]
            : []
        );

  // Build a product object regardless of source shape
  const product = {
    id,
    name,
    type,
    image,
    sizes: derivedSizes,
    ...rest,
  };

  const displayPrice = derivedSizes.length > 1
    ? `From ₹ ${new Intl.NumberFormat('en-IN').format(derivedSizes[0].price)}`
    : `₹ ${formattedPrice || new Intl.NumberFormat('en-IN').format(price ?? 0)}`;

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setModalOpen(true)}
        onKeyDown={e => e.key === 'Enter' && setModalOpen(true)}
        style={{ display: 'block', cursor: 'pointer' }}
        className="product-card"
      >
        <div style={{
          position: 'relative',
          backgroundColor: 'var(--gray-light)',
          padding: '10%',
          marginBottom: '24px',
          aspectRatio: '3/4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
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
              mixBlendMode: 'multiply',
            }}
            className="product-image"
          />
          {/* Hover overlay */}
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
            justifyContent: 'center',
          }} className="quick-add">
            <div style={{
              backgroundColor: 'var(--secondary)',
              color: 'var(--primary)',
              padding: '12px 24px',
              width: '100%',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontSize: '0.78rem',
              textAlign: 'center',
            }}>
              View Details
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <p style={{ 
            fontSize: '0.75rem', 
            color: 'var(--gray-dark)', 
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '8px',
          }}>
            {type}
          </p>
          <h3 style={{ 
            fontSize: '1.2rem', 
            fontWeight: 300, 
            letterSpacing: '0.1em',
            marginBottom: '8px',
          }}>
            {name}
          </h3>
          <p style={{ 
            fontSize: '0.9rem', 
            color: 'var(--secondary)',
            fontWeight: 300,
          }}>
            {displayPrice}
          </p>

          {/* Size pills */}
          {sizes?.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '10px' }}>
              {sizes.map(s => (
                <span key={s.ml} style={{
                  fontSize: '0.62rem',
                  letterSpacing: '0.08em',
                  border: '1px solid var(--gray-light)',
                  padding: '2px 8px',
                  color: 'var(--gray-dark)',
                }}>
                  {s.ml}ml
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <ProductModal
          product={product}
          onClose={() => setModalOpen(false)}
        />
      )}

      <style>{`
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        .product-card:hover .quick-add {
          opacity: 1 !important;
        }
      `}</style>
    </>
  );
};

export default ProductCard;
