import React, { useState, useEffect } from "react";
import axios from "axios";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import about from "../assets/About.mp4";
import years from "../assets/5Years.mp4";
import strengths from "../assets/Strengths&Weaknesses.mp4";

const VideoPlayer = () => {
  const videos = [about, years, strengths];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [fileUrl, setFileUrl] = useState(null); // File URL for saved audio

  // Audio recorder hook
  const {
    startRecording,
    stopRecording,
    recordingBlob,
    isRecording,
    recordingTime,
  } = useAudioRecorder();

  const handleStart = () => {
    setIsModalOpen(false);
    setIsPlaying(true);
    startRecording(); // Start recording when the video starts
  };

  const handleNext = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
    if (!isRecording) {
      handleStart();
    }
  };

  const sendRecording = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    try {
      const response = await axios.post(
        "http://localhost:5000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error sending recording:", error);
      setPrediction("Error occurred while making the prediction.");
    }
  };

  const saveRecordingLocally = async (audioBlob) => {
    const file = new File([audioBlob], "recording.wav", {
      type: "audio/wav",
    });
    console.log(file);

    // Assuming there's a backend API to handle saving the file in the `public/temp` folder
    const formData = new FormData();
    console.log(formData);
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/save-audio", // Create this API endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFileUrl(response.data.fileUrl); // Assuming the API returns the saved file URL
      console.log(response.data.fileUrl);
    } catch (error) {
      console.error("Error saving recording:", error);
    }
  };

  // Handle "Check Confidence" button click
  const handleCheckConfidence = () => {
    if (isRecording) {
      stopRecording(); // Stop the recording
    }

    if (recordingBlob) {
      // Save the recording in public/temp folder
      saveRecordingLocally(recordingBlob);

      // Send the recording to /predict
      sendRecording(recordingBlob);
    }
  };

  return (
    <div style={{ textAlign: "center", overflow: "hidden" }}>
      <h2>Video Player with Live Recording</h2>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h2>Ready to start the video and recording?</h2>
            <button onClick={handleStart}>Start</button>
          </div>
        </div>
      )}

      {isPlaying && (
        <video
          key={currentVideoIndex}
          src={videos[currentVideoIndex]}
          width="600"
          autoPlay
          style={{ borderRadius: "8px" }}
        />
      )}

      <br />

      <button onClick={handleNext} style={{ marginTop: "10px" }}>
        Next
      </button>

      {/* Audio Recorder component */}
      <AudioRecorder onStart={startRecording} onStop={stopRecording} />

      <button
        onClick={handleCheckConfidence}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        Check Confidence
      </button>

      {prediction && (
        <div style={{ marginTop: "20px" }}>
          <h3>Prediction Result:</h3>
          <p>{prediction}</p>
        </div>
      )}

      {fileUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>Saved Audio File URL:</h3>
          <p>{fileUrl}</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
