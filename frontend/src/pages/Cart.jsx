import { Loading } from "../components/Loading.jsx";
import { CartData } from "../context/cart.contex";

const Cart = () => {
  const { products, loading } = CartData();

  if (loading) return <Loading />;

  return (
    <div style={styles.grid}>
      {products && products.length > 0 ? (
        products.map((item) => (
          <div key={item._id} style={styles.card}>
            <h3>{item.name}</h3>
            <p>Price: ${item.price}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
        ))
      ) : (
        <p>No items in the cart</p>
      )}
    </div>
  );
}
const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    padding: "1rem",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "1rem",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
};
export default Cart;