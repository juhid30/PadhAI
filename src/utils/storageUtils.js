// src/utils/storageUtils.js
import { storage } from "../firebase"; // Adjust the import based on your Firebase configuration

// Function to upload file and get the URL
export const uploadAssignmentFile = async (file) => {
  const fileRef = storage.ref().child(`assignments/${file.name}`);
  await fileRef.put(file);
  return await fileRef.getDownloadURL(); // Get the download URL for the file
};
