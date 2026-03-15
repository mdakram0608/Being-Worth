import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    // Format message for WhatsApp
    let message = "Hello Being Worth! I would like to place an order:%0A%0A";
    
    cartItems.forEach(item => {
      message += `${item.quantity}x ${item.name} (${item.type}) - ₹${item.formattedPrice}%0A`;
    });
    
    // Format total price with commas
    const formattedTotal = new Intl.NumberFormat('en-IN').format(cartTotal);
    message += `%0ATotal: ₹${formattedTotal}`;

    // TO DO: Replace with the actual WhatsApp number when available
    // Format: '91XXXXXXXXXX' (Country code + number without +, spaces or dashes)
    const phoneNumber = "YOUR_WHATSAPP_NUMBER_HERE"; 
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div 
        className="fade-in"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          backdropFilter: 'blur(4px)'
        }}
        onClick={() => setIsCartOpen(false)}
      />
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'var(--primary)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
          transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--gray-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '1.2rem', letterSpacing: '0.1em', fontWeight: 400 }}>YOUR CART</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            style={{ padding: '8px', cursor: 'pointer', background: 'none', border: 'none' }}
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px'
        }}>
          {cartItems.length === 0 ? (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gray-dark)',
              gap: '16px'
            }}>
              <ShoppingBag size={48} strokeWidth={1} />
              <p style={{ letterSpacing: '0.05em' }}>Your cart is empty</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="luxury-btn-outline"
                style={{ marginTop: '16px' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '80px',
                    height: '100px',
                    backgroundColor: 'var(--gray-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px'
                  }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ fontSize: '0.9rem', letterSpacing: '0.05em', fontWeight: 400 }}>{item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--gray-dark)', cursor: 'pointer', padding: '4px' }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--gray-dark)', marginTop: '4px' }}>{item.type}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid var(--gray-light)',
                        borderRadius: '2px'
                      }}>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: '0.85rem', width: '24px', textAlign: 'center' }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p style={{ fontSize: '0.9rem' }}>₹{item.formattedPrice}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div style={{
            padding: '24px',
            borderTop: '1px solid var(--gray-light)',
            backgroundColor: 'var(--primary)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1.1rem' }}>
              <span>Total</span>
              <span>₹{new Intl.NumberFormat('en-IN').format(cartTotal)}</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-dark)', marginBottom: '24px', textAlign: 'center' }}>
              Shipping & taxes calculated at checkout
            </p>
            <button 
              className="luxury-btn" 
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              onClick={handleCheckout}
            >
              Checkout via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
