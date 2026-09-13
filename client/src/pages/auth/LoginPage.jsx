import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BRAND_NAME } from '../../utils/constants';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}`);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="pt-28 pb-20 bg-[#0e1610] text-ivory min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient Radial Gold Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-[#142318] border border-gold-400/40 p-8 sm:p-10 rounded-xl shadow-2xl shadow-black/80 space-y-6 text-center relative z-10">
        <div>
          <img
            src="/images/logo.png"
            alt={BRAND_NAME}
            className="w-16 h-16 object-contain mx-auto mb-2 rounded-lg border border-gold-400/40 p-0.5 shadow-md shadow-black/40"
          />
          <span className="font-serif text-2xl tracking-wider text-gold-400 font-normal block uppercase">
            {BRAND_NAME}
          </span>
          <span className="text-[9px] uppercase tracking-luxury text-gold-300/70 block mt-1">
            Fine Jewels • Client Authentication
          </span>
          <h2 className="text-xl font-serif text-ivory mt-3 font-normal">
            Sign In to Your Vault
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. client@domain.com"
            dark={true}
          />

          <Input
            label="Security Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            dark={true}
          />

          <div className="pt-2">
            <Button type="submit" variant="gold" fullWidth size="lg" loading={loading}>
              Sign In
            </Button>
          </div>
        </form>

        <div className="pt-2 text-xs text-ivory/70">
          <span>New to New Shiv Jewellers? </span>
          <Link to="/register" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
