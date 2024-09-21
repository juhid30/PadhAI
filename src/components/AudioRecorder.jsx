import React, { useState, useRef, useEffect } from "react";
import { storage } from "../../firebase"; // Adjust the path as necessary
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AudioRecorder = () => {
  const [audioURLs, setAudioURLs] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);
  const originalFileNameRef = useRef(`recording-${Date.now()}.wav`);
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioFile = new File([audioBlob], originalFileNameRef.current, {
        type: "audio/wav",
      });

      try {
        const formData = new FormData();
        formData.append("file", audioFile); // Add the file to the FormData

        // Call the /predict endpoint
        const response = await fetch("http://localhost:5000/predict", {
          method: "POST",
          body: formData, // Send the file as form data
        });

        if (response.ok) {
          const predictionResult = await response.json();
          console.log("Prediction Result:", predictionResult);
        } else {
          console.error("Failed to get prediction:", response.statusText);
        }
      } catch (error) {
        console.error("Error calling /predict endpoint:", error);
      }

      // Upload audio file to Firebase
      const storageRef = ref(storage, `audio/${audioFile.name}`);
      await uploadBytes(storageRef, audioFile);
      const downloadURL = await getDownloadURL(storageRef);
      setAudioURLs((prevURLs) => [...prevURLs, downloadURL]); // Store the new audio URL
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    audioChunksRef.current = []; // Clear audio chunks
  };

  useEffect(() => {
    startRecording();

    recordingIntervalRef.current = setInterval(() => {
      stopRecording();
      setTimeout(() => {
        startRecording();
      }, 400); // Start recording again after 0.4 seconds
    }, 10000); // Record every 10 seconds

    return () => {
      clearInterval(recordingIntervalRef.current); // Cleanup on component unmount
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        stopRecording(); // Ensure we stop recording when the component unmounts
      }
    };
  }, []);

  return (
    <div>
      <h1>Audio Recorder</h1>
      {audioURLs.length > 0 && (
        <div>
          <h3>Recorded Audios:</h3>
          {audioURLs.map((url, index) => (
            <div key={index}>
              <audio controls src={url} />
              <a href={url} download={`recording-${index}.wav`}>
                Download Audio {index + 1}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
