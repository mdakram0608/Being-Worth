import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { Plus, Trash2, Edit2, Image as ImageIcon, Loader2, X } from 'lucide-react';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('Eau de Parfum');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching products:", error);
      // Fallback for initial setup before table exists
      if (error.code === '42P01') {
         alert("Warning: The 'products' table doesn't exist in Supabase yet. Please create it first.");
      }
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setName(product.name);
      setType(product.type);
      setPrice(product.price.toString());
      setImagePreview(product.image);
      setImageFile(null);
    } else {
      setEditingId(null);
      setName('');
      setType('Eau de Parfum');
      setPrice('');
      setImagePreview('');
      setImageFile(null);
    }
    setIsModalOpen(true);
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return imagePreview; // Keep existing image if no new file
    
    setUploading(true);
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      alert('Error uploading image: ' + uploadError.message);
      setUploading(false);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    setUploading(false);
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // 1. Upload new image if provided
      let finalImageUrl = imagePreview; // default to existing
      
      if (imageFile) {
        finalImageUrl = await uploadImage();
      } else if (!editingId && !imageFile) {
         // If new product and no image, fallback to placeholder
         finalImageUrl = '/bottle.png';
      }

      const formattedPriceStr = new Intl.NumberFormat('en-IN', {
         minimumFractionDigits: 2,
         maximumFractionDigits: 2
      }).format(Number(price));

      const productData = {
        name,
        type,
        price: Number(price),
        formattedPrice: formattedPriceStr,
        image: finalImageUrl
      };

      if (editingId) {
        // UPDATE
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId);
          
        if (error) throw error;
      } else {
        // INSERT
        const { error } = await supabase
          .from('products')
          .insert([productData]);
          
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchProducts(); // Refresh list

    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, imageUrl) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Delete from database
        const { error: dbError } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (dbError) throw dbError;

        // Try to delete image from storage if it's not a generic placeholder
        if (imageUrl && imageUrl.includes('supabase') && imageUrl.includes('product-images')) {
           const imagePath = imageUrl.split('product-images/')[1]; // extract path after bucket name
           if (imagePath) {
             const { error: storageError } = await supabase.storage
               .from('product-images')
               .remove([imagePath]);
             if(storageError) console.error("Could not delete image, but product is removed:", storageError);
           }
        }

        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product.");
      }
    }
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
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }}>
          <div style={{
             backgroundColor: 'var(--primary)',
             width: '100%',
             maxWidth: '500px',
             padding: '32px',
             position: 'relative'
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

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Image Uploader */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product Image</label>
                <label style={{
                  border: '1px dashed var(--gray-dark)',
                  height: '150px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'var(--gray-light)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  ) : (
                    <>
                      <ImageIcon size={32} color="var(--gray-dark)" style={{ marginBottom: '8px' }} />
                      <span style={{ fontSize: '0.85rem', color: 'var(--gray-dark)' }}>Click to upload image</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
              </div>

              {/* Form Fields */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</label>
                  <input required type="text" value={name} onChange={(e) => setName(e.target.value)}
                    style={{ padding: '12px', border: '1px solid var(--gray-light)', outline: 'none', fontFamily: 'inherit' }}
                    placeholder="e.g. BEING WORTH"
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price (₹)</label>
                  <input required type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)}
                    style={{ padding: '12px', border: '1px solid var(--gray-light)', outline: 'none', fontFamily: 'inherit' }}
                    placeholder="4500"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)}
                  style={{ padding: '12px', border: '1px solid var(--gray-light)', outline: 'none', fontFamily: 'inherit', backgroundColor: 'var(--primary)' }}
                >
                  <option value="Eau de Parfum">Eau de Parfum</option>
                  <option value="Eau de Toilette">Eau de Toilette</option>
                  <option value="Cologne">Cologne</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="luxury-btn" 
                disabled={uploading}
                style={{ marginTop: '16px', opacity: uploading ? 0.7 : 1, display: 'flex', justifyContent: 'center', gap: '8px' }}
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
