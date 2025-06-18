import { ProductData } from "../context/product.contex.jsx";
import { Loading } from "../components/Loading.jsx";
import ProductCard from "../components/ProductCard.jsx";

const Home = () => {
  const { products, loading } = ProductData();
  
  if (loading) return <Loading />;

  return (
    <div style={styles.grid}>
      {products && products.length > 0 ? (
        products.map((item) => (
          <ProductCard value={item} key={item._id} />
        ))
      ) : (
        <p>No product here</p>
      )}
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '16px',
    padding: '20px',
    backgroundColor: '#f3f3f3',
  },
};


export default Home;
