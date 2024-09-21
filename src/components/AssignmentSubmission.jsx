import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
import { doc, getDoc, collection, getDocs, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
      const studentId = localStorage.getItem("studentId");

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
    <div className="p-4 bg-[#e0c6f6] rounded-lg shadow-md w-full overflow-hidden">
      <section className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer bg-[#6a5acd] text-white p-2 rounded-lg mb-2 transition duration-300 hover:bg-[#5a4bcd]"
          onClick={() => toggleSection("pending")}
        >
          <h2 className="text-lg font-semibold">Pending Assignments</h2>
          <span>{expandedSection === "pending" ? "▲" : "▼"}</span>
        </div>
        {expandedSection === "pending" && (
          <div className="max-h-24 overflow-auto flex flex-col space-y-2">
            {pendingAssignments.length > 0 ? (
              pendingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col"
                >
                  <h3 className="text-lg font-semibold">{assignment.topic}</h3>
                  <p className="text-sm">Subject: {assignment.subject}</p>
                  <p className="text-sm">
                    Due Date:{" "}
                    {assignment.dos
                      ? new Date(
                          assignment.dos.seconds * 1000
                        ).toLocaleDateString()
                      : "No due date"}
                  </p>
                  <button
                    onClick={() => handleSubmit(assignment.id)}
                    className="mt-2 bg-indigo-600 text-white py-1 px-2 rounded transition duration-300 hover:bg-indigo-700"
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

      <section className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer bg-[#5b5ea6] text-white p-2 rounded-lg mb-2 transition duration-300 hover:bg-[#4b4e96]"
          onClick={() => toggleSection("pastDue")}
        >
          <h2 className="text-lg font-semibold">Past Due Assignments</h2>
          <span>{expandedSection === "pastDue" ? "▲" : "▼"}</span>
        </div>
        {expandedSection === "pastDue" && (
          <div className="max-h-24 overflow-auto flex flex-col space-y-2">
            {pastDueAssignments.length > 0 ? (
              pastDueAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col"
                >
                  <h3 className="text-lg font-semibold">{assignment.topic}</h3>
                  <p className="text-sm">Subject: {assignment.subject}</p>
                  <p className="text-sm">
                    Due Date:{" "}
                    {assignment.dos
                      ? new Date(
                          assignment.dos.seconds * 1000
                        ).toLocaleDateString()
                      : "No due date"}
                  </p>
                  <button
                    onClick={() => handleSubmit(assignment.id)}
                    className="mt-2 bg-zinc-500 text-white py-1 px-2 rounded transition duration-300 hover:bg-zinc-600"
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

      <section className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer bg-[#4e4f7d] text-white p-2 rounded-lg mb-2 transition duration-300 hover:bg-[#3e3e6d]"
          onClick={() => toggleSection("submitted")}
        >
          <h2 className="text-lg font-semibold">Submitted Assignments</h2>
          <span>{expandedSection === "submitted" ? "▲" : "▼"}</span>
        </div>
        {expandedSection === "submitted" && (
          <div className="max-h-24 overflow-auto flex flex-col space-y-2">
            {submittedAssignments.length > 0 ? (
              submittedAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col"
                >
                  <h3 className="text-lg font-semibold">{assignment.topic}</h3>
                  <p className="text-sm">Subject: {assignment.subject}</p>
                  <p className="text-sm">
                    Submitted On: {assignment.submittedOn}
                  </p>
                  <p className="text-sm">
                    Status: {assignment.isLate ? "Late" : "On Time"}
                  </p>
                </div>
              ))
            ) : (
              <p>No submitted assignments.</p>
            )}
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold">Upload Assignment</h2>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-2 mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={handleUpload}
                className="bg-indigo-600 text-white py-1 px-2 rounded transition duration-300 hover:bg-indigo-700"
              >
                Upload
              </button>
              <button
                onClick={toggleModal}
                className="bg-red-600 text-white py-1 px-2 rounded transition duration-300 hover:bg-red-700 ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentSubmission;
