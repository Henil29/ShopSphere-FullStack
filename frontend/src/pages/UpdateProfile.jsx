import { useState, useEffect } from 'react';
import { UserData } from '../context/user.contex.jsx';
import { Loading } from '../components/Loading.jsx';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
  const {
    user,
    loading,
    updateUserInfo,
    deleteUserAccount,
  } = UserData();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isSeller: false,
    oldPassword: '',
    newPassword: ''
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        isSeller: user.isSeller || false,
        oldPassword: '',
        newPassword: ''
      });
    }
  }, [user]);

  if (loading || !user) return <Loading />;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const result = await updateUserInfo(formData);
    setMessage(result.message);
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    setDeleting(true);
    const result = await deleteUserAccount();
    setMessage(result.message);
    if (result.success) {
      navigate('/'); // redirect to home or login
    }
    setDeleting(false);
  };

  return (
    <div style={styles.container}>
      <h2>My Profile</h2>

      <label style={styles.label}>Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        style={styles.input}
      />

      <label style={styles.label}>Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        style={styles.input}
      />

      <label style={styles.label}>Old Password</label>
      <input
        type="password"
        name="oldPassword"
        value={formData.oldPassword}
        onChange={handleChange}
        style={styles.input}
      />

      <label style={styles.label}>New Password</label>
      <input
        type="password"
        name="newPassword"
        value={formData.newPassword}
        onChange={handleChange}
        style={styles.input}
      />

      <div style={styles.checkboxRow}>
        <input
          type="checkbox"
          name="isSeller"
          checked={formData.isSeller}
          onChange={handleChange}
        />
        <label style={styles.checkboxLabel}>I am a Seller</label>
      </div>

      <button onClick={handleSave} style={styles.saveButton} disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </button>

      <button onClick={handleDelete} style={styles.deleteButton} disabled={deleting}>
        {deleting ? "Deleting..." : "Delete Account"}
      </button>

      {/* {message && <p style={styles.message}>{message}</p>} */}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "2rem auto",
    padding: "2rem",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  label: {
    fontWeight: "bold",
    display: "block",
    marginTop: "1rem",
    marginBottom: "0.3rem",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "0.5rem",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    marginTop: "1rem",
  },
  checkboxLabel: {
    marginLeft: "0.5rem",
  },
  saveButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    marginTop: "1rem",
    cursor: "pointer",
  },
  deleteButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#ff4d4f",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    marginTop: "0.5rem",
    cursor: "pointer",
  },
  message: {
    marginTop: "1rem",
    color: "#333",
    fontWeight: "bold",
  },
};

export default UpdateProfile;
