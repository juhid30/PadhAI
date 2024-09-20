import React, { useState } from "react";
import ResumeUpload from "./ResumeUpload"; // Import ResumeUpload component
import FillDetails from "./FillDetails"; // Import FillDetails component

const CompulsoryModal = () => {
  const [view, setView] = useState("default"); // 'default', 'resume', or 'details'

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        {view === "resume" ? (
          <ResumeUpload />
        ) : view === "details" ? (
          <FillDetails />
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">
              Select an Option
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                className="p-6 border-2 border-transparent hover:border-blue-500 rounded-lg transition-all duration-300 cursor-pointer shadow-md"
                onClick={() => setView("resume")}
              >
                <h3 className="text-xl font-semibold mb-4">
                  Upload Your Resume
                </h3>
                <p className="text-gray-600">
                  Upload your existing resume for us to analyze.
                </p>
              </div>
              <div
                className="p-6 border-2 border-transparent hover:border-blue-500 rounded-lg transition-all duration-300 cursor-pointer shadow-md"
                onClick={() => setView("details")}
              >
                <h3 className="text-xl font-semibold mb-4">
                  Fill in Your Details
                </h3>
                <p className="text-gray-600">
                  Provide your details manually to create a profile.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompulsoryModal;
