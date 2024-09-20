// src/utils/firestoreUtils.js
// import { doc, getDoc, updateDoc } from "firebase/firestore"; // Import necessary functions
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase"; // Import Firestore database instance from your config

// Function to add assignment for a specific student
export const addAssignmentForStudent = async (assignmentData, studentId) => {
  try {
    const assignmentRecordRef = doc(
      db,
      "AssignmentRecord",
      "LxK4DMA7H48z4mrND6zQ"
    );

    const docSnap = await getDoc(assignmentRecordRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      let studentAssignments = data.students[studentId] || [];

      studentAssignments.push({
        doa: assignmentData.doa,
        docURL: assignmentData.docURL,
        dos: assignmentData.dos,
        hasSubmitted: false,
        subject: assignmentData.subject,
        teacherId: assignmentData.teacherId,
        topic: assignmentData.topic,
      });

      // Update the specific student's assignments
      await updateDoc(assignmentRecordRef, {
        [`students.${studentId}`]: studentAssignments,
      });

      console.log("Assignment added successfully for student:", studentId);
    } else {
      console.error("No such document!");
    }
  } catch (error) {
    console.error("Error adding assignment:", error);
  }
};

// Function to mark assignment as submitted for a student
export const markAssignmentAsSubmitted = async (studentId, assignmentIndex) => {
  const assignmentRecordRef = doc(
    db,
    "AssignmentRecord",
    "LxK4DMA7H48z4mrND6zQ"
  );

  const docSnap = await getDoc(assignmentRecordRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    let studentAssignments = data.students[studentId];

    if (studentAssignments && studentAssignments[assignmentIndex]) {
      studentAssignments[assignmentIndex].hasSubmitted = true;
      studentAssignments[assignmentIndex].dos = new Date();

      await updateDoc(assignmentRecordRef, {
        [`students.${studentId}`]: studentAssignments,
      });

      console.log(
        "Assignment submission updated successfully for student:",
        studentId
      );
    } else {
      console.error("Assignment not found for the student!");
    }
  } else {
    console.error("No such document!");
  }
};

export const getStudentAssignments = async (studentId) => {
  const assignmentRecordDoc = doc(
    db,
    "AssignmentRecord",
    "LxK4DMA7H48z4mrND6zQ"
  ); // Access the document containing all students
  const docSnapshot = await getDoc(assignmentRecordDoc); // Fetch the document

  if (docSnapshot.exists()) {
    const data = docSnapshot.data();
    const studentAssignments = data.students[studentId]; // Access assignments for the specific student

    if (studentAssignments) {
      return studentAssignments; // Return the student's assignment array
    } else {
      console.error("No assignments found for this student");
      return [];
    }
  } else {
    console.error("AssignmentRecord document does not exist");
    return [];
  }
};
export const submitAssignmentAnswer = async (studentId, index, ansDocURL) => {
  const assignmentRecordDoc = doc(
    db,
    "AssignmentRecord",
    "LxK4DMA7H48z4mrND6zQ"
  );

  try {
    const docSnapshot = await getDoc(assignmentRecordDoc);

    if (!docSnapshot.exists()) {
      console.log("No such document!");
      return;
    }

    const data = docSnapshot.data(); // Get the document data

    if (
      data.students &&
      data.students[studentId] &&
      data.students[studentId][index]
    ) {
      // Update hasSubmitted and add ansDocURL
      data.students[studentId][index].hasSubmitted = true; // Set hasSubmitted to true
      data.students[studentId][index].ansDocURL = ansDocURL; // Set the ansDocURL

      // Now update the document in Firestore
      await setDoc(assignmentRecordDoc, data);
      console.log("Document updated successfully.");
    } else {
      console.log("Student ID or index not found.");
    }
  } catch (error) {
    console.error("Error submitting assignment answer: ", error);
    throw error;
  }
};

// Fetch all assignments
export const getAssignments = async () => {
  try {
    const assignmentsCollection = collection(db, "assignments"); // Replace 'assignments' with your Firestore collection name
    const assignmentsSnapshot = await getDocs(assignmentsCollection);

    const assignments = assignmentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return assignments;
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
};

// Fetch submissions for a specific assignment
export const getStudentSubmissions = async (assignmentId) => {
  try {
    const submissionsQuery = query(
      collection(db, "submissions"), // Replace 'submissions' with your Firestore collection name for submissions
      where("assignmentId", "==", assignmentId) // Assuming you have assignmentId in your submission document
    );
    const submissionsSnapshot = await getDocs(submissionsQuery);

    const submissions = submissionsSnapshot.docs.map((doc) => ({
      studentId: doc.id, // Assuming the document ID is the student ID
      ...doc.data(),
    }));

    return submissions;
  } catch (error) {
    console.error("Error fetching student submissions:", error);
    return [];
  }
};

// Fetch all assignments for a specific teacher
export const getAssignmentsForTeacher = async (teacherId) => {
  if (!teacherId) {
    console.error("Teacher ID is undefined");
    return []; // Return an empty array if teacherId is invalid
  }

  const assignmentRecordDoc = doc(
    db,
    "AssignmentRecord",
    "LxK4DMA7H48z4mrND6zQ"
  );

  try {
    const docSnapshot = await getDoc(assignmentRecordDoc);

    if (!docSnapshot.exists()) {
      console.log("No such document!");
      return;
    }

    const data = docSnapshot.data().students;
    // Convert data to an array of student objects
    console.log(data);
    const assignments = [];

    // Iterate through each student's assignments
    Object.entries(data).forEach(([student, studentAssignments]) => {
      // Check if the studentAssignments is an array
      if (Array.isArray(studentAssignments)) {
        const filteredAssignments = studentAssignments.filter(
          (assignment) => assignment.teacherId === teacherId
        );
        assignments.push(...filteredAssignments);
      }
    });

    console.log(assignments);
    return assignments;
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
};

// Fetch students who have submitted assignments for a specific topic
export const getSubmissionsByTopic = async (topic) => {
  const assignmentRecordRef = doc(
    db,
    "AssignmentRecord",
    "LxK4DMA7H48z4mrND6zQ"
  );

  try {
    const docSnapshot = await getDoc(assignmentRecordRef);

    if (!docSnapshot.exists()) {
      console.error("No such document!");
      return [];
    }

    const data = docSnapshot.data().students;
    const submissions = [];

    // Iterate through each student's assignments
    for (const [studentId, studentAssignments] of Object.entries(data)) {
      if (Array.isArray(studentAssignments)) {
        const matchedAssignments = studentAssignments.filter(
          (assignment) => assignment.topic === topic && assignment.hasSubmitted
        );

        // If there are matched assignments, add to submissions
        if (matchedAssignments.length > 0) {
          submissions.push({
            studentId,
            assignments: matchedAssignments,
          });
        }
      }
    }

    console.log("Submissions found for topic:", topic, submissions);
    return submissions;
  } catch (error) {
    console.error("Error fetching submissions by topic:", error);
    return [];
  }
};
