import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../components/Toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 New state for the eye icon
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 👈 New validation function
  const validatePassword = (password) => {
    // Min 8 chars, 1 uppercase, 1 lowercase, 1 special character
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // 👈 Check password strength before sending to backend
    if (!validatePassword(formData.password)) {
      const msg = 'Password must be at least 8 characters, and include an uppercase letter, a lowercase letter, and a special symbol.';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    showToast('Creating account...', 'loading');
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, formData);
      localStorage.setItem('token', response.data.token);
      showToast('Registration successful! Redirecting...', 'success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-black">
      <div className="relative w-full max-w-md p-8 space-y-6 glass-card z-10 mx-4">
        {/* Back Link */}
        <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-purple-400 transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </Link>
        <h2 className="text-3xl font-extrabold text-center text-gradient pb-2">Create Account</h2>
        
        {error && <p className="p-3 text-sm text-red-700 bg-red-100 rounded">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">Name</label>
            <input 
              type="text" name="name" required onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl glass-input"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">Email</label>
            <input 
              type="email" name="email" required onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl glass-input"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-300">Password</label>
            {/* 👈 Wrapped input in a relative div for the absolute button */}
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} // 👈 Toggles type
                name="password" required onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl glass-input pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1 text-gray-500 hover:text-blue-600 focus:outline-none"
              >
                {/* SVG for Eye / Eye-Off */}
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full px-4 py-3 font-bold rounded-xl glass-button">
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-400">
          Already have an account? <Link to="/login" className="text-purple-500 hover:text-purple-400 font-bold ml-1 transition-colors">Log in</Link>
        </p>
      </div>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default Register;