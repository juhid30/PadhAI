import React from "react";
import "./Profile.css";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

/**
 * Profile
 *
 * A component that displays a user's profile information, including
 * their name, email, and a graph of their wins in various games.
 *
 * @returns {React.ReactElement} The Profile component
 */

const Profile = () => {
  const data = {
    labels: ["Chess", "Valorant", "GTA", "Cyberpunk", "CSGO", ],
    datasets: [
      {
        label: "Wins",
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: "rgb(102, 0, 51)",
        borderColor: "rgb(102, 0, 51))",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="wrapper background-profile py-4 flex flex-col items-center justify-center w-screen min-h-[100vh] overflow-hidden">
      <div className="h-[50vh] max-w-[100vw] flex justify-center gap-4">
        <div className="w-[30vw] glass-overlay-brown flex flex-col justify-center rounded-[1.8rem] p-8  items-center shadow-lg backdrop-blur-md bg-opacity-30">
          {/* Profile Image */}
          <img
            src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FJuhi.jpg?alt=media&token=33b59920-a019-458e-a925-4cfda021d74a"
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover mb-4 border-4 border-white shadow-md"
          />
          {/* Profile Name */}
          <h2 className="text-xl font-bold text-[#ffffff] text-[2.4rem] mb-3">
            Juhi Deore
          </h2>
          {/* Profile Email */}
          <p className="text-md text-[#ffffff] text-[1.3rem] font-medium">
            Juhi@gmail.com
          </p>
        </div>
        <div className="w-[60vw] glass-overlay-white p-8 rounded-[1.8rem] shadow-lg">
          <Line data={data} width={1200} height={500} />
        </div>
      </div>
      <div className="h-[45vh] max-w-[100vw]">
        <div className="w-[100%] flex flex-col">
          <div className="float-right flex justify-end w-full p-2"></div>
          <div className=" h-[40.5vh] flex gap-4 overflow-x-auto p-4">
            <div className="glass-overlay-white flex flex-col items-center justify-center gap-2 p-4 rounded shadow-lg min-w-[200px]">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FJash.JPG?alt=media&token=9bdc90ec-805b-46af-a9ce-43d0a66b4b66"
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover  shadow-md"
              />
              <div className="flex flex-col items-center font-normal text-black">
                <h1 className="text-black font-semibold">Jash</h1> <p>jash@gmail.com</p>{" "}
              </div>{" "}
            </div>
            <div className="glass-overlay-brown p-4 rounded shadow-lg min-w-[200px]">
              <h1>Zeeshan</h1> <p>zeeshan@gmail.com</p>{" "}
            </div>
            <div className="glass-overlay-white p-4 rounded shadow-lg min-w-[200px]">
            <h1>Atharva</h1> <p>athar@gmail.com</p>{" "}

            </div>
            <div className="glass-overlay-brown p-4 rounded shadow-lg min-w-[200px]">
            <h1>Om</h1> <p>om@gmail.com</p>{" "}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;