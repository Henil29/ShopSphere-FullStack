import { UserData } from "../context/user.contex.jsx";
import { Loading } from "../components/Loading.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBoxOpen, FaHeart, FaHome, FaChevronDown, FaChevronUp } from "react-icons/fa";

const AccordionSection = ({ icon, title, children, open, onClick }) => (
  <div
    className={`profile-accordion-card${open ? ' open' : ''}`}
    onClick={onClick}
  >
    <div className="profile-accordion-header">
      <div className="profile-accordion-icon">{icon}</div>
      <div className="profile-accordion-title">{title}</div>
      <div className="profile-accordion-chevron">{open ? <FaChevronUp /> : <FaChevronDown />}</div>
    </div>
    {open && <div className="profile-accordion-content">{children}</div>}
  </div>
);

const Profile = () => {
  const { user, loading } = UserData();
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState("orders");

  if (loading || !user) return <Loading />;

  return (
    <div className="profile-bg-gradient">
      <div className="profile-card animate-fade-in">
        {/* Header */}
        <div className="profile-header">
          <div>
            <div className="profile-name">{user.name}</div>
            <div className="profile-email">{user.email}</div>
          </div>
          <button
            className="profile-update-btn"
            onClick={() => navigate("/update-profile")}
          >
            Update Profile
          </button>
        </div>
        <div className="profile-divider" />
        {/* Accordions */}
        <div className="profile-accordion-list">
          <AccordionSection
            icon={<FaBoxOpen />}
            title="Order History"
            open={openSection === "orders"}
            onClick={() => setOpenSection(openSection === "orders" ? "" : "orders")}
          >
            <p>No orders yet.</p>
          </AccordionSection>
          <AccordionSection
            icon={<FaHeart />}
            title="Saved Items"
            open={openSection === "saved"}
            onClick={() => setOpenSection(openSection === "saved" ? "" : "saved")}
          >
            <p>No saved items.</p>
          </AccordionSection>
          <AccordionSection
            icon={<FaHome />}
            title="Address Book"
            open={openSection === "address"}
            onClick={() => setOpenSection(openSection === "address" ? "" : "address")}
          >
            <p>No saved addresses.</p>
          </AccordionSection>
        </div>
      </div>
    </div>
  );
};

export default Profile;
