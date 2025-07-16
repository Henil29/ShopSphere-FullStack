import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductData } from '../context/product.contex.jsx';
import { toast } from 'react-toastify';
import './Product.css';

const COMMON_CATEGORIES = [
  'Electronics', 'Fashion', 'Books', 'Home', 'Beauty', 'Sports', 'Toys', 'Grocery',
];

const UpdateProduct = () => {
  const { id } = useParams();
  const { products, fetchOneProduct, singleProduct, updateProduct, loading } = ProductData();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', oldprice: '', newprice: '', details: '', quantity: '', timeToDeliver: '', image: null
  });
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [otherCategories, setOtherCategories] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchOneProduct(id);
  }, [id]);

  useEffect(() => {
    if (singleProduct && singleProduct._id === id) {
      setForm({
        name: singleProduct.name || '',
        oldprice: singleProduct.oldprice || '',
        newprice: singleProduct.newprice || '',
        details: singleProduct.details || '',
        quantity: singleProduct.quantity || '',
        timeToDeliver: singleProduct.timeToDeliver ? singleProduct.timeToDeliver.replace(' days', '') : '',
        image: null
      });
      // Set categories
      if (Array.isArray(singleProduct.category)) {
        setCheckedCategories(singleProduct.category.filter(cat => COMMON_CATEGORIES.includes(cat)));
        setOtherCategories(singleProduct.category.filter(cat => !COMMON_CATEGORIES.includes(cat)).join(', '));
      } else if (singleProduct.category) {
        if (COMMON_CATEGORIES.includes(singleProduct.category)) {
          setCheckedCategories([singleProduct.category]);
          setOtherCategories('');
        } else {
          setCheckedCategories([]);
          setOtherCategories(singleProduct.category);
        }
      }
      setImagePreview(singleProduct.image?.url || null);
    }
  }, [singleProduct, id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm({ ...form, [name]: files[0] });
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target.result);
        reader.readAsDataURL(files[0]);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCheckedCategories([...checkedCategories, value]);
    } else {
      setCheckedCategories(checkedCategories.filter((cat) => cat !== value));
    }
  };

  const handleOtherCategoriesChange = (e) => {
    setOtherCategories(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let categories = [...checkedCategories];
    if (otherCategories.trim()) {
      const custom = otherCategories
        .split(/,|\n/)
        .map((c) => c.trim())
        .filter((c) => c);
      categories = [...categories, ...custom];
    }
    if (!form.name || !form.newprice || !form.details || categories.length === 0 || !form.quantity || !form.timeToDeliver) {
      toast.error('Please fill all required fields, select/add at least one category, and enter delivery time in days.');
      return;
    }
    if (isNaN(form.timeToDeliver) || Number(form.timeToDeliver) < 1) {
      toast.error('Delivery time must be a positive number of days.');
      return;
    }
    const result = await updateProduct(id, {
      ...form,
      category: categories,
      timeToDeliver: `${form.timeToDeliver} days`
    });
    if (result.success) {
      toast.success('Product updated successfully!');
      navigate('/my-products');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="amazon-add-product-container">
      <h2 className="amazon-add-product-title">Update Product</h2>
      <form className="amazon-add-product-form" onSubmit={handleSubmit}>
        <div className="amazon-add-product-field">
          <label className="amazon-add-product-label">Name*:</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="amazon-add-product-input" required />
        </div>
        <div className="amazon-add-product-field">
          <label className="amazon-add-product-label">Old Price:</label>
          <input type="number" name="oldprice" value={form.oldprice} onChange={handleChange} className="amazon-add-product-input" min="0" />
        </div>
        <div className="amazon-add-product-field">
          <label className="amazon-add-product-label">New Price*:</label>
          <input type="number" name="newprice" value={form.newprice} onChange={handleChange} className="amazon-add-product-input" min="0" required />
        </div>
        <div className="amazon-add-product-field">
          <label className="amazon-add-product-label">Details*:</label>
          <textarea name="details" value={form.details} onChange={handleChange} className="amazon-add-product-input" style={{height: 60}} required />
        </div>
        <div className="amazon-add-product-field">
          <label className="amazon-add-product-label">Category*:</label>
          <div className="amazon-add-product-categories">
            {COMMON_CATEGORIES.map((cat) => (
              <label key={cat} className="amazon-add-product-category-checkbox">
                <input
                  type="checkbox"
                  value={cat}
                  checked={checkedCategories.includes(cat)}
                  onChange={handleCategoryChange}
                />
                {cat}
              </label>
            ))}
          </div>
          <textarea
            className="amazon-add-product-input"
            style={{marginTop: 8, minHeight: 38}}
            placeholder="Add other categories (comma or new line separated)"
            value={otherCategories}
            onChange={handleOtherCategoriesChange}
          />
        </div>
        <div className="amazon-add-product-field">
          <label className="amazon-add-product-label">Quantity*:</label>
          <input type="number" name="quantity" value={form.quantity} onChange={handleChange} className="amazon-add-product-input" min="1" required />
        </div>
        <div className="amazon-add-product-field">
          <label className="amazon-add-product-label">Time to Deliver (days)*:</label>
          <input type="number" name="timeToDeliver" value={form.timeToDeliver} onChange={handleChange} className="amazon-add-product-input" min="1" required />
        </div>
        <div className="amazon-add-product-field">
          <label className="amazon-add-product-label">Image:</label>
          <input id="image-input" type="file" name="image" accept="image/*" onChange={handleChange} className="amazon-add-product-input" />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="amazon-add-product-image-preview"
              style={{ maxWidth: 180, maxHeight: 140, marginTop: 10, borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
            />
          )}
        </div>
        <button type="submit" className="amazon-add-product-btn" disabled={loading}>{loading ? 'Updating...' : 'Update Product'}</button>
      </form>
    </div>
  );
};

export default UpdateProduct; 