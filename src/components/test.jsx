import React from "react";
import Calendar from "./Calendar";
import AddAssignmentForm from "./AddAssignmentForm";

const Test = () => {
  const studentId = "library-test-student"; // Replace with actual student ID

  return (
    <>
      <div className="h-screen">
        jhg hgfg
        <AddAssignmentForm studentId={studentId} />
        {/* <Calendar /> */}
      </div>
    </>
  );
};

export default Test;
