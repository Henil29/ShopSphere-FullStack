import { Loading } from "../components/Loading.jsx";
import { CartData } from "../context/cart.contex";

const Cart = () => {
  const { carts, loading, deleteCartItem, updateCartItemQuantity } = CartData();

  if (loading) return <Loading />;
  if (!carts || !carts.items) return <p>No items in the cart</p>;

  return (
    <div style={styles.grid}>
      {carts.items.length > 0 ? (
        carts.items.map((item) => (
          <div key={item._id} style={styles.card}>
            <img
              src={item.productId.image?.url}
              alt={item.productId.name}
              style={styles.image}
            />
            <h3>{item.productId.name}</h3>
            <p>
              <span style={styles.oldPrice}>₹{item.productId.oldprice}</span>{" "}
              <span style={styles.newPrice}>₹{item.productId.newprice}</span>
            </p>

            {/* Update & Delete - in single line */}
            <div style={styles.actionsRow}>
              <div style={styles.quantityBox}>
                <button
                  onClick={() => {
                    if (item.quantity === 1) {
                      deleteCartItem(item._id);
                    } else {
                      updateCartItemQuantity(item._id, item.quantity - 1);
                    }
                  }}
                  style={styles.quantityButton}
                >
                  {item.quantity === 1 ? "🗑️" : "−"}
                </button>

                <div style={styles.quantityText}>{item.quantity}</div>

                <button
                  onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}
                  style={styles.quantityButton}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => deleteCartItem(item._id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No items in the cart</p>
      )}
    </div>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    padding: "2rem",
  },
  card: {
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "1rem",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "contain",
    marginBottom: "1rem",
  },
  oldPrice: {
    textDecoration: "line-through",
    color: "#999",
    marginRight: "0.5rem",
  },
  newPrice: {
    color: "#d32f2f",
    fontWeight: "bold",
  },
  actionsRow: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "1rem",
  gap: "25px",
}
,
  quantityBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  quantityButton: {
    padding: "6px 12px",
    fontSize: "18px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    background: "#f5f5f5",
    cursor: "pointer",
    minWidth: "40px",
  },
  quantityText: {
    fontSize: "16px",
    fontWeight: "bold",
    minWidth: "24px",
    textAlign: "center",
  },
  deleteButton: {
    background: "#ff4d4f",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Cart;
