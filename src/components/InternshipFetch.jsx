import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

// SuccessModal Component
const SuccessModal = ({ data, onClose }) => {
  if (!data) return null;

  const isApplicationSuccess = typeof data === 'string';

  if (isApplicationSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full overflow-y-auto">
          <h2 className="text-3xl font-bold text-indigo-900 mb-4">
            Application Submitted
          </h2>
          <p className="mb-6">{data}</p>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { job_comparison, recommendation } = data;
  const job1 = job_comparison?.job1 || {};
  const job2 = job_comparison?.job2 || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold text-indigo-900 mb-4">
          Comparison Results
        </h2>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-indigo-800 mb-2">Job 1</h3>
          <p className="mb-2">
            <strong>Key Qualifications and Experience:</strong>{" "}
            {job1.key_qualifications_and_experience || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Potential Gaps or Areas for Exploration:</strong>{" "}
            {job1.potential_gaps_or_areas_for_exploration || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Summary:</strong> {job1.summary || "N/A"}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-indigo-800 mb-2">Job 2</h3>
          <p className="mb-2">
            <strong>Key Qualifications and Experience:</strong>{" "}
            {job2.key_qualifications_and_experience || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Potential Gaps or Areas for Exploration:</strong>{" "}
            {job2.potential_gaps_or_areas_for_exploration || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Summary:</strong> {job2.summary || "N/A"}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-indigo-800 mb-2">
            Recommendation
          </h3>
          <p className="mb-2">
            <strong>Better Fit:</strong> {recommendation?.better_fit || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Reason:</strong> {recommendation?.reason || "N/A"}
          </p>
        </div>

        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

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

// Main InternshipFetch Component
const InternshipFetch = () => {
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);

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
    console.log("Closing SuccessModal"); // Debug log
    setIsSuccessModal(false);
    setResponseData(null);
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

  const handleSubmitComparison = async () => {
    setIsSubmitting(true);
    const studentId = "library-test-student";
    try {
      const studentDoc = await getDoc(doc(db, "Student", studentId));
      if (studentDoc.exists()) {
        const studentData = studentDoc.data();
        const resumeAnalysis = studentData.resume_analysis;

        const formData = new FormData();
        formData.append("resume_analysis", resumeAnalysis);

        if (selectedForCompare.length === 2) {
          formData.append("job1", selectedForCompare[0]["desc"]);
          formData.append("job2", selectedForCompare[1]["desc"]);

          const response = await fetch("http://localhost:5000/compare_jobs", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const result = await response.json();
            console.log("Comparison result:", result); // Debug log
            setResponseData(result.response);
            setIsSuccessModal(true);
            console.log("isSuccessModal set to true"); // Debug log
            setShowCompareModal(false);
            setSelectedForCompare([]);
          } else {
            const errorData = await response.json();
            console.error("Error response:", errorData);
            alert(`Error: ${errorData.message}`);
          }
        }
      } else {
        alert("Student data not found.");
      }
    } catch (error) {
      console.error("Error fetching resume analysis:", error);
      alert("An error occurred while fetching resume analysis. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApply = async () => {
    setIsSubmitting(true);
    try {
      // Here you would typically send an application to your backend
      // For now, we'll just simulate a successful application
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResponseData("Your application has been submitted successfully!");
      setIsSuccessModal(true);
      closeModal();
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("An error occurred while submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              <p className="mb-2">
                <strong>Last Date to Apply:</strong>{" "}
                {new Date(internship.lastDateToApply.seconds * 1000).toLocaleDateString()}
              </p>
              <p className="mb-2"><strong>Stipend:</strong> {internship.salary}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-4">
          <Button onClick={handleSubmitComparison} disabled={isSubmitting}>
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
                    !selectedForCompare.find((i) => i.id === internship.id)
                  }
                />
              </div>
            )}
            <h2 className="text-2xl font-semibold text-indigo-900 mb-2">
              {internship.title}
            </h2>
            <p className="text-indigo-700 mb-2">
              <strong>Company:</strong> {internship.companyName}
            </p>
            <p className="text-indigo-700">
              <strong>Duration:</strong> {internship.duration}
            </p>
          </div>
        ))}
      </div>

      {isModalOpen && selectedInternship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-indigo-900 mb-4">
              {selectedInternship.title}
            </h2>
            <p className="mb-4">
              <strong>Company:</strong> {selectedInternship.companyName}
            </p>
            <p className="mb-4">
              <strong>Description:</strong> {selectedInternship.desc}
            </p>
            <p className="mb-4">
              <strong>Duration:</strong> {selectedInternship.duration}
            </p>
            <p className="mb-4">
              <strong>Last Date to Apply:</strong>{" "}
              {new Date(
                selectedInternship.lastDateToApply.seconds * 1000
              ).toLocaleDateString()}
            </p>
            <p className="mb-4">
              <strong>Stipend:</strong> {selectedInternship.salary}
            </p>
            <div className="flex justify-end space-x-4">
            <Button onClick={handleApply} disabled={isSubmitting}>
                {isSubmitting ? "Applying..." : "Apply"}
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
        <div>
          <SuccessModal data={responseData} onClose={handleClose} />
        </div>
      )}
      
      {/* Debug section */}
      
    </div>
  );
};

export default InternshipFetch;
                