import { useState, useEffect } from 'react';
import { auth } from '../utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.log("Login component - user state:", user);
    if (user) {
      console.log("User authenticated, navigating to dashboard");
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      // Navigation will be handled by useEffect when user state changes
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === 'auth/user-not-found') {
        toast.error("No account found with this email 🌱");
      } else if (err.code === 'auth/wrong-password') {
        toast.error("Incorrect password 🌱");
      } else if (err.code === 'auth/invalid-email') {
        toast.error("Invalid email format 🌱");
      } else if (err.code === 'auth/invalid-credential') {
        toast.error("Invalid email or password 🌱");
      } else {
        toast.error("Login failed. Please try again 🌱");
      }
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#F8F4E9] font-[Montserrat] relative">
      <ToastContainer />

      {/* Background Bubbles */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-[#6A752D] opacity-10 rounded-full animate-float"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-[#6A752D] opacity-10 rounded-full animate-float delay-[0.5s]"></div>

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="z-10 bg-white shadow-md rounded-lg px-8 py-10 w-full max-w-md space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#3A3A3A] font-[Playfair_Display]">Login to MindGarden</h2>
          <p className="mt-1 text-[#6A752D]">Grow through what you go through 🌱</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#6A752D] mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#CFCFCF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6A752D] text-[#3A3A3A] bg-white"
            />
          </div>

          <div>
            <label className="block text-sm text-[#6A752D] mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#CFCFCF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6A752D] text-[#3A3A3A] bg-white"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-[#6A752D]">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox text-[#6A752D] focus:ring-[#6A752D]"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-md bg-[#6A752D] text-white hover:bg-[#5A6425] transition"
          >
            Log In
          </button>
        </div>

        <div className="text-center text-sm text-[#6A752D]">
          Don’t have an account?{" "}
          <span className="underline hover:text-[#4e5a1e] transition">
            <Link to="/signup">Sign up</Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
