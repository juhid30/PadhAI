import React, { useEffect, useState } from "react";
import axios from "axios";

const FormHandle = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // try {
    //     const res = await axios.post(
    //       "http://localhost:5000/upload_text",
    //       "I am proficient in React and have worked in a couple of projects which essentially test my problem solving skills"
    //     );
    //     setResponse(res.data);
    //     setError(null);
    //   } catch (err) {
    //     setError("Failed to upload file.");
    //   }
  };
  useEffect(() => {
    console.log(response);
  }, [response]);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default FormHandle;
