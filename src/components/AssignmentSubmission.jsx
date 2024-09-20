import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Fetch student details based on the student ID
const getStudentDetails = async (studentId) => {
  try {
    const studentDocRef = doc(db, "Student", studentId);
    const studentSnapshot = await getDoc(studentDocRef);

    if (studentSnapshot.exists()) {
      return studentSnapshot.data();
    } else {
      console.error("No student found with the given ID");
      return null;
    }
  } catch (error) {
    console.error("Error fetching student details:", error);
    return null;
  }
};

// Fetch all assignments
const getAssignmentsForStudent = async () => {
  try {
    const assignmentsRef = collection(db, "AssignmentRecord");
    const querySnapshot = await getDocs(assignmentsRef);

    const allAssignments = [];
    querySnapshot.forEach((doc) => {
      allAssignments.push({ id: doc.id, ...doc.data() });
    });

    return allAssignments;
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
};

const AssignmentSubmission = () => {
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [pastDueAssignments, setPastDueAssignments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]); // New state for submitted assignments
  const [expandedSection, setExpandedSection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [file, setFile] = useState(null);

  // Fetch assignments and student data on component mount
  useEffect(() => {
    const fetchAssignmentsAndStudentData = async () => {
      const studentId = localStorage.getItem("studentId");

      if (studentId) {
        try {
          const studentDetails = await getStudentDetails(studentId);
          if (studentDetails) {
            const studentYear = Number(studentDetails.year);
            const allAssignments = await getAssignmentsForStudent();

            // Filter assignments for the student's year
            const filteredAssignments = allAssignments.filter(
              (assignment) => Number(assignment.year) === studentYear
            );

            const today = Math.round(new Date().getTime() / 1000);

            const pending = [];
            const pastDue = [];

            filteredAssignments.forEach((assignment) => {
              const dueDate = assignment.dos.seconds;
              if (today < dueDate) {
                pending.push(assignment);
              } else {
                pastDue.push(assignment);
              }
            });

            setPendingAssignments(pending);
            setPastDueAssignments(pastDue);
          }
        } catch (error) {
          console.error(
            "Error fetching assignments or student details:",
            error
          );
        }
      }
    };

    fetchAssignmentsAndStudentData();
  }, []);

  // Toggle sections for Pending and Past Due assignments
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Toggle the file upload modal
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle assignment submission
  const handleSubmit = (assignmentId) => {
    setSelectedAssignment(assignmentId);
    toggleModal();
  };

  // Handle file upload and Firestore update
  const handleUpload = async () => {
    if (!file) return;

    try {
      // Create a storage reference in the 'uploadedNotes' bucket
      const storageRef = ref(
        storage,
        `uploadedNotes/${selectedAssignment}_${file.name}`
      );

      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, file);

      // Get the download URL of the uploaded file
      const downloadURL = await getDownloadURL(storageRef);

      console.log(`File uploaded successfully. File URL: ${downloadURL}`);

      // Fetch the student ID from localStorage
      const studentId = localStorage.getItem("studentId");

      // Update the Firestore document with assignmentId, studentId, file URL, and other fields
      console.log(selectedAssignment);
      const assignmentDocRef = doc(
        db,
        "SubmittedAssignments",
        selectedAssignment
      );

      const late = (await pendingAssignments.find(
        (assignment) => assignment.id === selectedAssignment
      ))
        ? false
        : true;

      await setDoc(assignmentDocRef, {
        documentString: downloadURL,
        isSubmitted: true,
        submittedOn: new Date().toISOString(), // Current date as ISO string
        isLate: late,
        studentId: studentId,
        assignmentId: selectedAssignment,
      });

      console.log("Firestore updated with assignment details.");

      // Move the submitted assignment from pending or past due to submitted
      const newPending = pendingAssignments.filter(
        (assignment) => assignment.id !== selectedAssignment
      );
      const newPastDue = pastDueAssignments.filter(
        (assignment) => assignment.id !== selectedAssignment
      );
      const submittedAssignment = [
        ...pendingAssignments,
        ...pastDueAssignments,
      ].find((assignment) => assignment.id === selectedAssignment);

      setPendingAssignments(newPending);
      setPastDueAssignments(newPastDue);
      setSubmittedAssignments([...submittedAssignments, submittedAssignment]);

      // Reset file and close the modal
      setFile(null);
      toggleModal();
    } catch (error) {
      console.error("Error uploading file and updating Firestore:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Assignment Dashboard</h1>

      {/* Pending Assignments */}
      <section className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer bg-blue-600 text-white p-4 rounded-lg mb-2 transition duration-300 hover:bg-blue-700"
          onClick={() => toggleSection("pending")}
        >
          <h2 className="text-2xl font-semibold">Pending Assignments</h2>
          <span>{expandedSection === "pending" ? "▲" : "▼"}</span>
        </div>
        {expandedSection === "pending" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingAssignments.length > 0 ? (
              pendingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  <h3 className="text-xl font-semibold">{assignment.topic}</h3>
                  <p>Subject: {assignment.subject}</p>
                  <p>
                    Date of Assignment:{" "}
                    {new Date(assignment.doa).toLocaleDateString()}
                  </p>
                  <p>
                    Due Date:{" "}
                    {assignment.dos
                      ? new Date(
                          assignment.dos.seconds * 1000
                        ).toLocaleDateString()
                      : "No due date"}
                  </p>
                  <button
                    onClick={() => handleSubmit(assignment.id)}
                    className="mt-2 bg-blue-600 text-white py-2 px-4 rounded transition duration-300 hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              ))
            ) : (
              <p>No pending assignments.</p>
            )}
          </div>
        )}
      </section>

      {/* Past Due Assignments */}
      <section className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer bg-red-600 text-white p-4 rounded-lg mb-2 transition duration-300 hover:bg-red-700"
          onClick={() => toggleSection("pastDue")}
        >
          <h2 className="text-2xl font-semibold">Past Due Assignments</h2>
          <span>{expandedSection === "pastDue" ? "▲" : "▼"}</span>
        </div>
        {expandedSection === "pastDue" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastDueAssignments.length > 0 ? (
              pastDueAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  <h3 className="text-xl font-semibold">{assignment.topic}</h3>
                  <p>Subject: {assignment.subject}</p>
                  <p>
                    Date of Assignment:{" "}
                    {new Date(assignment.doa).toLocaleDateString()}
                  </p>
                  <p>
                    Due Date:{" "}
                    {assignment.dos
                      ? new Date(
                          assignment.dos.seconds * 1000
                        ).toLocaleDateString()
                      : "No due date"}
                  </p>
                  <button
                    onClick={() => handleSubmit(assignment.id)}
                    className="mt-2 bg-red-600 text-white py-2 px-4 rounded transition duration-300 hover:bg-red-700"
                  >
                    Submit
                  </button>
                </div>
              ))
            ) : (
              <p>No past due assignments.</p>
            )}
          </div>
        )}
      </section>

      {/* Submitted Assignments */}
      <section className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer bg-green-600 text-white p-4 rounded-lg mb-2 transition duration-300 hover:bg-green-700"
          onClick={() => toggleSection("submitted")}
        >
          <h2 className="text-2xl font-semibold">Submitted Assignments</h2>
          <span>{expandedSection === "submitted" ? "▲" : "▼"}</span>
        </div>
        {expandedSection === "submitted" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {submittedAssignments.length > 0 ? (
              submittedAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  <h3 className="text-xl font-semibold">{assignment.topic}</h3>
                  <p>Subject: {assignment.subject}</p>
                  <p>
                    Date of Assignment:{" "}
                    {new Date(assignment.doa).toLocaleDateString()}
                  </p>
                  <p>
                    Due Date:{" "}
                    {assignment.dos
                      ? new Date(
                          assignment.dos.seconds * 1000
                        ).toLocaleDateString()
                      : "No due date"}
                  </p>
                </div>
              ))
            ) : (
              <p>No submitted assignments yet.</p>
            )}
          </div>
        )}
      </section>

      {/* File Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Upload Assignment</h3>
            <input type="file" onChange={handleFileChange} className="mb-4" />
            <div className="flex justify-end">
              <button
                onClick={toggleModal}
                className="mr-4 bg-gray-500 text-white py-2 px-4 rounded transition duration-300 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="bg-blue-600 text-white py-2 px-4 rounded transition duration-300 hover:bg-blue-700"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentSubmission;
