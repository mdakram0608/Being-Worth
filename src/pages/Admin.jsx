import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { Plus, Trash2, Edit2, Image as ImageIcon, Loader2, X } from 'lucide-react';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State — text fields
  const [name, setName] = useState('');
  const [type, setType] = useState('Eau de Parfum');
  const [description, setDescription] = useState('');
  const [price8, setPrice8] = useState('');
  const [price20, setPrice20] = useState('');
  const [price50, setPrice50] = useState('');
  const [price100, setPrice100] = useState('');
  const [uploading, setUploading] = useState(false);

  // Per-size image state: { file, preview }
  const [imgs, setImgs] = useState({
    '8ml':   { file: null, preview: '' },
    '20ml':  { file: null, preview: '' },
    '50ml':  { file: null, preview: '' },
    '100ml': { file: null, preview: '' },
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching products:', error);
      if (error.code === '42P01') alert("Warning: The 'products' table doesn't exist in Supabase yet.");
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setType('Eau de Parfum');
    setDescription('');
    setPrice8(''); setPrice20(''); setPrice50(''); setPrice100('');
    setImgs({
      '8ml':   { file: null, preview: '' },
      '20ml':  { file: null, preview: '' },
      '50ml':  { file: null, preview: '' },
      '100ml': { file: null, preview: '' },
    });
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setName(product.name);
      setType(product.type);
      setDescription(product.description ?? '');
      setPrice8((product.price_8ml ?? '').toString());
      setPrice20((product.price_20ml ?? '').toString());
      setPrice50((product.price_50ml ?? product.price ?? '').toString());
      setPrice100((product.price_100ml ?? '').toString());
      setImgs({
        '8ml':   { file: null, preview: product.image_8ml   || product.image || '' },
        '20ml':  { file: null, preview: product.image_20ml  || product.image || '' },
        '50ml':  { file: null, preview: product.image_50ml  || product.image || '' },
        '100ml': { file: null, preview: product.image_100ml || product.image || '' },
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleImageChange = (size, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImgs(prev => ({
        ...prev,
        [size]: { file, preview: URL.createObjectURL(file) },
      }));
    }
  };

  // Upload a single image file, return public URL
  const uploadSingleImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `product-images/${Math.random()}.${fileExt}`;
    const { error } = await supabase.storage.from('product-images').upload(filePath, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Upload each size image if a new file was selected, otherwise keep existing url
      const urls = {};
      for (const size of ['8ml', '20ml', '50ml', '100ml']) {
        const { file, preview } = imgs[size];
        if (file) {
          urls[size] = await uploadSingleImage(file);
        } else {
          urls[size] = preview || null;
        }
      }

      // Use 100ml image as canonical product image (fallback chain)
      const canonicalImage = urls['100ml'] || urls['50ml'] || urls['20ml'] || urls['8ml'] || '/bottle.png';

      const p8   = Number(price8)   || 0;
      const p20  = Number(price20)  || 0;
      const p50  = Number(price50)  || 0;
      const p100 = Number(price100) || 0;
      const basePrice = p100 || p50 || p20 || p8;
      const formattedPriceStr = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2, maximumFractionDigits: 2,
      }).format(basePrice);

      const productData = {
        name,
        type,
        description: description.trim() || null,
        price: basePrice,
        formattedPrice: formattedPriceStr,
        price_8ml:    p8,
        price_20ml:   p20,
        price_50ml:   p50,
        price_100ml:  p100,
        image:        canonicalImage,
        image_8ml:    urls['8ml'],
        image_20ml:   urls['20ml'],
        image_50ml:   urls['50ml'],
        image_100ml:  urls['100ml'],
      };

      if (editingId) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchProducts();

    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, imageUrl) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const { error: dbError } = await supabase.from('products').delete().eq('id', id);
        if (dbError) throw dbError;
        if (imageUrl && imageUrl.includes('supabase') && imageUrl.includes('product-images')) {
          const imagePath = imageUrl.split('product-images/')[1];
          if (imagePath) {
            await supabase.storage.from('product-images').remove([imagePath]);
          }
        }
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product.');
      }
    }
  };

  // Reusable image uploader slot
  const ImageSlot = ({ size, label }) => {
    const { preview } = imgs[size];
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray-dark)' }}>
          {label}
        </span>
        <label style={{
          border: preview ? '1.5px solid var(--secondary)' : '1px dashed var(--gray-dark)',
          height: '120px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backgroundColor: 'var(--gray-light)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'border-color 0.2s',
        }}>
          {preview ? (
            <img src={preview} alt={label} style={{ height: '100%', width: '100%', objectFit: 'contain', mixBlendMode: 'multiply', padding: '8px' }} />
          ) : (
            <>
              <ImageIcon size={24} color="var(--gray-dark)" style={{ marginBottom: '6px' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--gray-dark)', textAlign: 'center', padding: '0 8px' }}>
                Upload {label}
              </span>
            </>
          )}
          <input type="file" accept="image/*" onChange={e => handleImageChange(size, e)} style={{ display: 'none' }} />
        </label>
        {preview && (
          <button
            type="button"
            onClick={() => setImgs(prev => ({ ...prev, [size]: { file: null, preview: '' } }))}
            style={{ fontSize: '0.65rem', color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center' }}
          >
            Remove
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="container" style={{ padding: '40px 24px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', letterSpacing: '0.1em', fontWeight: 300 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--gray-dark)' }}>Manage your inventory and products.</p>
        </div>
        <button 
          className="luxury-btn" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={() => handleOpenModal()}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Loader2 className="animate-spin" size={32} color="var(--gray-dark)" />
        </div>
      ) : (
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--secondary)' }}>
                <th style={{ padding: '16px', fontWeight: 400, textTransform: 'uppercase', fontSize: '0.85rem' }}>Image</th>
                <th style={{ padding: '16px', fontWeight: 400, textTransform: 'uppercase', fontSize: '0.85rem' }}>Name</th>
                <th style={{ padding: '16px', fontWeight: 400, textTransform: 'uppercase', fontSize: '0.85rem' }}>Type</th>
                <th style={{ padding: '16px', fontWeight: 400, textTransform: 'uppercase', fontSize: '0.85rem' }}>Price</th>
                <th style={{ padding: '16px', fontWeight: 400, textTransform: 'uppercase', fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--gray-dark)' }}>
                    No products found. Click "Add Product" to get started!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid var(--gray-light)' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ width: '50px', height: '60px', backgroundColor: 'var(--gray-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', mixBlendMode: 'multiply' }} />
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 500 }}>{product.name}</td>
                    <td style={{ padding: '16px', color: 'var(--gray-dark)' }}>{product.type}</td>
                    <td style={{ padding: '16px' }}>₹{product.formattedPrice}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button onClick={() => handleOpenModal(product)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--secondary)' }}>
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(product.id, product.image)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#ff4444' }}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000,
          overflowY: 'auto',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px'
        }}>
          <div style={{
            backgroundColor: 'var(--primary)',
            width: '100%',
            maxWidth: '560px',
            padding: '32px',
            position: 'relative',
            margin: 'auto',
          }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', fontWeight: 300, letterSpacing: '0.1em' }}>
              {editingId ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

              {/* Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)}
                  style={{ padding: '12px', border: '1px solid var(--gray-light)', outline: 'none', fontFamily: 'inherit' }}
                  placeholder="e.g. BEING WORTH"
                />
              </div>

              {/* Type */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</label>
                <select value={type} onChange={e => setType(e.target.value)}
                  style={{ padding: '12px', border: '1px solid var(--gray-light)', outline: 'none', fontFamily: 'inherit', backgroundColor: 'var(--primary)' }}
                >
                  <option value="Eau de Parfum">Eau de Parfum</option>
                  <option value="Eau de Toilette">Eau de Toilette</option>
                  <option value="Cologne">Cologne</option>
                </select>
              </div>

              {/* Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Description <span style={{ color: 'var(--gray-dark)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  style={{ padding: '12px', border: '1px solid var(--gray-light)', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                  placeholder="Describe the fragrance — notes, character, occasion..."
                />
              </div>

              {/* Per-size images */}
              <div>
                <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '12px' }}>
                  Bottle Images — per size
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <ImageSlot size="8ml"   label="8ml"   />
                  <ImageSlot size="20ml"  label="20ml"  />
                  <ImageSlot size="50ml"  label="50ml"  />
                  <ImageSlot size="100ml" label="100ml" />
                </div>
              </div>

              {/* Per-size pricing */}
              <div>
                <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
                  Prices (₹) — per size
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[['8ml', price8, setPrice8], ['20ml', price20, setPrice20], ['50ml', price50, setPrice50], ['100ml', price100, setPrice100]].map(([label, val, setter]) => (
                    <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--gray-dark)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
                      <input
                        type="number" min="0" step="1" value={val}
                        onChange={e => setter(e.target.value)}
                        style={{ padding: '10px 12px', border: '1px solid var(--gray-light)', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' }}
                        placeholder={label === '8ml' ? '1200' : label === '20ml' ? '2800' : label === '50ml' ? '4500' : '6500'}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="luxury-btn" 
                disabled={uploading}
                style={{ marginTop: '8px', opacity: uploading ? 0.7 : 1, display: 'flex', justifyContent: 'center', gap: '8px' }}
              >
                {uploading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Loader2 size={18} className="animate-spin" /> SAVING...
                  </span>
                ) : (
                  editingId ? 'UPDATE PRODUCT' : 'ADD PRODUCT'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
