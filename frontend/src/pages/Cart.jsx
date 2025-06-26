import { Loading } from "../components/Loading.jsx";
import { CartData } from "../context/cart.contex";

const Cart = () => {
  const { carts, loading } = CartData();

  if (loading) return <Loading />;

  return (
    <div style={styles.grid}>
      {carts.items && carts.items.length > 0 ? (
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
            <p>Quantity: {item.quantity}</p>
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
};

export default Cart;
