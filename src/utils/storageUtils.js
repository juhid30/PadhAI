// storageUtils.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../..//firebase"; // Adjust the path as needed

export const uploadAssignmentFile = async (file) => {
  const storageRef = ref(storage, `assignments/${file.name}`);

  try {
    await uploadBytes(storageRef, file);
    const docURL = await getDownloadURL(storageRef);
    console.log(docURL);
    return docURL;
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw error; // Re-throw the error for handling in the form
  }
};

export const uploadAnswerFile = async (file) => {
  const storageRef = ref(storage, `assignments/${file.name}`); // Use ref here
  await uploadBytes(storageRef, file); // Use uploadBytes for consistency
  const url = await getDownloadURL(storageRef); // Get the download URL
  return url;
};
