import React, { useState } from 'react';
import { signIn, signUp } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { ArrowLeft, CircleDot } from 'lucide-react';

export default function LoginScreen({ onGoToHome, onLoggedIn, onStartDemo }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const suggestedEmail = email && email.includes('@') && email.endsWith('.co')
    ? email.replace(/\.co$/i, '.com')
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const cleanEmail = email.trim();

    if (mode === 'signin') {
      const { error: signInErr } = await signIn(cleanEmail, password);
      if (signInErr) {
        // Fallback: If account does not exist yet, attempt automatic creation
        if (signInErr.message === "Invalid login credentials" || signInErr.message.includes("Invalid")) {
          const { data: signUpData, error: signUpErr } = await signUp(cleanEmail, password);
          if (signUpData?.user) {
            if (signUpData.session) {
              setSuccessMessage("Account created & signed in successfully!");
              if (onLoggedIn) setTimeout(onLoggedIn, 500);
            } else {
              // Attempt sign in one more time in case user was already registered
              const { error: reSignInErr } = await signIn(cleanEmail, password);
              if (!reSignInErr && onLoggedIn) {
                onLoggedIn();
              } else {
                setSuccessMessage("Account created for " + cleanEmail + "! Check your email inbox to confirm, or click '🚀 Try Live Demo' below.");
              }
            }
          } else if (signUpErr) {
            setError(
              <div>
                <div>Invalid credentials or password for <b>{cleanEmail}</b>.</div>
                {suggestedEmail && (
                  <div style={{ marginTop: '6px' }}>
                    Did you mean <button type="button" onClick={() => { setEmail(suggestedEmail); setError(null); }} style={{ color: '#7B93FF', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}>{suggestedEmail}</button>?
                  </div>
                )}
                <div style={{ marginTop: '8px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button type="button" onClick={() => { setMode('signup'); setError(null); }} style={{ color: '#7B93FF', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}>Create Account</button>
                  {onStartDemo && (
                    <button type="button" onClick={onStartDemo} style={{ color: '#46C285', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}>🚀 Open Live Demo</button>
                  )}
                </div>
              </div>
            );
          }
        } else {
          setError(signInErr.message);
        }
      } else if (onLoggedIn) {
        onLoggedIn();
      }
    } else {
      const { data, error } = await signUp(cleanEmail, password);
      if (error) {
        setError(error.message);
      } else if (data?.user) {
        if (data.session) {
          setSuccessMessage("Account created successfully! Redirecting...");
          if (onLoggedIn) setTimeout(onLoggedIn, 500);
        } else {
          setSuccessMessage("Account created for " + cleanEmail + "! You can now sign in.");
          setMode('signin');
        }
      }
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
      setSuccessMessage("Check your email for the password reset link.");
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
        {onGoToHome && (
          <button
            type="button"
            onClick={onGoToHome}
            style={{
              background: 'none',
              border: 'none',
              color: '#8B94A3',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '20px',
              padding: 0
            }}
          >
            <ArrowLeft size={15} /> Back to Landing Page
          </button>
        )}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4F6BFF 0%, #3B52D4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            margin: '0 auto 16px',
            boxShadow: '0 4px 14px rgba(79,107,255,0.4)'
          }}>
            <CircleDot size={22} />
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', margin: '0 0 6px 0', fontWeight: '600' }}>
            Orbit CRM
          </h1>
          <p style={{ color: '#8B94A3', margin: 0, fontSize: '14px' }}>
            {mode === 'signin' ? 'Sign in to your workspace' : 'Create a new CRM account'}
          </p>
        </div>

        {/* Mode switcher tabs */}
        <div style={{
          display: 'flex',
          background: '#12161B',
          borderRadius: '10px',
          padding: '4px',
          marginBottom: '20px',
          border: '1px solid #262C36'
        }}>
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); setSuccessMessage(null); }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              background: mode === 'signin' ? '#4F6BFF' : 'transparent',
              color: mode === 'signin' ? '#fff' : '#8B94A3',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); setSuccessMessage(null); }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              background: mode === 'signup' ? '#4F6BFF' : 'transparent',
              color: mode === 'signup' ? '#fff' : '#8B94A3',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div style={{
            background: 'color-mix(in srgb, #F06767 15%, transparent)',
            border: '1px solid #F06767',
            color: '#F06767',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '13px',
            marginBottom: '16px',
            lineHeight: '1.4'
          }}>
            {error}
          </div>
        )}

        {successMessage && (
          <div style={{
            background: 'color-mix(in srgb, #46C285 15%, transparent)',
            border: '1px solid #46C285',
            color: '#46C285',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#B9C0CC' }}>Email address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
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
              {mode === 'signin' && (
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
              )}
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'Min 6 characters' : 'Enter password'}
              minLength={mode === 'signup' ? 6 : undefined}
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
            {loading ? (mode === 'signin' ? 'Signing in...' : 'Creating account...') : (mode === 'signin' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {onStartDemo && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #262C36', textAlign: 'center' }}>
            <p style={{ color: '#8B94A3', fontSize: '13px', margin: '0 0 10px' }}>Want to explore without logging in?</p>
            <button
              type="button"
              onClick={onStartDemo}
              style={{
                width: '100%',
                background: 'color-mix(in srgb, #4F6BFF 15%, transparent)',
                color: '#4F6BFF',
                border: '1px solid #4F6BFF',
                padding: '10px',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '13.5px',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              🚀 Try Live Demo (Sample Data)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
