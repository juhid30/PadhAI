// src/utils/firestoreUtils.js
import { db } from "../firebase"; // Adjust the import based on your Firebase configuration

// Function to add assignment for a specific student
export const addAssignmentForStudent = async (assignmentData, studentId) => {
  try {
    const assignmentRecordRef = db
      .collection("AssignmentRecord")
      .doc("LxK4DMA7H48z4mrND6zQ");

    const doc = await assignmentRecordRef.get();
    if (doc.exists) {
      const data = doc.data();
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

      await assignmentRecordRef.update({
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
  const assignmentRecordRef = db
    .collection("AssignmentRecord")
    .doc("LxK4DMA7H48z4mrND6zQ");

  const doc = await assignmentRecordRef.get();
  if (doc.exists) {
    const data = doc.data();
    let studentAssignments = data.students[studentId];

    if (studentAssignments && studentAssignments[assignmentIndex]) {
      studentAssignments[assignmentIndex].hasSubmitted = true;
      studentAssignments[assignmentIndex].dos = new Date();

      await assignmentRecordRef.update({
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
