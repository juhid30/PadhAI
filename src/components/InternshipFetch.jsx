import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Adjusted the import for Firestore from your firebase.js file

const InternshipFetch = () => {
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null); // State for selected internship
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "InternshipListings")
        );
        const internshipsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInternships(internshipsData);
      } catch (error) {
        console.error("Error fetching internship listings: ", error);
      }
    };

    fetchInternships();
  }, []);

  const openModal = (internship) => {
    setSelectedInternship(internship);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInternship(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-6xl font-bold mb-4 text-indigo-800">INTERNSHIPS</h1>
      <hr className="border-t-1 border-indigo-300 mb-9" />{" "}
      {/* Horizontal line separator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {internships.map((internship) => (
          <div
            className="border border-indigo-200 rounded-lg shadow-lg p-6 bg-indigo-50 transition-transform transform hover:scale-105 cursor-pointer"
            key={internship.id}
            onClick={() => openModal(internship)} // Open modal on click
          >
            <h3 className="text-4xl font-semibold text-indigo-800 mb-2">
              {internship.title}
            </h3>
            <p className="text-gray-700 mb-5 text-xl">
              <strong>Company:</strong> {internship.companyName}
            </p>
            <p className="text-indigo-500 text-lg font-semibold">
              <strong>Stipend offered:</strong> {internship.salary}
            </p>
          </div>
        ))}
      </div>
      {isModalOpen && selectedInternship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-4xl font-bold text-indigo-900 mb-4">
              {selectedInternship.title}
            </h2>
            <p className="text-lg mb-2">
              <strong>Company:</strong> {selectedInternship.companyName}
            </p>
            <p className="text-lg mb-2">
              <strong>Description:</strong> {selectedInternship.desc}
            </p>
            <p className="text-lg mb-2">
              <strong>Duration:</strong> {selectedInternship.duration}
            </p>
            <p className="text-lg mb-2">
              <strong>Last Date to Apply:</strong>{" "}
              {new Date(
                selectedInternship.lastDateToApply.seconds * 1000
              ).toLocaleDateString()}
            </p>
            <p className="text-lg mb-4">
              <strong>Stipend:</strong> {selectedInternship.salary}
            </p>

            <button
              className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500 transition-colors"
              onClick={() => alert("Apply functionality not implemented yet")} // Apply button functionality placeholder
            >
              Apply
            </button>
            <button
              className="ml-4 text-gray-600 hover:text-gray-800"
              onClick={closeModal} // Close modal
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipFetch;
