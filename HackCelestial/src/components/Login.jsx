import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "../../firebase.js";
import { FaGoogle } from "react-icons/fa";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  const [showModal, setShowModal] = useState(false); // Modal state
  const [role, setRole] = useState("Student"); // Role state
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (role === "Student") {
        // Student login logic
        const studentQuery = query(
          collection(db, "Student"),
          where("email", "==", user.email)
        );
        const studentQuerySnapshot = await getDocs(studentQuery);

        if (!studentQuerySnapshot.empty) {
          // Student exists
          const docId = studentQuerySnapshot.docs[0].id;
          console.log("Student DocID: ", docId);
          localStorage.setItem("studentDocId", docId);
          localStorage.setItem("studentRole", role);
          navigate("/");
          setUser(user);
        } else {
          // Student doesn't exist, ask for resume upload
          setUser(user);
          setShowModal(true);
        }
      } else if (role === "Teacher") {
        // Teacher login logic
        const teacherQuery = query(
          collection(db, "Teacher"),
          where("email", "==", user.email)
        );
        const teacherQuerySnapshot = await getDocs(teacherQuery);

        if (!teacherQuerySnapshot.empty) {
          // Teacher exists
          const docId = teacherQuerySnapshot.docs[0].id;
          console.log("Teacher DocID: ", docId);
          localStorage.setItem("teacherDocId", docId);
          setUser(user);
        } else {
          // Teacher doesn't exist, create a new teacher document
          const newTeacher = await addDoc(collection(db, "teacherData"), {
            email: user.email,
            name: user.displayName,
            subjects: [],
          });
          console.log("New Teacher created with DocID: ", newTeacher.id);
          localStorage.setItem("teacherDocId", newTeacher.id);
          localStorage.setItem("studentRole", role);
          setUser(user);
        }
      } else if (role === "Librarian") {
        // Librarian login logic
        const librarianQuery = query(
          collection(db, "Librarian"),
          where("email", "==", user.email)
        );
        const librarianQuerySnapshot = await getDocs(librarianQuery);

        if (!librarianQuerySnapshot.empty) {
          // Librarian exists
          const docId = librarianQuerySnapshot.docs[0].id;
          console.log("Librarian DocID: ", docId);
          localStorage.setItem("librarianDocId", docId);
          setUser(user);
        } else {
          // Librarian doesn't exist, create a new librarian document
          const newLibrarian = await addDoc(collection(db, "librarianData"), {
            email: user.email,
            name: user.displayName,
            libraryBranch: "",
          });
          console.log("New Librarian created with DocID: ", newLibrarian.id);
          localStorage.setItem("librarianDocId", newLibrarian.id);
          localStorage.setItem("studentRole", role);
          setUser(user);
        }
      }
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (resume && auth.currentUser) {
      try {
        const newStudent = await addDoc(collection(db, "studentData"), {
          email: auth.currentUser.email,
          name: auth.currentUser.displayName,
          resume: resume.name,
        });

        console.log("New Student created with DocID: ", newStudent.id);
        localStorage.setItem("studentDocId", newStudent.id);
        setShowModal(false);
      } catch (error) {
        console.error("Error uploading resume: ", error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full h-[70vh]">
            <ResumeUpload />
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

        {/* Sign in with Google */}
        <button
          className="w-full py-2 mb-4 flex justify-center items-center bg-gray-800 text-white rounded-md hover:bg-gray-900 transition duration-300"
          onClick={signInWithGoogle}
        >
          <FaGoogle className="mr-3 h-5 w-5" />
          Sign in with Google
        </button>

        {/* Regular Sign in */}
        <button className="w-full py-2 mb-4 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition duration-300">
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
