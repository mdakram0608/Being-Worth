import { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const EMPTY_FORM = { name: '', contact: '', address: '', landmark: '', instructions: '' };

const Cart = () => {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  // Two-step checkout: cart view -> delivery details form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  if (!isCartOpen) return null;

  const handleField = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name';
    if (!form.contact.trim()) {
      next.contact = 'Please enter your contact number';
    } else if (!/^[0-9+\-\s]{7,15}$/.test(form.contact.trim())) {
      next.contact = 'Please enter a valid contact number';
    }
    if (!form.address.trim()) next.address = 'Please enter your delivery address';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const closeCart = () => {
    setIsCartOpen(false);
    // Reset the form step so reopening starts fresh at the cart view
    setShowForm(false);
    setErrors({});
  };

  const handleCheckout = () => {
    if (!validate()) return;

    // Build the order message (plain text; encoded once at the end so that
    // characters like &, # or newlines in the address survive the URL)
    const lines = ['Hello Being Worth! I would like to place an order:', ''];

    cartItems.forEach(item => {
      const sizePart = item.size ? ` ${item.size}` : '';
      lines.push(`${item.quantity}x ${item.name}${sizePart} (${item.type}) - ₹${item.formattedPrice} each`);
    });

    const formattedTotal = new Intl.NumberFormat('en-IN').format(cartTotal);
    lines.push('', `Total: ₹${formattedTotal}`);

    lines.push('', '------------------------', 'Delivery Details:');
    lines.push(`Name: ${form.name.trim()}`);
    lines.push(`Contact: ${form.contact.trim()}`);
    lines.push(`Address: ${form.address.trim()}`);
    if (form.landmark.trim()) lines.push(`Landmark: ${form.landmark.trim()}`);
    if (form.instructions.trim()) lines.push(`Instructions: ${form.instructions.trim()}`);

    const message = encodeURIComponent(lines.join('\n'));

    // Format: '91XXXXXXXXXX' (Country code + number without +, spaces or dashes)
    const phoneNumber = "917092144594";

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${errors[field] ? '#c0392b' : 'var(--gray-light)'}`,
    background: 'var(--primary)',
    fontFamily: 'inherit',
    fontSize: '0.85rem',
    color: 'var(--secondary)',
    outline: 'none',
    letterSpacing: '0.02em',
  });

  const labelStyle = {
    display: 'block',
    fontSize: '0.72rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--gray-dark)',
    marginBottom: '6px',
  };

  const errorStyle = { color: '#c0392b', fontSize: '0.7rem', marginTop: '4px' };

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
        onClick={closeCart}
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
          <h2 style={{ fontSize: '1.2rem', letterSpacing: '0.1em', fontWeight: 400 }}>
            {showForm ? 'DELIVERY DETAILS' : 'YOUR CART'}
          </h2>
          <button
            onClick={closeCart}
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
          {showForm ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <button
                onClick={() => { setShowForm(false); setErrors({}); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--gray-dark)', fontSize: '0.78rem',
                  letterSpacing: '0.05em', padding: 0, alignSelf: 'flex-start',
                }}
              >
                <ChevronLeft size={16} /> Back to cart
              </button>

              <p style={{ fontSize: '0.8rem', color: 'var(--gray-dark)', lineHeight: 1.6 }}>
                Please share your details so we can process your order.
              </p>

              <div>
                <label style={labelStyle}>Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleField('name')}
                  placeholder="Your full name"
                  style={inputStyle('name')}
                />
                {errors.name && <p style={errorStyle}>{errors.name}</p>}
              </div>

              <div>
                <label style={labelStyle}>Contact *</label>
                <input
                  type="tel"
                  value={form.contact}
                  onChange={handleField('contact')}
                  placeholder="Phone / WhatsApp number"
                  style={inputStyle('contact')}
                />
                {errors.contact && <p style={errorStyle}>{errors.contact}</p>}
              </div>

              <div>
                <label style={labelStyle}>Address *</label>
                <textarea
                  value={form.address}
                  onChange={handleField('address')}
                  placeholder="House no., street, area, city, pincode"
                  rows={3}
                  style={{ ...inputStyle('address'), resize: 'vertical' }}
                />
                {errors.address && <p style={errorStyle}>{errors.address}</p>}
              </div>

              <div>
                <label style={labelStyle}>Landmark (optional)</label>
                <input
                  type="text"
                  value={form.landmark}
                  onChange={handleField('landmark')}
                  placeholder="Nearby landmark"
                  style={inputStyle('landmark')}
                />
              </div>

              <div>
                <label style={labelStyle}>Instructions (optional)</label>
                <textarea
                  value={form.instructions}
                  onChange={handleField('instructions')}
                  placeholder="Any special instructions"
                  rows={2}
                  style={{ ...inputStyle('instructions'), resize: 'vertical' }}
                />
              </div>
            </div>
          ) : cartItems.length === 0 ? (
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
                onClick={closeCart}
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
                      <p style={{ fontSize: '0.75rem', color: 'var(--gray-dark)', marginTop: '4px' }}>
                        {item.type}{item.size ? ` · ${item.size}` : ''}
                      </p>
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
            {showForm ? (
              <button
                className="luxury-btn"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                onClick={handleCheckout}
              >
                Checkout via WhatsApp
              </button>
            ) : (
              <button
                className="luxury-btn"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                onClick={() => setShowForm(true)}
              >
                Proceed to Checkout
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
