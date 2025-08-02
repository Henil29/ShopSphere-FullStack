import { UserData } from "../context/user.contex.jsx";
import { Loading } from "../components/Loading.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaHome, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

// Subcomponents
const ProfileHeader = ({ name, email, onEditClick }) => (
  <div style={styles.section}>
    <h2>👤 Profile</h2>
    <p><strong>Name:</strong> {name}</p>
    <p><strong>Email:</strong> {email}</p>
    <button onClick={onEditClick} style={styles.button}>Update Profile</button>
  </div>
);

const AddressManager = ({ addresses, onAddAddress, onEditAddress, onDeleteAddress }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddAddress(newAddress);
    setNewAddress({
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
    setShowAddForm(false);
  };

  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <h2>🏠 Address Book</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          style={styles.addButton}
        >
          <FaPlus /> Add Address
        </button>
      </div>
      
      {showAddForm && (
        <form onSubmit={handleSubmit} style={styles.addressForm}>
          <div style={styles.formRow}>
            <input
              type="text"
              placeholder="Full Name"
              value={newAddress.name}
              onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
              style={styles.input}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={newAddress.phone}
              onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
              style={styles.input}
              required
            />
          </div>
          <input
            type="text"
            placeholder="Street Address"
            value={newAddress.street}
            onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
            style={styles.input}
            required
          />
          <div style={styles.formRow}>
            <input
              type="text"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="State"
              value={newAddress.state}
              onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Pincode"
              value={newAddress.pincode}
              onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
              style={styles.input}
              required
            />
          </div>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={newAddress.isDefault}
              onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
            />
            Set as default address
          </label>
          <div style={styles.formButtons}>
            <button type="submit" style={styles.saveButton}>Save Address</button>
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)} 
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <p>No saved addresses.</p>
      ) : (
        <div style={styles.addressesList}>
          {addresses.map((address, index) => (
            <div key={address._id || index} style={styles.addressCard}>
              <div style={styles.addressInfo}>
                <h4 style={styles.addressInfoH4}>{address.name}</h4>
                <p style={styles.addressInfoP}>{address.phone}</p>
                <p style={styles.addressInfoP}>{address.street}</p>
                <p style={styles.addressInfoP}>{address.city}, {address.state} - {address.pincode}</p>
                {address.isDefault && <span style={styles.defaultBadge}>Default</span>}
              </div>
              <div style={styles.addressActions}>
                <button 
                  onClick={() => onEditAddress(address)} 
                  style={styles.actionButton}
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => onDeleteAddress(address._id)} 
                  style={styles.actionButton}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Profile = () => {
  const { user, loading } = UserData();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);

  // Fetch addresses from database
  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    setAddressLoading(true);
    try {
      const response = await axios.get('/api/user/addresses');
      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    }
    setAddressLoading(false);
  };

  const handleAddAddress = async (addressData) => {
    try {
      const response = await axios.post('/api/user/addresses', addressData);
      setAddresses(prev => [...prev, response.data.address]);
      toast.success('Address added successfully');
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    }
  };

  const handleEditAddress = async (address) => {
    // For now, just show a toast. You can implement edit functionality later
    toast.info('Edit functionality coming soon');
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await axios.delete(`/api/user/addresses/${addressId}`);
      setAddresses(prev => prev.filter(addr => addr._id !== addressId));
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  if (loading || !user) return <Loading />;

  return (
    <div style={styles.wrapper}>
      <ProfileHeader
        name={user.name}
        email={user.email}
        onEditClick={() => navigate("/update-profile")}
      />
      <AddressManager 
        addresses={addresses}
        onAddAddress={handleAddAddress}
        onEditAddress={handleEditAddress}
        onDeleteAddress={handleDeleteAddress}
      />
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: "700px",
    margin: "2rem auto",
    padding: "1rem",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  section: {
    borderBottom: "1px solid #ddd",
    padding: "1rem 0",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  button: {
    marginTop: "1rem",
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  addButton: {
    padding: "8px 16px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  addressForm: {
    background: "#f8f9fa",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
  },
  formRow: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1rem",
  },
  input: {
    flex: 1,
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "1rem",
    fontSize: "14px",
  },
  formButtons: {
    display: "flex",
    gap: "1rem",
  },
  saveButton: {
    padding: "8px 16px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "8px 16px",
    background: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  addressesList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  addressCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#f8f9fa",
  },
  addressInfo: {
    flex: 1,
  },
  addressInfoH4: {
    margin: "0 0 0.5rem 0",
    color: "#333",
  },
  addressInfoP: {
    margin: "0.25rem 0",
    color: "#666",
    fontSize: "14px",
  },
  defaultBadge: {
    background: "#28a745",
    color: "#fff",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    marginTop: "0.5rem",
    display: "inline-block",
  },
  addressActions: {
    display: "flex",
    gap: "0.5rem",
  },
  actionButton: {
    padding: "6px",
    background: "none",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
    color: "#666",
  },
};

export default Profile;
