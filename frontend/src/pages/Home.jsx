import { ProductData } from "../context/product.contex.jsx";
import { Loading } from "../components/Loading.jsx";
import ProductCard from "../components/ProductCard.jsx";

const Home = () => {
  const { products, loading } = ProductData();

  if (loading) return <Loading />;

  return (
    <div style={styles.container}>
      {products && products.length > 0 ? (
        <div style={styles.grid}>
          {products.map((item) => (
            <ProductCard value={item} key={item._id} />
          ))}
        </div>
      ) : (
        <p style={styles.noProduct}>No product here</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '24px',
  },
  noProduct: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#555',
    marginTop: '2rem',
  },
};

export default Home;
