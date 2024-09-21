import React, { useState, useRef, useEffect } from "react";
import { storage } from "../../firebase"; // Adjust the path as necessary
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AudioRecorder = () => {
  const [audioURLs, setAudioURLs] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioFile = new File([audioBlob], `recording-${Date.now()}.wav`, { type: "audio/wav" });
      const storageRef = ref(storage, `audio/${audioFile.name}`);

      // Upload audio file to Firebase
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
      }, 400); // Start recording again after 1 second
    }, 10000); // Record every 10 seconds

    return () => {
      clearInterval(recordingIntervalRef.current); // Cleanup on component unmount
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
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
              <a href={url} download={`recording-${index}.wav`}>Download Audio {index + 1}</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
