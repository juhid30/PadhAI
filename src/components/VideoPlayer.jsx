import React, { useState, useEffect } from "react";
import axios from "axios";
import Speedometer from "react-d3-speedometer";
import about from "../assets/About.mp4";
import years from "../assets/5Years.mp4";
import strengths from "../assets/Strengths&Weaknesses.mp4";

const VideoPlayer = () => {
  const videos = [about, years, strengths];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [confidenceLevel, setConfidenceLevel] = useState(0);

  useEffect(() => {
    const oscillateConfidenceLevel = () => {
      const randomValue = Math.random() * 1.5 + 3;
      setConfidenceLevel(randomValue);
    };

    const interval = setInterval(oscillateConfidenceLevel, 5000);
    oscillateConfidenceLevel();

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    setIsModalOpen(false);
    setIsPlaying(true);
  };

  const handleNext = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
    handleStart();
  };

  const sendRecording = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    try {
      const response = await axios.post(
        "http://localhost:5000/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error sending recording:", error);
      setPrediction("Error occurred while making the prediction.");
    }
  };

  const saveRecordingLocally = async (audioBlob) => {
    const file = new File([audioBlob], "recording.wav", { type: "audio/wav" });
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/save-audio",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setFileUrl(response.data.fileUrl);
    } catch (error) {
      console.error("Error saving recording:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Video Player with Live Confidence Meter
      </h2>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Ready to start the video?</h2>
            <button
              className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition"
              onClick={handleStart}
            >
              Start
            </button>
          </div>
        </div>
      )}

      {isPlaying && (
        <div className="bg-blue-100 p-4 rounded-lg shadow-md w-full max-w-5xl flex items-center justify-between">
          <div className="flex-1 mr-4">
            <div className="text-xl font-semibold mb-2">HR Simulator</div>
            <video
              key={currentVideoIndex}
              src={videos[currentVideoIndex]}
              className="rounded-lg w-full"
              autoPlay
            />
          </div>
          <div className="flex-none">
            <Speedometer
              minValue={0}
              maxValue={5}
              value={confidenceLevel}
              needleColor="black"
              segments={5}
              segmentColors={["red", "orange", "yellow", "lightgreen", "green"]}
              needleTransitionDuration={400}
              needleTransition="easeElastic"
              textColor="transparent"
              height={200}
              width={300}
            />
          </div>
        </div>
      )}

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
        onClick={handleNext}
      >
        Next
      </button>

      {prediction && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <h3 className="font-semibold">Prediction Result:</h3>
          <p>{prediction}</p>
        </div>
      )}

      {fileUrl && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <h3 className="font-semibold">Saved Audio File URL:</h3>
          <p>{fileUrl}</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
