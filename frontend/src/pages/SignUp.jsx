import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSeller, setIsSeller] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields!');
      return;
    }
    toast.success('Sign up successful!');
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Sign Up for ShopSphere</h2>
        <label style={styles.label} htmlFor="name">User Name</label>
        <input
          style={styles.input}
          type="text"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />
        <label style={styles.label} htmlFor="email">Email</label>
        <input
          style={styles.input}
          type="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <label style={styles.label} htmlFor="password">Password</label>
        <input
          style={styles.input}
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="isSeller"
            checked={isSeller}
            onChange={e => setIsSeller(e.target.checked)}
            style={styles.checkbox}
          />
          <label htmlFor="isSeller" style={styles.checkboxLabel}>Want to be a seller?</label>
        </div>
        <button style={styles.button} type="submit">Sign Up</button>
        <div style={styles.registerText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.registerLink}>Login</Link>
        </div>
        <div style={{textAlign: 'center', marginTop: '1rem'}}>
          <Link to="/" style={{ color: '#007185', textDecoration: 'underline', fontWeight: 500 }}>Back to Home</Link>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 64px)', // Adjust for navbar height
    height: 'calc(100vh - 64px)',   // Adjust for navbar height
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f3f3f3',
    // overflow: 'hidden', // Remove to allow for content if needed
  },
  form: {
    background: '#fff',
    padding: '2.5rem 2rem',
    borderRadius: '10px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '400px',
    maxWidth: '600px',
  },
  title: {
    marginBottom: '1.5rem',
    color: '#232f3e',
    fontWeight: 700,
    fontSize: '1.5rem',
    textAlign: 'center',
  },
  label: {
    marginBottom: '0.3rem',
    color: '#232f3e',
    fontWeight: 500,
    fontSize: '1rem',
  },
  input: {
    marginBottom: '1.2rem',
    padding: '0.7rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outline: 'none',
    background: '#f9f9f9',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.2rem',
  },
  checkbox: {
    marginRight: '0.5rem',
    width: '18px',
    height: '18px',
  },
  checkboxLabel: {
    fontSize: '1rem',
    color: '#232f3e',
    fontWeight: 500,
  },
  button: {
    background: '#ffd700',
    color: '#232f3e',
    border: 'none',
    borderRadius: '6px',
    padding: '0.7rem',
    fontWeight: 700,
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginBottom: '1rem',
    transition: 'background 0.2s',
  },
  registerText: {
    textAlign: 'center',
    fontSize: '1rem',
    color: '#232f3e',
  },
  registerLink: {
    color: '#007185',
    textDecoration: 'underline',
    fontWeight: 500,
    marginLeft: '0.2rem',
  },
};

export default SignUp;
