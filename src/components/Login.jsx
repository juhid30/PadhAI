import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Login = () => {
  const [showModal, setShowModal] = useState(false); // Modal state
  const [role, setRole] = useState("Student"); // Role state
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Function to save cookie and navigate to appropriate dashboard
  const handleSignIn = () => {
    const cookieValue = `userRole=${role}; path=/; max-age=${60 * 60 * 24}`; // Cookie valid for 1 day
    document.cookie = cookieValue;
    console.log("Signed in and cookie saved:", cookieValue);

    // Redirect based on role
    if (role === "Student") {
      navigate("/student-dashboard");
    } else if (role === "Teacher") {
      navigate("/teacher-dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 w-[100%]">
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full h-[70vh]">
            {/* ResumeUpload component here */}
          </div>
        </div>
      )}
      <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Sign In</h2>

        {/* Role Switch */}
        <div className="flex items-center justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l-full transition duration-300 ${
              role === "Student"
                ? "bg-black text-white"
                : "bg-gray-300 text-black"
            }`}
            onClick={() => setRole("Student")}
          >
            Student
          </button>
          <button
            className={`px-4 py-2 transition duration-300 ${
              role === "Teacher"
                ? "bg-black text-white"
                : "bg-gray-300 text-black"
            }`}
            onClick={() => setRole("Teacher")}
          >
            Teacher
          </button>
          <button
            className={`px-4 py-2 rounded-r-full transition duration-300 ${
              role === "Librarian"
                ? "bg-black text-white"
                : "bg-gray-300 text-black"
            }`}
            onClick={() => setRole("Librarian")}
          >
            Librarian
          </button>
        </div>

        {/* Email Input */}
        <input
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
          type="email"
          placeholder="Email address"
        />

        {/* Password Input */}
        <input
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
          type="password"
          placeholder="Password"
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex justify-between items-center w-full mb-6">
          <label className="flex items-center text-sm text-gray-600">
            <input type="checkbox" className="mr-2" />
            Remember me
          </label>
          <a href="#!" className="text-sm text-gray-500 hover:underline">
            Forgot password?
          </a>
        </div>

        {/* Regular Sign in */}
        <button
          className="w-full py-2 mb-4 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition duration-300"
          onClick={handleSignIn}
        >
          Sign in
        </button>

        {/* Register & Social Sign-up */}
        <div className="text-center w-full">
          <p className="text-sm text-gray-600 mb-2">
            Not a member?{" "}
            <a href="#!" className="text-gray-700 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
