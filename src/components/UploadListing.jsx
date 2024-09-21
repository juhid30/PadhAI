import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
const UploadListing = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    desc: "",
    duration: "",
    lastDateToApply: "",
    salary: "",
    title: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "InternshipListings"), {
        companyName: formData.companyName,
        desc: formData.desc,
        duration: formData.duration,
        lastDateToApply: formData.lastDateToApply,
        salary: formData.salary,
        title: formData.title,
        postedAt: new Date(),
      });
      setSuccessMessage("Internship listing posted successfully!");
      setLoading(false);
      setFormData({
        companyName: "",
        desc: "",
        duration: "",
        lastDateToApply: "",
        salary: "",
        title: "",
      });
    } catch (error) {
      console.error("Error posting internship: ", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 w-[100%]">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Post New Internship
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-700"
              htmlFor="companyName"
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Deutsche Bank"
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-700"
              htmlFor="title"
            >
              Internship Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Web Developer"
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-700"
              htmlFor="desc"
            >
              Description
            </label>
            <textarea
              id="desc"
              name="desc"
              value={formData.desc}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the internship..."
              rows="4"
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-700"
              htmlFor="duration"
            >
              Duration
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="6 months"
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-700"
              htmlFor="lastDateToApply"
            >
              Last Date to Apply
            </label>
            <input
              type="datetime-local"
              id="lastDateToApply"
              name="lastDateToApply"
              value={formData.lastDateToApply}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-700"
              htmlFor="salary"
            >
              Salary
            </label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="50000"
            />
          </div>

          {loading ? (
            <button
              disabled
              className="w-full py-2 px-4 bg-blue-400 text-white font-bold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Posting...
            </button>
          ) : (
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Post Internship
            </button>
          )}

          {successMessage && (
            <p className="text-green-500 text-center mt-4">{successMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadListing;
