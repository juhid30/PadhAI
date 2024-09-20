import React, { useState } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function Calendar() {
  return (
    <div className="bg-[] w-[92.5%] h-full p-9 flex">
      <CalendarComponent />
    </div>
  );
}

export default Calendar;

function CalendarComponent() {
  const [popup, setPopup] = useState({
    visible: false,
    event: null,
    position: { top: 0, left: 0 },
  });

  let events = [
    {
      title: "Math Exam",
      start: "2024-09-04T15:00:00",
      end: "2024-09-04T17:20:00",
      description: "This is a math exam.",
    },
    {
      title: "Science Fair",
      start: "2024-09-10T09:00:00",
      end: "2024-09-10T12:00:00",
      description: "This is a science fair.",
    },
  ];

  // Handle mouse enter to show the popup near the event
  const handleMouseEnter = (info) => {
    const rect = info.el.getBoundingClientRect(); // Get the event's position on screen
    setPopup({
      visible: true,
      event: info.event,
      position: {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      },
    });
  };

  // Handle mouse leave to hide the popup
  const handleMouseLeave = () => {
    setPopup({ visible: false, event: null, position: { top: 0, left: 0 } });
  };

  return (
    <div className="w-[100%] relative">
      <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"} // Show month view with days
        headerToolbar={{
          start: "today prev,next", // Navigation buttons on the left
          center: "title", // Title in the center
          end: "dayGridMonth,timeGridWeek,timeGridDay", // View selection on the right
        }}
        height={"100%"}
        events={events}
        eventTimeFormat={{
          hour: "2-digit", // Show hour with two digits
          minute: "2-digit", // Show minutes with two digits
          meridiem: "short", // Show AM/PM
        }} // Ensure the time is displayed in events
        eventMouseEnter={handleMouseEnter} // Show popup on hover
        eventMouseLeave={handleMouseLeave} // Hide popup when mouse leaves
      />

      {popup.visible && (
        <div
          style={{
            position: "absolute",
            top: popup.position.top + 1, // Adjust to position below the event
            left: popup.position.left,
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "10px",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3>{popup.event.title}</h3>
          <p>{popup.event.extendedProps.description}</p>
          <p>
            Start: {new Date(popup.event.start).toLocaleString()}
            <br />
            End: {new Date(popup.event.end).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
