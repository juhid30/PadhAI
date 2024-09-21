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

// Function to get events from EventScheduling collection
const getEvents = async () => {
  try {
    const eventsRef = collection(db, "EventScheduling");
    const querySnapshot = await getDocs(eventsRef);

    const allEvents = [];
    querySnapshot.forEach((doc) => {
      allEvents.push({ id: doc.id, ...doc.data() });
    });

    return allEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export function CalendarComponent() {
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

            // Fetch all assignments
            const allAssignments = await getAssignmentsForStudent();

            // Filter assignments based on the student's year
            const filteredAssignments = allAssignments
              .filter((assignment) => Number(assignment.year) === studentYear)
              .map((assignment) => ({
                title: assignment.topic,
                start: assignment.dos.toDate().toISOString(), // Set start date to due date
                end: assignment.dos.toDate().toISOString(), // Set end date to due date
              }));

            // Fetch events from EventScheduling
            const allEvents = await getEvents();

            // Append events to the events array
            const filteredEvents = allEvents.map((event) => ({
              title: event.title,
              start: event.start,
              end: event.end,
            }));

            // Update events state with filtered assignments and events
            setEvents([...filteredAssignments, ...filteredEvents]);
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

  return (
    <div className="w-full h-full relative">
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
    <div className="bg-white w-[92.5%] h-screen p-9 flex w-[100%]">
      <CalendarComponent />
    </div>
  );
}

export default Calendar;
