import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FALLBACK = "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800";

const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [selectedIndex, setSelectedIndex] = useState(1); // adjusted below after sizes resolve
  const [imgSrc, setImgSrc] = useState('');
  const [added, setAdded] = useState(false);
  const [imgScale, setImgScale] = useState(false);

  const sizes = product?.sizes?.length > 0
    ? product.sizes
    // Build from flat Supabase columns (price_8ml / price_20ml / price_50ml / image_Xml)
    : [8, 20, 50, 100]
        .map(ml => {
          const p = product[`price_${ml}ml`];
          if (!p) return null;
          // Use size-specific image if available, fall back to main product image
          const img = product[`image_${ml}ml`] || product.image;
          return { ml, price: p, image: img };
        })
        .filter(Boolean)
        // Last-resort: if no size columns exist, use the single price as 50ml
        .concat(
          !product?.price_8ml && !product?.price_20ml && !product?.price_50ml
            ? [{ ml: 50, price: product?.price ?? 0, image: product?.image }]
            : []
        );
  // Clamp selectedIndex so it never exceeds available sizes
  const safeIndex = Math.min(selectedIndex, sizes.length - 1);
  const selected = sizes[safeIndex] ?? sizes[0];

  // Animate bottle scale when size changes
  useEffect(() => {
    setImgScale(false);
    const t = setTimeout(() => setImgScale(true), 30);
    return () => clearTimeout(t);
  }, [selectedIndex]);

  useEffect(() => {
    if (selected) {
      setImgSrc(selected.image || product.image);
    }
  }, [selected, product]);

  // Lock background page scroll while the modal is open, so only the
  // modal card scrolls. The modal is portaled to <body>, so it stays
  // centered in the viewport regardless of scroll position.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat('en-IN').format(selected.price);

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${selected.ml}`,
      name: product.name,
      type: product.type,
      size: `${selected.ml}ml`,
      price: selected.price,
      formattedPrice,
      image: selected.image || product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Bottle scale based on size index (visual metaphor)
  const bottleScales = [0.72, 0.86, 1];
  const scale = bottleScales[safeIndex] ?? bottleScales[sizes.length - 1] ?? 1;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(6px)',
          zIndex: 1100,
        }}
      />

      {/* Modal panel */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1101,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '24px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <div
          className="product-modal-panel"
          style={{
            backgroundColor: 'var(--primary)',
            width: '100%',
            maxWidth: '860px',
            margin: 'auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
            animation: 'modalFadeUp 0.35s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {/* Left — image panel */}
          <div style={{
            backgroundColor: '#f5f3f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '48px 32px',
            minHeight: '420px',
          }}>
            <img
              key={imgSrc}
              src={imgSrc}
              alt={product.name}
              onError={e => { e.target.onerror = null; e.target.src = FALLBACK; }}
              style={{
                maxWidth: '70%',
                maxHeight: '380px',
                objectFit: 'contain',
                mixBlendMode: 'multiply',
                transform: imgScale ? `scale(${scale})` : `scale(${scale * 0.93})`,
                transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
                opacity: imgScale ? 1 : 0,
                transformOrigin: 'center bottom',
              }}
            />
            {/* Size label badge */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--secondary)',
              color: 'var(--primary)',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              padding: '4px 14px',
              fontWeight: 500,
            }}>
              {selected.ml}ML
            </div>
          </div>

          {/* Right — details panel */}
          <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                alignSelf: 'flex-end',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                marginBottom: '24px',
                opacity: 0.6,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
            >
              <X size={22} strokeWidth={1.5} />
            </button>

            {/* Product type */}
            <p style={{
              fontSize: '0.72rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--gray-dark)',
              marginBottom: '10px',
            }}>
              {product.type}
            </p>

            {/* Product name */}
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: 300,
              letterSpacing: '0.1em',
              lineHeight: 1.2,
              marginBottom: '28px',
            }}>
              {product.name}
            </h2>

            {/* Price */}
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 300,
              marginBottom: '32px',
              letterSpacing: '0.05em',
              transition: 'all 0.2s ease',
            }}>
              ₹ {formattedPrice}
            </p>

            {/* Description — only rendered when the product has one */}
            {product.description?.trim() && (
              <p style={{
                fontSize: '0.9rem',
                lineHeight: 1.7,
                color: 'var(--gray-dark)',
                marginBottom: '32px',
                whiteSpace: 'pre-line',
              }}>
                {product.description}
              </p>
            )}

            {/* Size selector */}
            <div style={{ marginBottom: '32px' }}>
              <p style={{
                fontSize: '0.72rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--gray-dark)',
                marginBottom: '12px',
              }}>
                Select Size
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {sizes.map((s, i) => (
                  <button
                    key={s.ml}
                    onClick={() => setSelectedIndex(i)}
                    style={{
                      width: '64px',
                      height: '64px',
                      border: selectedIndex === i
                        ? '1.5px solid var(--secondary)'
                        : '1px solid var(--gray-light)',
                      backgroundColor: selectedIndex === i ? 'var(--secondary)' : 'transparent',
                      color: selectedIndex === i ? 'var(--primary)' : 'var(--secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '2px',
                      transition: 'all 0.2s ease',
                      fontSize: '0.85rem',
                      letterSpacing: '0.05em',
                      fontWeight: selectedIndex === i ? 500 : 400,
                    }}
                  >
                    <span>{s.ml}</span>
                    <span style={{ fontSize: '0.62rem', letterSpacing: '0.08em', opacity: 0.75 }}>ML</span>
                  </button>
                ))}
              </div>
                <p style={{
                  fontSize: '0.7rem',
                  color: 'var(--gray-dark)',
                  marginTop: '10px',
                  letterSpacing: '0.05em',
                }}>
                  {sizes.map(s => `₹ ${new Intl.NumberFormat('en-IN').format(s.price)}`).join(' · ')}
                </p>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: 'var(--gray-light)', marginBottom: '32px' }} />

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="luxury-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                fontSize: '0.8rem',
                letterSpacing: '0.18em',
                backgroundColor: added ? '#2a7a4d' : undefined,
                transition: 'background-color 0.3s ease',
              }}
            >
              <ShoppingBag size={16} strokeWidth={1.5} />
              {added ? 'ADDED TO CART ✓' : `ADD TO CART — ${selected.ml}ML`}
            </button>

            {/* Note */}
            <p style={{
              fontSize: '0.68rem',
              color: 'var(--gray-dark)',
              textAlign: 'center',
              marginTop: '16px',
              letterSpacing: '0.05em',
            }}>
              Free shipping on orders above ₹2,500
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalFadeUp {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @media (max-width: 640px) {
          .product-modal-panel {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>,
    document.body
  );
};

export default ProductModal;
