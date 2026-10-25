
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth({ onBack }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });

        if (error) throw error;

        if (data.session) {
          setMessage('Account created successfully!');
        } else {
          setMessage(
            'Account created. Check your email to confirm your account, then sign in.'
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (error) {
      setMessage(error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        {onBack && (
  <button
    type="button"
    onClick={onBack}
    style={styles.backButton}
  >
    ← Back to home
  </button>
)}
        <div style={styles.logo}>CF</div>

        <h1 style={styles.heading}>CivicFix AI</h1>
        <p style={styles.subtitle}>
          {isSignUp
            ? 'Create your resident account'
            : 'Welcome back! Sign in to continue'}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {isSignUp && (
            <label style={styles.label}>
              Full name
              <input
                style={styles.input}
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                minLength={2}
                maxLength={100}
                autoComplete="name"
                required
              />
            </label>
          )}

          <label style={styles.label}>
            Email address
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              required
            />
          </label>

          <button
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : isSignUp
                ? 'Create account'
                : 'Sign in'}
          </button>
        </form>

        {message && (
          <p role="status" style={styles.message}>
            {message}
          </p>
        )}

        <p style={styles.switchText}>
          {isSignUp
            ? 'Already have an account?'
            : "Don't have an account yet?"}{' '}
          <button
            type="button"
            style={styles.link}
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage('');
            }}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>

        <p style={styles.footer}>
          CivicFix AI · Building better communities together
        </p>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    background: '#f5f7f6',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '32px',
    background: '#ffffff',
    border: '1px solid #e5e9e7',
    borderRadius: '18px',
    boxShadow: '0 12px 40px rgba(16, 37, 32, 0.07)',
  },
  logo: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '14px',
    background: '#087f5b',
    color: '#ffffff',
    fontWeight: 800,
    fontSize: '18px',
  },
  heading: {
    margin: '20px 0 8px',
    color: '#172b27',
    fontSize: '28px',
  },
  subtitle: {
    margin: '0 0 26px',
    color: '#687772',
    lineHeight: 1.5,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    color: '#263b35',
    fontSize: '14px',
    fontWeight: 600,
  },
  input: {
    boxSizing: 'border-box',
    width: '100%',
    padding: '13px 14px',
    border: '1px solid #dce4df',
    borderRadius: '9px',
    background: '#ffffff',
    color: '#172b27',
    fontSize: '15px',
  },
  button: {
    padding: '14px',
    border: 'none',
    borderRadius: '9px',
    background: '#087f5b',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  message: {
    marginTop: '18px',
    color: '#087f5b',
    fontSize: '14px',
    lineHeight: 1.5,
    overflowWrap: 'anywhere',
  },
  switchText: {
    marginTop: '24px',
    color: '#687772',
    fontSize: '14px',
    textAlign: 'center',
  },
  link: {
    padding: 0,
    border: 'none',
    background: 'none',
    color: '#087f5b',
    fontWeight: 700,
    cursor: 'pointer',
  },
  footer: {
    marginTop: '28px',
    color: '#87938e',
    fontSize: '12px',
    textAlign: 'center',
    lineHeight: 1.5,
  },
  backButton: {
  display: "block",
  marginBottom: "18px",
  padding: "0",
  border: "none",
  background: "transparent",
  color: "#087f5b",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
},
};
