import React, { useState, useEffect } from "react";
import axios from "axios";
import { AudioRecorder } from "react-audio-voice-recorder";
import about from "../assets/About.mp4";
import years from "../assets/5Years.mp4";
import strengths from "../assets/Strengths&Weaknesses.mp4";

const VideoPlayer = () => {
  const videos = [about, years, strengths];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const handleStart = () => {
    setIsModalOpen(false);
    setIsPlaying(true);
  };

  const handleNext = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
    if (!recordedAudio) {
      handleStart();
    }
  };

  const handleAudioStop = (data) => {
    setRecordedAudio(data);
    sendRecording(data); // Send the recording once it's stopped
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

  useEffect(() => {
    // Set up the interval to send the audio every 5 seconds
    if (recordedAudio) {
      const id = setInterval(() => {
        sendRecording(recordedAudio);
      }, 5000);
      setIntervalId(id);

      // Clear the interval on component unmount
      return () => clearInterval(id);
    }
  }, [recordedAudio]);

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

      <AudioRecorder
        onStop={handleAudioStop}
        onData={(data) => console.log(data)} // Optional: log audio data
      />

      {prediction && (
        <div style={{ marginTop: "20px" }}>
          <h3>Prediction Result:</h3>
          <p>{prediction}</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
