import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import SuccessModal from "./SuccessModal";

// Custom Button component
const Button = ({ children, onClick, disabled, className }) => (
  <button
    className={`px-4 py-2 rounded font-semibold ${
      disabled
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-indigo-600 text-white hover:bg-indigo-500"
    } ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

// Custom Checkbox component
const Checkbox = ({ checked, onChange, disabled }) => (
  <label className="inline-flex items-center">
    <input
      type="checkbox"
      className="form-checkbox h-5 w-5 text-indigo-600"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
  </label>
);

const InternshipFetch = () => {
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const studentId = "library-test-student"; // Adjust this as needed

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "InternshipListings"));
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
    if (!isCompareMode) {
      setSelectedInternship(internship);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInternship(null);
  };

  const handleClose = () => {
    setIsSuccessModal(false);
    setResponseData(null);
  };

  const applyToInternship = async () => {
    if (!resumeFile) {
      alert("Please upload your resume before applying.");
      return;
    }

    try {
      const resumeLink = resumeFile.name; // Adjust this after uploading to storage
      const applicationData = {
        studentId,
        internshipId: selectedInternship.id,
        resumeLink,
      };

      // Upload application data to Firestore
      const docRef = doc(collection(db, "AppliedToInternship"));
      await setDoc(docRef, applicationData);

      alert("Application submitted successfully!");
      setIsModalOpen(false);
      setResumeFile(null); // Optionally clear the uploaded resume file
    } catch (error) {
      console.error("Error applying for internship: ", error);
      alert("An error occurred while submitting your application. Please try again.");
    }
  };

  const toggleCompareMode = () => {
    setIsCompareMode(!isCompareMode);
    setSelectedForCompare([]);
  };

  const handleCompareSelect = (internship) => {
    setSelectedForCompare((prev) => {
      if (prev.find((i) => i.id === internship.id)) {
        return prev.filter((i) => i.id !== internship.id);
      }
      if (prev.length < 2) {
        return [...prev, internship];
      }
      return prev;
    });
  };

  const openCompareModal = () => {
    if (selectedForCompare.length === 2) {
      setShowCompareModal(true);
    }
  };

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    setResumeFile(file);
  };

  const CompareModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold text-indigo-900 mb-4">Compare Internships</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {selectedForCompare.map((internship) => (
            <div key={internship.id} className="border p-4 rounded">
              <h3 className="text-2xl font-semibold text-indigo-800 mb-2">
                {internship.title}
              </h3>
              <p className="mb-2"><strong>Company:</strong> {internship.companyName}</p>
              <p className="mb-2"><strong>Description:</strong> {internship.desc}</p>
              <p className="mb-2"><strong>Duration:</strong> {internship.duration}</p>
              <p className="mb-2"><strong>Last Date to Apply:</strong> {new Date(internship.lastDateToApply.seconds * 1000).toLocaleDateString()}</p>
              <p className="mb-2"><strong>Stipend:</strong> {internship.salary}</p>
            </div>
          ))}
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
          <input
            type="file"
            onChange={handleResumeUpload}
            accept=".pdf,.doc,.docx"
            className="mb-2"
          />
          {resumeFile && (
            <p className="text-sm text-green-600">File selected: {resumeFile.name}</p>
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <Button onClick={applyToInternship} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Comparison"}
          </Button>
          <Button
            onClick={() => setShowCompareModal(false)}
            className="bg-gray-300 text-gray-700 hover:bg-gray-400"
            disabled={isSubmitting}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-6xl font-bold text-indigo-800">INTERNSHIPS</h1>
        <Button onClick={toggleCompareMode}>
          {isCompareMode ? "Cancel Compare" : "Compare"}
        </Button>
      </div>

      <hr className="border-t-1 border-indigo-300 mb-9" />

      {isCompareMode && (
        <div className="mb-4">
          <Button
            onClick={openCompareModal}
            disabled={selectedForCompare.length !== 2}
          >
            Compare Selected ({selectedForCompare.length}/2)
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {internships.map((internship) => (
          <div
            className="border border-indigo-200 rounded-lg shadow-lg p-6 bg-indigo-50 transition-transform transform hover:scale-105 cursor-pointer relative"
            key={internship.id}
            onClick={() => openModal(internship)}
          >
            {isCompareMode && (
              <div
                className="absolute top-2 right-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={selectedForCompare.some((i) => i.id === internship.id)}
                  onChange={() => handleCompareSelect(internship)}
                  disabled={
                    selectedForCompare.length === 2 &&
                    !selectedForCompare.some((i) => i.id === internship.id)
                  }
                />
              </div>
            )}
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
            <p className="mb-2"><strong>Company:</strong> {selectedInternship.companyName}</p>
            <p className="mb-2"><strong>Description:</strong> {selectedInternship.desc}</p>
            <p className="mb-2"><strong>Duration:</strong> {selectedInternship.duration}</p>
            <p className="mb-2"><strong>Last Date to Apply:</strong> {new Date(selectedInternship.lastDateToApply.seconds * 1000).toLocaleDateString()}</p>
            <p className="mb-2"><strong>Stipend:</strong> {selectedInternship.salary}</p>

            <input
              type="file"
              onChange={handleResumeUpload}
              accept=".pdf,.doc,.docx"
              className="mb-4"
            />
            {resumeFile && (
              <p className="text-sm text-green-600">File selected: {resumeFile.name}</p>
            )}
            <div className="flex justify-end space-x-4">
              <Button onClick={applyToInternship} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Apply"}
              </Button>
              <Button onClick={closeModal} className="bg-gray-300 text-gray-700 hover:bg-gray-400">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {showCompareModal && <CompareModal />}

      {isSuccessModal && (
        <SuccessModal
          onClose={handleClose}
          data={responseData}
        />
      )}
    </div>
  );
};

export default InternshipFetch;
