import React from "react";
import Calendar from "./Calendar";
import Skills from "./Skills";
import AddAssignmentForm from "./AddAssignmentForm";
import AssignmentSubmission from "./AssignmentSubmission";
import TeacherAssignmentView from "./TeacherAssignmentView";

const Test = () => {
  const studentId = "library-test-student"; // Replace with actual student ID
  const teacherId = "zJaKLH70HLNk5cJnMCPK";
  return (
    <>
      <TeacherAssignmentView teacherId={teacherId} />
      {/* <AssignmentSubmission studentId={studentId} /> */}
      {/* <AddAssignmentForm studentId={studentId} /> */}
    </>
  );
};

export default Test;
