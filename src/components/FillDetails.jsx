import React, { useState } from 'react';

const FillDetails = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!name || !phone || !linkedin) {
      setError('All fields are compulsory!');
      return;
    }

    // Process the data
    alert(`Name: ${name}, Phone: ${phone}, LinkedIn: ${linkedin}`);
  };

  return (
    <form className="p-8" onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold mb-4">Fill in Your Details</h3>
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <label className="block mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Phone No.</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">LinkedIn</label>
        <input
          type="url"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </form>
  );
};

export default FillDetails;
