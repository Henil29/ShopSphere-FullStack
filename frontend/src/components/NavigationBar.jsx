import { Link, useLocation } from 'react-router-dom';
import { UserData } from '../context/user.contex';
import { CartData } from '../context/cart.contex';
import { useState, useEffect } from 'react';

const NavigationBar = () => {
  const { isAuth, logoutUser, isSeller } = UserData();
  const { carts } = CartData();
  const [cartItem, setCartItem] = useState(carts?.items?.length || 0);
  const isLoggedIn = isAuth;
  const Seller = isAuth && isSeller;
  const location = useLocation();
  const tab = location.pathname;
  async function logout() {
    setCartItem(0);
    await logoutUser();
  }

  useEffect(() => {
    setCartItem(carts?.items?.length || 0);
  }, [carts]);

  return (
    <nav style={styles.navbar}>
      {/* Logo */}
      <Link
        to="/"
        style={{
          ...styles.logo,
          textDecoration: tab === '/' ? 'underline' : 'none',
          fontWeight: tab === '/' ? 'bolder' : styles.logo.fontWeight,
        }}
      >
        ShopSphere
      </Link>

      <div style={styles.spacer} />

      {/* Navigation Links */}
      <div style={styles.links}>
        {isLoggedIn ? (
          <>
            <Link
              to="/order"
              style={{
                ...styles.link,
                textDecoration: tab === '/order' ? 'underline' : 'none',
                fontWeight: tab === '/order' ? 'bolder' : styles.link.fontWeight,
              }}
            >
              My Orders
            </Link>
            <Link
              to="/profile"
              style={{
                ...styles.link,
                textDecoration: tab === '/profile' ? 'underline' : 'none',
                fontWeight: tab === '/profile' ? 'bolder' : styles.link.fontWeight,
              }}
            >
              Profile
            </Link>
            {Seller &&
              <Link
                to="/my-products"
                style={{
                  ...styles.link,
                  textDecoration: tab === '/my-products' ? 'underline' : 'none',
                  fontWeight: tab === '/my-products' ? 'bolder' : styles.link.fontWeight
                }}
              >My Products</Link>
            }
            <button style={styles.button} onClick={logout}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/signup"
              style={{
                ...styles.link,
                textDecoration: tab === '/signup' ? 'underline' : 'none',
                fontWeight: tab === '/signup' ? 'bolder' : styles.link.fontWeight,
              }}
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              style={{
                ...styles.link,
                textDecoration: tab === '/login' ? 'underline' : 'none',
                fontWeight: tab === '/login' ? 'bolder' : styles.link.fontWeight,
              }}
            >
              Login
            </Link>
          </>
        )}

        <Link
          to="/cart"
          style={{
            ...styles.cart,
            border: tab === '/cart' ? '2px solid #232f3e' : styles.cart.border,
            fontWeight: tab === '/cart' ? 'bolder' : styles.cart.fontWeight,
          }}
        >
          Cart
          <span style={styles.cartCount}>{cartItem}</span>
        </Link>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#232f3e',
    padding: '0.7rem 2rem',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '1.7rem',
    color: '#ffd700',
    textDecoration: 'none',
    letterSpacing: '1px',
  },
  spacer: {
    flex: 1,
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  button: {
    background: 'none',
    border: '1px solid #ffd700',
    color: '#ffd700',
    borderRadius: '5px',
    padding: '0.4rem 1rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '1rem',
    marginLeft: '0.5rem',
    transition: 'background 0.2s, color 0.2s',
  },
  cart: {
    color: '#232f3e',
    background: '#ffd700',
    borderRadius: '20px',
    padding: '0.4rem 1.1rem',
    fontWeight: 700,
    textDecoration: 'none',
    marginLeft: '1rem',
    position: 'relative',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    border: 'none',
  },
  cartCount: {
    background: '#232f3e',
    color: '#ffd700',
    borderRadius: '50%',
    padding: '0.1rem 0.6rem',
    fontSize: '0.95rem',
    fontWeight: 700,
    marginLeft: '0.3rem',
  },
};

export default NavigationBar;
