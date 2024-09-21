import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
import { doc, getDoc, collection, getDocs, setDoc } from "firebase/firestore";
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
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [expandedSection, setExpandedSection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchAssignmentsAndStudentData = async () => {
      const studentId = "library-test-student";
      // localStorage.getItem("studentId");

      if (studentId) {
        try {
          const studentDetails = await getStudentDetails(studentId);
          if (studentDetails) {
            const studentYear = Number(studentDetails.year);
            const allAssignments = await getAssignmentsForStudent();

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

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (assignmentId) => {
    setSelectedAssignment(assignmentId);
    toggleModal();
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const storageRef = ref(
        storage,
        `uploadedNotes/${selectedAssignment}_${file.name}`
      );
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const studentId = localStorage.getItem("studentId");
      const assignmentDocRef = doc(
        db,
        "SubmittedAssignments",
        selectedAssignment
      );

      const late = pendingAssignments.some(
        (assignment) => assignment.id === selectedAssignment
      )
        ? false
        : true;

      await setDoc(assignmentDocRef, {
        documentString: downloadURL,
        isSubmitted: true,
        submittedOn: new Date().toISOString(),
        isLate: late,
        studentId: studentId,
        assignmentId: selectedAssignment,
      });

      const newPending = pendingAssignments.filter(
        (assignment) => assignment.id !== selectedAssignment
      );
      const newPastDue = pastDueAssignments.filter(
        (assignment) => assignment.id !== selectedAssignment
      );
      console.log(newPending);
      const submittedAssignment = [
        ...pendingAssignments,
        ...pastDueAssignments,
      ].find((assignment) => assignment.id === selectedAssignment);

      setPendingAssignments(newPending);
      setPastDueAssignments(newPastDue);
      setSubmittedAssignments([...submittedAssignments, submittedAssignment]);

      setFile(null);
      toggleModal();
    } catch (error) {
      console.error("Error uploading file and updating Firestore:", error);
    }
  };

  return (
    <div className="p-6 bg-[#e0c6f6] rounded-lg shadow-md w-full overflow-hidden">
      {/* Pending Assignments */}
      <section className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer bg-[#6a5acd] text-white p-2 rounded-lg mb-2 transition duration-300 hover:bg-[#5a4bcd]"
          onClick={() => toggleSection("pending")}
        >
          <h2 className="text-lg font-semibold">Pending Assignments</h2>
          <span>{expandedSection === "pending" ? "▲" : "▼"}</span>
        </div>
        {expandedSection === "pending" && (
          <div
            style={{
              maxHeight: "120px",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
            className="flex flex-col space-y-4 scrollbar-hide"
          >
            {pendingAssignments.length > 0 ? (
              pendingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col"
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
                    className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded transition duration-300 hover:bg-indigo-700"
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
          className="flex justify-between items-center cursor-pointer bg-[#5b5ea6] text-white p-2 rounded-lg mb-2 transition duration-300 hover:bg-[#4b4e96]"
          onClick={() => toggleSection("pastDue")}
        >
          <h2 className="text-lg font-semibold">Past Due Assignments</h2>
          <span>{expandedSection === "pastDue" ? "▲" : "▼"}</span>
        </div>
        {expandedSection === "pastDue" && (
          <div
            style={{
              maxHeight: "120px",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
            className="flex flex-col space-y-4 scrollbar-hide"
          >
            {pastDueAssignments.length > 0 ? (
              pastDueAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col"
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
                    className="mt-2 bg-zinc-500 text-white py-2 px-4 rounded transition duration-300 hover:bg-zinc-600"
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
          className="flex justify-between items-center cursor-pointer bg-[#4e4f7d] text-white p-2 rounded-lg mb-2 transition duration-300 hover:bg-[#3e3e6d]"
          onClick={() => toggleSection("submitted")}
        >
          <h2 className="text-; font-semibold">Submitted Assignments</h2>
          <span>{expandedSection === "submitted" ? "▲" : "▼"}</span>
        </div>
        {expandedSection === "submitted" && (
          <div
            style={{
              maxHeight: "120px",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
            className="flex flex-col space-y-4 scrollbar-hide"
          >
            {submittedAssignments.length > 0 ? (
              submittedAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col"
                >
                  <h3 className="text-xl font-semibold">{assignment.topic}</h3>
                  <p>Subject: {assignment.subject}</p>
                  <p>
                    Submitted On:{" "}
                    {new Date(assignment.submittedOn).toLocaleDateString()}
                  </p>
                  <p>Status: {assignment.isLate ? "Late" : "On Time"}</p>
                </div>
              ))
            ) : (
              <p>No submitted assignments.</p>
            )}
          </div>
        )}
      </section>

      {/* Modal for file upload */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl mb-4">Upload Assignment</h2>
            <input type="file" onChange={handleFileChange} />
            <button
              onClick={handleUpload}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded transition duration-300 hover:bg-blue-700"
            >
              Upload
            </button>
            <button
              onClick={toggleModal}
              className="mt-2 bg-gray-300 text-black py-2 px-4 rounded transition duration-300 hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentSubmission;
