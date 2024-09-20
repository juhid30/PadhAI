import React, { useState, useEffect } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { db } from "../../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

// Function to get student details from Firestore
const getStudentDetails = async (studentId) => {
  try {
    const studentDocRef = doc(db, "Student", studentId);
    const studentSnapshot = await getDoc(studentDocRef);

    if (studentSnapshot.exists()) {
      return studentSnapshot.data(); // Return student data
    } else {
      console.error("No student found with the given ID");
      return null;
    }
  } catch (error) {
    console.error("Error fetching student details:", error);
    return null;
  }
};

// Function to get all assignments
const getAssignmentsForStudent = async () => {
  try {
    const assignmentsRef = collection(db, "AssignmentRecord");
    const querySnapshot = await getDocs(assignmentsRef); // Fetch all assignments
    
    // Create an array to store all assignments
    const allAssignments = [];
    querySnapshot.forEach((doc) => {
      allAssignments.push({ id: doc.id, ...doc.data() });
    });

    console.log("All Assignments: ", allAssignments); // Check all assignments
    return allAssignments;
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
};

function CalendarComponent() {
  const [events, setEvents] = useState([]); // State for calendar events

  useEffect(() => {
    const fetchAssignmentsAndStudentData = async () => {
      const studentId = localStorage.getItem("studentId"); // Get studentId from localStorage

      if (studentId) {
        try {
          // Fetch student details using the studentId
          const studentDetails = await getStudentDetails(studentId);
          if (studentDetails) {
            const studentYear = Number(studentDetails.year); // Convert student's year to a number
            console.log("Student Year: ", studentYear);

            // Fetch all assignments
            const allAssignments = await getAssignmentsForStudent();

            // Manually filter assignments based on the student's year
            const filteredAssignments = [];
            for (let i = 0; i < allAssignments.length; i++) {
              const assignment = allAssignments[i];
              if (Number(assignment.year) === studentYear) {
                // If the assignment's year matches the student's year, add it to the filtered array
                filteredAssignments.push({
                  title: assignment.topic,
                  start: assignment.dos.toDate().toISOString(), // Set start date to due date (assuming `dos` is a Firestore Timestamp)
                  end: assignment.dos.toDate().toISOString(),   // Set end date to due date (for simplicity)
                });
              }
            }

            console.log("Filtered Assignments: ", filteredAssignments);

            // Append filtered events to the events array
            setEvents([...filteredAssignments]); // Update events state with the filtered assignments
          }
        } catch (error) {
          console.error("Error fetching assignments or student details:", error);
        }
      }
    };

    fetchAssignmentsAndStudentData();
  }, []);

  return (
    <div className="w-full relative">
      <Fullcalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="100%"
        events={events} // Use the events state for calendar events
      />
    </div>
  );
}

function Calendar() {
  return (
    <div className="bg-white w-[92.5%] h-screen p-9 flex">
      <CalendarComponent />
    </div>
  );
}

export default Calendar;
