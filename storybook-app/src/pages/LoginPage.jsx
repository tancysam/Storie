import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [resending, setResending] = useState(false);

  const { signIn, signUp, verifyEmail, resendVerificationEmail, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (authLoading) {
    return (
      <div className="min-h-screen bg-retro-cream flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(signInError.message || 'Failed to sign in');
        } else {
          navigate('/');
        }
      } else {
        const { data, error: signUpError } = await signUp(email, password, name);
        if (signUpError) {
          setError(signUpError.message || 'Failed to create account');
        } else if (data?.requireEmailVerification) {
          setVerificationRequired(true);
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (verificationRequired) {
    const handleVerifyCode = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
        const { error: verifyError } = await verifyEmail(email, verificationCode);
        if (verifyError) {
          setError(verifyError.message || 'Invalid verification code. If your backend uses link verification, please check your email for a verification link.');
        } else {
          navigate('/');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    const handleResendCode = async () => {
      setResending(true);
      try {
        const { data, error: resendError } = await resendVerificationEmail(email);
        if (resendError) {
          setError(resendError.message || 'Failed to resend code');
        } else if (data?.success) {
          setError('');
          alert('Verification email sent!');
        }
      } catch (err) {
        setError('Failed to resend code');
      } finally {
        setResending(false);
      }
    };

    return (
      <div className="min-h-screen bg-retro-cream flex items-center justify-center p-4">
        <div className="bg-retro-paper border-3 border-retro-dark p-8 max-w-md w-full text-center">
          <span className="text-4xl mb-4 block">✉️</span>
          <h2 className="text-2xl font-display font-bold text-retro-dark mb-4">Verify Your Email</h2>
          <p className="text-retro-brown mb-4">
            We've sent a verification email to <strong>{email}</strong>.
          </p>
          <p className="text-retro-brown mb-6 text-sm">
            If your account uses code verification, enter the 6-digit code below. If it uses link verification, click the link in your email.
          </p>

          <ErrorMessage message={error} onDismiss={() => setError('')} />

          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-display text-retro-dark mb-1">
                Verification Code (if applicable)
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="w-full px-4 py-3 border-3 border-retro-dark bg-retro-cream font-display text-2xl text-retro-dark text-center tracking-[1em] focus:outline-none focus:ring-2 focus:ring-retro-rust"
                placeholder="000000"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  Verifying...
                </span>
              ) : (
                'Verify Code'
              )}
            </Button>
          </form>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resending}
              className="text-retro-rust font-display hover:underline disabled:text-retro-brown disabled:cursor-not-allowed"
            >
              {resending ? 'Sending...' : "Didn't receive an email? Resend"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t-3 border-retro-dark">
            <Button onClick={() => {
              setVerificationRequired(false);
              setVerificationCode('');
              setError('');
              setIsLogin(true); // Switch to login mode
            }} variant="secondary" className="w-full">
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-retro-cream flex items-center justify-center p-4">
      <div className="bg-retro-paper border-3 border-retro-dark p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <span className="text-4xl mb-2 block">✦</span>
          <h1 className="text-3xl font-display font-bold text-retro-dark tracking-wide">Storie</h1>
          <p className="text-retro-brown mt-2">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        <ErrorMessage message={error} onDismiss={() => setError('')} />

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-display text-retro-dark mb-1">
                Name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border-3 border-retro-dark bg-retro-cream font-retro text-retro-dark focus:outline-none focus:ring-2 focus:ring-retro-rust"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-display text-retro-dark mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border-3 border-retro-dark bg-retro-cream font-retro text-retro-dark focus:outline-none focus:ring-2 focus:ring-retro-rust"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-display text-retro-dark mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border-3 border-retro-dark bg-retro-cream font-retro text-retro-dark focus:outline-none focus:ring-2 focus:ring-retro-rust"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-retro-brown font-retro">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setName('');
              }}
              className="ml-2 text-retro-rust font-display hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
