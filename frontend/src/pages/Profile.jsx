import { UserData } from "../context/user.contex.jsx";
import { Loading } from "../components/Loading.jsx";
import { useNavigate } from "react-router-dom";

// Subcomponents
const ProfileHeader = ({ name, email, onEditClick }) => (
  <div style={styles.section}>
    <h2>👤 Profile</h2>
    <p><strong>Name:</strong> {name}</p>
    <p><strong>Email:</strong> {email}</p>
    <button onClick={onEditClick} style={styles.button}>Update Profile</button>
  </div>
);

const OrderHistory = () => (
  <div style={styles.section}>
    <h2>📦 Order History</h2>
    <p>No orders yet.</p>
  </div>
);

const SavedItems = () => (
  <div style={styles.section}>
    <h2>❤️ Saved Items</h2>
    <p>No saved items.</p>
  </div>
);

const AddressManager = () => (
  <div style={styles.section}>
    <h2>🏠 Address Book</h2>
    <p>No saved addresses.</p>
  </div>
);

const Profile = () => {
  const { user, loading } = UserData();
  const navigate = useNavigate();

  if (loading || !user) return <Loading />;

  return (
    <div style={styles.wrapper}>
      <ProfileHeader
        name={user.name}
        email={user.email}
        onEditClick={() => navigate("/update-profile")}
      />
      <OrderHistory />
      <SavedItems />
      <AddressManager />
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
  button: {
    marginTop: "1rem",
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Profile;
