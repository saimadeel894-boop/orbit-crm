import React, { useState } from 'react';
import { signIn } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { LogIn } from 'lucide-react';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email to reset password.");
      return;
    }
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setError(error.message);
    } else {
      setResetMessage("Check your email for the password reset link.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f0f0f',
      color: '#E7EBF2',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <div style={{
        background: '#161A20',
        padding: '32px 40px',
        borderRadius: '16px',
        border: '1px solid #262C36',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: '#4F6BFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            margin: '0 auto 16px',
            boxShadow: '0 4px 14px rgba(79,107,255,0.4)'
          }}>
            <LogIn size={20} />
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', margin: '0 0 6px 0', fontWeight: '600' }}>
            Orbit CRM
          </h1>
          <p style={{ color: '#8B94A3', margin: 0, fontSize: '14px' }}>Sign in to your workspace</p>
        </div>

        {error && (
          <div style={{
            background: 'color-mix(in srgb, #F06767 15%, transparent)',
            border: '1px solid #F06767',
            color: '#F06767',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {resetMessage && (
          <div style={{
            background: 'color-mix(in srgb, #46C285 15%, transparent)',
            border: '1px solid #46C285',
            color: '#46C285',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            {resetMessage}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#B9C0CC' }}>Email address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                background: '#12161B',
                border: '1px solid #262C36',
                padding: '10px 14px',
                borderRadius: '10px',
                color: '#E7EBF2',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#4F6BFF'; e.target.style.boxShadow = '0 0 0 3px rgba(79,107,255,0.2)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#262C36'; e.target.style.boxShadow = 'none'; }}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#B9C0CC' }}>Password</label>
              <button 
                type="button" 
                onClick={handleResetPassword}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#4F6BFF', 
                  fontSize: '12px', 
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Forgot password?
              </button>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                background: '#12161B',
                border: '1px solid #262C36',
                padding: '10px 14px',
                borderRadius: '10px',
                color: '#E7EBF2',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#4F6BFF'; e.target.style.boxShadow = '0 0 0 3px rgba(79,107,255,0.2)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#262C36'; e.target.style.boxShadow = 'none'; }}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: '#4F6BFF',
              color: '#fff',
              border: 'none',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              opacity: loading ? 0.8 : 1,
              transition: 'background 0.15s'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
