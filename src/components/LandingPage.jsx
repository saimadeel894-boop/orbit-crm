import React from 'react';
import { CircleDot, PhoneCall, Users, Kanban, ArrowRight, ShieldCheck, Zap, CheckCircle2, Lock } from 'lucide-react';

export default function LandingPage({ onGoToLogin, onGoToApp, onStartDemo, isAuthenticated }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B0E14',
      color: '#E7EBF2',
      fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
      overflowX: 'hidden'
    }}>
      {/* Top Navbar */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => window.location.hash = '#'}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #4F6BFF 0%, #3B52D4 100%)',
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(79,107,255,0.4)'
          }}>
            <CircleDot size={20} />
          </div>
          <div>
            <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>Orbit</span>
            <span style={{ fontSize: '11px', color: '#4F6BFF', marginLeft: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>CRM</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onStartDemo && (
            <button
              onClick={onStartDemo}
              style={{
                background: 'color-mix(in srgb, #4F6BFF 15%, transparent)',
                color: '#4F6BFF',
                border: '1px solid #4F6BFF',
                padding: '10px 18px',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🚀 Try Live Demo
            </button>
          )}
          {isAuthenticated ? (
            <button
              onClick={onGoToApp}
              style={{
                background: '#4F6BFF',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(79,107,255,0.35)'
              }}
            >
              Open App Workspace <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <button
                onClick={onGoToLogin}
                style={{
                  background: 'transparent',
                  color: '#B9C0CC',
                  border: '1px solid #262C36',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Sign In
              </button>
              <button
                onClick={onGoToLogin}
                style={{
                  background: '#4F6BFF',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(79,107,255,0.35)'
                }}
              >
                Get Started <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '80px 24px 60px',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(79,107,255,0.12)',
          border: '1px solid rgba(79,107,255,0.25)',
          color: '#7B93FF',
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '24px'
        }}>
          <Zap size={14} /> High-Velocity Sales & Outreach Workspace v1.0
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 5vw, 60px)',
          fontWeight: '800',
          lineHeight: '1.15',
          letterSpacing: '-1.5px',
          margin: '0 0 20px',
          color: '#FFFFFF'
        }}>
          Supercharge Your Cold Calling & <br />
          <span style={{
            background: 'linear-gradient(135deg, #7B93FF 0%, #4F6BFF 50%, #20DBB6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Sales Pipeline Execution
          </span>
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#9CA3AF',
          maxWidth: '680px',
          margin: '0 auto 36px',
          lineHeight: '1.6'
        }}>
          Orbit CRM equips single-founders, sales teams, and agencies with an end-to-end cold calling queue, intelligent contact list management, and real-time deal stage tracking.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={onStartDemo || (isAuthenticated ? onGoToApp : onGoToLogin)}
            style={{
              background: '#4F6BFF',
              color: '#fff',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 8px 24px rgba(79,107,255,0.4)'
            }}
          >
            🚀 Try Live Demo <ArrowRight size={18} />
          </button>
          <button
            onClick={isAuthenticated ? onGoToApp : onGoToLogin}
            style={{
              background: 'transparent',
              color: '#E7EBF2',
              border: '1px solid #262C36',
              padding: '14px 28px',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            {isAuthenticated ? 'Launch Workspace' : 'Sign In'}
          </button>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginTop: '80px',
          textAlign: 'left'
        }}>
          {/* Card 1 */}
          <div style={{
            background: '#131720',
            border: '1px solid #202736',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(79,107,255,0.15)',
              color: '#4F6BFF',
              display: 'grid',
              placeItems: 'center',
              marginBottom: '20px'
            }}>
              <PhoneCall size={22} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 10px', color: '#fff' }}>
              1. Cold Calling Workflow
            </h3>
            <p style={{ color: '#8B94A3', fontSize: '14.5px', lineHeight: '1.6', margin: 0 }}>
              Automated call queues, outcome logging, instant call notes, follow-up scheduling, and built-in Do Not Contact (DNC) list protection.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            background: '#131720',
            border: '1px solid #202736',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(18,165,148,0.15)',
              color: '#12A594',
              display: 'grid',
              placeItems: 'center',
              marginBottom: '20px'
            }}>
              <Users size={22} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 10px', color: '#fff' }}>
              2. Contact Management
            </h3>
            <p style={{ color: '#8B94A3', fontSize: '14.5px', lineHeight: '1.6', margin: 0 }}>
              High-speed CSV/XLSX contact imports, smart list grouping, custom tags, company segmentation, and deduplication engine.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            background: '#131720',
            border: '1px solid #202736',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(245,158,11,0.15)',
              color: '#F59E0B',
              display: 'grid',
              placeItems: 'center',
              marginBottom: '20px'
            }}>
              <Kanban size={22} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 10px', color: '#fff' }}>
              3. Pipeline & Task Tracking
            </h3>
            <p style={{ color: '#8B94A3', fontSize: '14.5px', lineHeight: '1.6', margin: 0 }}>
              Drag-and-drop Kanban deal board, revenue forecasting, contract and payment milestone management, and automated follow-up tasks.
            </p>
          </div>
        </div>

        {/* Specs */}
        <div style={{
          marginTop: '60px',
          padding: '24px 32px',
          background: '#11151D',
          borderRadius: '14px',
          border: '1px solid #1E2532',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={20} style={{ color: '#46C285' }} />
            <span style={{ fontSize: '14px', color: '#C5CEDC', fontWeight: '600' }}>Supabase Encrypted Storage</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} style={{ color: '#4F6BFF' }} />
            <span style={{ fontSize: '14px', color: '#C5CEDC', fontWeight: '600' }}>Zero Latency SPA Architecture</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Lock size={20} style={{ color: '#F59E0B' }} />
            <span style={{ fontSize: '14px', color: '#C5CEDC', fontWeight: '600' }}>Row Level Security (RLS) Safe</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '30px 40px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#6B7280',
        marginTop: '60px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <b>Orbit CRM</b> © 2026. Commercial SaaS Edition.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="mailto:licensing@orbitcrm.io" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Licensing</a>
            <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Orbit CRM protects user data with row-level security and encrypted connections."); }} style={{ color: '#9CA3AF', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Orbit CRM Commercial License."); }} style={{ color: '#9CA3AF', textDecoration: 'none' }}>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
