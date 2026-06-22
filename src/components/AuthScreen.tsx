'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Zap, Star, Flame, ArrowLeft } from 'lucide-react';
import { tessaDb } from '@/lib/tessaDb';

interface AuthScreenProps {
  /** Called when the user successfully logs in AND already has a profile. */
  onLoginSuccess: () => void;
  /** Called when the user successfully creates an account (needs onboarding). */
  onSignupSuccess: () => void;
}

type AuthMode = 'login' | 'signup';

// Floating decorative blob
const Blob = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse ${className}`} />
);

export default function AuthScreen({ onLoginSuccess, onSignupSuccess }: AuthScreenProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contactNumber, setContactNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+65');

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setContactNumber('');
  };

  const validate = (): string | null => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address! 📧';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long! 🔐';
    }
    if (mode === 'signup') {
      if (password !== confirmPassword) {
        return 'Passwords do not match. Give it another try! 🔄';
      }
      if (!contactNumber.trim()) {
        return 'Contact number is mandatory! 📱';
      }
      if (!/^\d{7,15}$/.test(contactNumber)) {
        return 'Please enter a valid phone number (7–15 digits)! 📱';
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        const { error: authError } = await tessaDb.auth.signIn(email, password);
        if (authError) { setError(authError); return; }
        // If login succeeds but no profile → send to onboarding
        if (tessaDb.auth.hasProfile()) {
          onLoginSuccess();
        } else {
          onSignupSuccess(); // treat as new user needing profile setup
        }
      } else {
        const fullPhoneNumber = `${countryCode}${contactNumber}`;
        const { error: authError } = await tessaDb.auth.signUp(email, password, fullPhoneNumber);
        if (authError) { setError(authError); return; }
        onSignupSuccess();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const slideVariants = {
    enter: { opacity: 0, x: mode === 'login' ? -30 : 30 },
    center: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: mode === 'login' ? 30 : -30, transition: { duration: 0.2 } },
  };

  return (
    <div className="tessa-auth-page relative">
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 text-sm font-extrabold text-slate-650 hover:text-slate-900 bg-white border-2 border-slate-200 hover:border-slate-300 rounded-2xl shadow-sm cursor-pointer select-none transition-all z-10"
      >
        <ArrowLeft size={16} /> Back to Home
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="login-card"
      >
        <div className="card-header">
          <div className="logo">TESSA <span>Focus</span></div>
          <div className="tagline">Your AI Thinking Buddy</div>
          <div className="tessa-wrap">
            <div className="tessa-circle">🤖</div>
            <div className="tessa-bubble">Let's think together!</div>
          </div>
        </div>

        <div className="card-body">
          <h2 className="form-title" id="formTitle">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="form-sub" id="formSub">
            {mode === 'login'
              ? 'Enter your email and password to continue learning.'
              : "Start your TESSA Focus journey. It's free."}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="emailInput">Email address</label>
              <input
                type="email"
                id="emailInput"
                className="form-input"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                required
              />
            </div>

            <div className="form-group" id="passwordGroup">
              <label className="form-label" htmlFor="passwordInput">Password</label>
              <div className="password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="passwordInput"
                  className="form-input"
                  placeholder="At least 6 characters"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  required
                />
                <button
                  className="toggle-pw"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Show or hide password"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="confirmPasswordInput">Confirm Password</label>
                  <div className="password-wrap">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="confirmPasswordInput"
                      className="form-input"
                      placeholder="Same password again"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contactNumberInput">Contact Number</label>
                  <div className="phone-input-wrap">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="country-code-select"
                      aria-label="Country code"
                    >
                      <option value="+65">🇸🇬 +65</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+60">🇲🇾 +60</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+64">🇳🇿 +64</option>
                      <option value="+852">🇭🇰 +852</option>
                      <option value="+86">🇨🇳 +86</option>
                      <option value="+81">🇯🇵 +81</option>
                      <option value="+82">🇰🇷 +82</option>
                      <option value="+92">🇵🇰 +92</option>
                      <option value="+880">🇧🇩 +880</option>
                      <option value="+977">🇳🇵 +977</option>
                    </select>
                    <input
                      type="tel"
                      id="contactNumberInput"
                      className="form-input phone-number-input"
                      placeholder="Phone number"
                      value={contactNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 15) {
                          setContactNumber(val);
                          setError(null);
                        }
                      }}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="msg show err">
                <span>⚠️ </span>{error}
              </div>
            )}

            <button
              id={mode === 'login' ? 'btn-login' : 'btn-signup'}
              type="submit"
              disabled={isLoading}
              className={`btn-submit ${isLoading ? 'loading' : ''}`}
            >
              {isLoading && <div className="spinner" />}
              <span className="btn-text">
                {mode === 'login' ? 'Sign in' : 'Create account'}
              </span>
            </button>
          </form>

          <div className="divider" />

          <div className="toggle-mode" id="toggleMode">
            {mode === 'login' ? (
              <>
                New here?{' '}
                <button type="button" onClick={() => switchMode('signup')}>Create a free account</button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" onClick={() => switchMode('login')}>Sign in</button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      <div className="footer-note">
        By signing in you agree to TESSA Focus terms of use.<br />
        Your child's data is never sold or shared.
      </div>
    </div>
  );
}
