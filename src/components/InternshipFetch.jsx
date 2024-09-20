import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

// Custom Button component
const Button = ({ children, onClick, disabled, className }) => (
  <button
    className={`px-4 py-2 rounded font-semibold ${
      disabled
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-indigo-600 text-white hover:bg-indigo-500'
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

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'InternshipListings'));
        const internshipsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
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

  const toggleCompareMode = () => {
    setIsCompareMode(!isCompareMode);
    setSelectedForCompare([]);
  };

  const handleCompareSelect = (internship) => {
    setSelectedForCompare(prev => {
      if (prev.find(i => i.id === internship.id)) {
        return prev.filter(i => i.id !== internship.id);
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

  const CompareModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-indigo-900 mb-4">Compare Internships</h2>
        <div className="grid grid-cols-2 gap-4">
          {selectedForCompare.map((internship, index) => (
            <div key={internship.id} className="border p-4 rounded">
              <h3 className="text-2xl font-semibold text-indigo-800 mb-2">{internship.title}</h3>
              <p className="mb-2"><strong>Company:</strong> {internship.companyName}</p>
              <p className="mb-2"><strong>Description:</strong> {internship.desc}</p>
              <p className="mb-2"><strong>Duration:</strong> {internship.duration}</p>
              <p className="mb-2"><strong>Last Date to Apply:</strong> {new Date(internship.lastDateToApply.seconds * 1000).toLocaleDateString()}</p>
              <p className="mb-2"><strong>Stipend:</strong> {internship.salary}</p>
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={() => setShowCompareModal(false)}>Close</Button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-6xl font-bold text-indigo-800">INTERNSHIPS</h1>
        <Button onClick={toggleCompareMode}>
          {isCompareMode ? 'Cancel Compare' : 'Compare'}
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
        {internships.map(internship => (
          <div
            className="border border-indigo-200 rounded-lg shadow-lg p-6 bg-indigo-50 transition-transform transform hover:scale-105 cursor-pointer relative"
            key={internship.id}
            onClick={() => openModal(internship)}
          >
            {isCompareMode && (
              <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedForCompare.some(i => i.id === internship.id)}
                  onChange={() => handleCompareSelect(internship)}
                  disabled={selectedForCompare.length === 2 && !selectedForCompare.some(i => i.id === internship.id)}
                />
              </div>
            )}
            <h3 className="text-4xl font-semibold text-indigo-800 mb-2">{internship.title}</h3>
            <p className="text-gray-700 mb-5 text-xl"><strong>Company:</strong> {internship.companyName}</p>
            <p className="text-indigo-500 text-lg font-semibold"><strong>Stipend offered:</strong> {internship.salary}</p>
          </div>
        ))}
      </div>
      
      {isModalOpen && selectedInternship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-4xl font-bold text-indigo-900 mb-4">{selectedInternship.title}</h2>
            <p className="text-lg mb-2"><strong>Company:</strong> {selectedInternship.companyName}</p>
            <p className="text-lg mb-2"><strong>Description:</strong> {selectedInternship.desc}</p>
            <p className="text-lg mb-2"><strong>Duration:</strong> {selectedInternship.duration}</p>
            <p className="text-lg mb-2"><strong>Last Date to Apply:</strong> {new Date(selectedInternship.lastDateToApply.seconds * 1000).toLocaleDateString()}</p>
            <p className="text-lg mb-4"><strong>Stipend:</strong> {selectedInternship.salary}</p>
            
            <Button 
              className="bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
              onClick={() => alert('Apply functionality not implemented yet')}
            >
              Apply
            </Button>
            <Button className="ml-4 bg-gray-300 text-gray-700 hover:bg-gray-400" onClick={closeModal}>
              Close
            </Button>
          </div>
        </div>
      )}

      {showCompareModal && <CompareModal />}
    </div>
  );
};

export default InternshipFetch;