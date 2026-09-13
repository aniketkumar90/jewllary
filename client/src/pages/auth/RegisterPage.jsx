import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BRAND_NAME } from '../../utils/constants';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all mandatory fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const user = await register({ name, email, phone, password });
      toast.success(`Welcome to New Shiv Jewellers, ${user.name}`);
      navigate('/account');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
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
            Fine Jewels • Est. 2024
          </span>
          <h2 className="text-xl font-serif text-ivory mt-3 font-normal">
            Become a Registered Patron
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Princess Gayatri Devi"
            dark={true}
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. patron@domain.com"
            dark={true}
          />

          <Input
            label="Mobile Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98200 00000"
            dark={true}
          />

          <Input
            label="Security Password (min 6 chars)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            dark={true}
          />

          <div className="pt-2">
            <Button type="submit" variant="gold" fullWidth size="lg" loading={loading}>
              Create Patron Account
            </Button>
          </div>
        </form>

        <div className="pt-2 text-xs text-ivory/70">
          <span>Already registered? </span>
          <Link to="/login" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
