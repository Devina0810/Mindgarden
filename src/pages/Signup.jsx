import { useState, useCallback } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import debounce from "lodash.debounce";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [checkingUsername, setCheckingUsername] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "username") debouncedCheckUsername(value);
  };

  const debouncedCheckUsername = useCallback(
    debounce(async (username) => {
      if (!username) {
        setCheckingUsername(false);
        return;
      }
      
      setCheckingUsername(true);
      try {
        const q = query(collection(db, "users"), where("username", "==", username));
        const snap = await getDocs(q);
        if (!snap.empty) {
          toast.error("Username already in use");
        }
      } catch (error) {
        console.error("Error checking username:", error);
        // Don't show error toast for permission issues during live checking
        // The final check during signup will handle this
      }
      setCheckingUsername(false);
    }, 500),
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if username is already used (only if we have permission)
      try {
        const q = query(collection(db, "users"), where("username", "==", form.username));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          toast.error("Username already in use");
          return;
        }
      } catch (error) {
        console.error("Error checking username during signup:", error);
        // Continue with signup even if username check fails due to permissions
        // The user will be created and we'll handle duplicates at the database level
      }

      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        username: form.username,
        email: form.email,
        uid: user.uid,
        createdAt: new Date().toISOString()
      });

      toast.success("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Signup error:", error);
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use");
      } else if (error.code === "permission-denied") {
        toast.error("Database permission denied. Please check Firestore rules 🔒");
      } else {
        toast.error(error.message || "Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4E9] flex items-center justify-center px-4 py-12">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-60 p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold title-font text-[#3A3A3A]">Create Your Garden</h2>
          <p className="mt-2 text-[#6A752D]">Grow with mindfulness & peace</p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6A752D] text-[#3A3A3A]"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6A752D] text-[#3A3A3A]"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6A752D] text-[#3A3A3A]"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6A752D] text-[#3A3A3A]"
          />

          <button
            type="submit"
            disabled={checkingUsername}
            className="w-full py-3 px-4 bg-[#6A752D] text-white font-medium rounded-md hover:bg-[#5a6425] transition btn-hover"
          >
            {checkingUsername ? "Checking..." : "Sign Up"}
          </button>
        </form>

        <div className="text-sm text-center mt-4 text-[#6A752D]">
          Already have an account?{" "}
          <Link to="/login" className="underline font-medium hover:text-[#4e5622]">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
