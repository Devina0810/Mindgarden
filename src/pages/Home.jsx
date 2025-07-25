import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase'; // Adjust the path as needed

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        navigate('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8F4E9] font-[Montserrat] relative overflow-hidden">
      {/* Floating Background Decorations */}
      <div
        className="absolute top-20 left-10 w-16 h-16 bg-[#6A752D] opacity-10 rounded-full"
        style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '0s' }}
      ></div>
      <div
        className="absolute bottom-1/4 right-20 w-24 h-24 bg-[#6A752D] opacity-10 rounded-full"
        style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '2s' }}
      ></div>
      <div
        className="absolute top-1/3 right-1/4 w-20 h-20 bg-[#6A752D] opacity-10 rounded-full"
        style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '4s' }}
      ></div>

      {/* Main Card */}
      <div className="z-10 flex flex-col items-center text-center px-6 py-8">
        <div className="w-24 h-24 mb-4 animate-float">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M50 10C30 10 10 30 10 50C10 70 30 90 50 90C70 90 90 70 90 50C90 30 70 10 50 10Z"
              fill="#6A752D"
              fillOpacity="0.2"
            />
            <path
              d="M50 15C32.5 15 15 32.5 15 50C15 67.5 32.5 85 50 85C67.5 85 85 67.5 85 50C85 32.5 67.5 15 50 15Z"
              fill="#6A752D"
              fillOpacity="0.3"
            />
            <path
              d="M50 20C35 20 20 35 20 50C20 65 35 80 50 80C65 80 80 65 80 50C80 35 65 20 50 20Z"
              fill="#6A752D"
              fillOpacity="0.4"
            />
            <path
              d="M50 25C37.5 25 25 37.5 25 50C25 62.5 37.5 75 50 75C62.5 75 75 62.5 75 50C75 37.5 62.5 25 50 25Z"
              fill="#6A752D"
              fillOpacity="0.6"
            />
            <path
              d="M50 30C40 30 30 40 30 50C30 60 40 70 50 70C60 70 70 60 70 50C70 40 60 30 50 30Z"
              fill="#6A752D"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold font-[Playfair_Display] text-[#3A3A3A]">Welcome to MindGarden</h1>
        <p className="mt-2 text-lg text-[#6A752D]">Nurturing your mental wellness, one day at a time</p>

        {/* Show Login/Signup only if not logged in */}
        {!user && (
          <div className="mt-8 space-y-4 w-full max-w-xs">
            <Link
              to="/login"
              className="block w-full py-3 px-4 rounded-md !text-white text-lg bg-[#6A752D] hover:bg-[#5A6425] transition no-underline"
            >
              Login to Your Garden
            </Link>
            <Link
              to="/signup"
              className="block w-full py-3 px-4 rounded-md border-2 border-[#6A752D] !text-[#6A752D] text-lg hover:bg-[#F1EDE2] hover:!text-[#6A752D] transition no-underline"
            >
              Cultivate New Growth
            </Link>
          </div>
        )}

        <p className="mt-8 text-sm text-[#6A752D] max-w-md">
          "You don't have to control your thoughts. You just have to stop letting them control you."
          <span className="block italic mt-1">— Dan Millman</span>
        </p>
      </div>
    </div>
  );
};

export default Home;
