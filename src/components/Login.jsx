import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "../../firebase.js";
import { FaGoogle } from "react-icons/fa";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ResumeUpload from "./ResumeUpload.jsx";

const Login = () => {
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState("Student");
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store selected role in local storage
      localStorage.setItem("userRole", role);

      if (role === "Student") {
        const studentQuery = query(
          collection(db, "studentData"),
          where("email", "==", user.email)
        );
        const studentQuerySnapshot = await getDocs(studentQuery);

        if (!studentQuerySnapshot.empty) {
          const docId = studentQuerySnapshot.docs[0].id;
          localStorage.setItem("studentDocId", docId);
          navigate("/upload-resume");
        } else {
          setShowModal(true);
        }
      } else if (role === "Teacher") {
        const teacherQuery = query(
          collection(db, "Teacher"),
          where("email", "==", user.email)
        );
        const teacherQuerySnapshot = await getDocs(teacherQuery);

        if (!teacherQuerySnapshot.empty) {
          const docId = teacherQuerySnapshot.docs[0].id;
          localStorage.setItem("teacherId", docId);
        } else {
          const newTeacher = await addDoc(collection(db, "Teacher"), {
            email: user.email,
            name: user.displayName,
          });
          localStorage.setItem("teacherId", newTeacher.id);
        }
      } else if (role === "Librarian") {
        const librarianQuery = query(
          collection(db, "Librarian"),
          where("email", "==", user.email)
        );
        const librarianQuerySnapshot = await getDocs(librarianQuery);

        if (!librarianQuerySnapshot.empty) {
          const docId = librarianQuerySnapshot.docs[0].id;
          localStorage.setItem("librarianId", docId);
        } else {
          const newLibrarian = await addDoc(collection(db, "Librarian"), {
            email: user.email,
            name: user.displayName,
          });
          localStorage.setItem("librarianId", newLibrarian.id);
        }
      }
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 w-full">
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full h-[70vh]">
            <ResumeUpload />
          </div>
        </div>
      )}
      <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Sign In</h2>

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

        <input
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
          type="email"
          placeholder="Email address"
        />

        <input
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
          type="password"
          placeholder="Password"
        />

        <div className="flex justify-between items-center w-full mb-6">
          <label className="flex items-center text-sm text-gray-600">
            <input type="checkbox" className="mr-2" />
            Remember me
          </label>
          <a href="#!" className="text-sm text-gray-500 hover:underline">
            Forgot password?
          </a>
        </div>

        <button
          className="w-full py-2 mb-4 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition duration-300"
          onClick={signInWithGoogle}
        >
          Sign in with Google <FaGoogle className="ml-2" />
        </button>

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
