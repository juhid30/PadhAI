import React, { useState, useEffect } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import axios from "axios";
import Sidebar from "./Sidebar";
import { db, realtimeDb } from "../../firebase";
import { onValue, ref } from "firebase/database";


const Rooms = () => {
  const [count, setCount] = useState(0);
  const [libCount, setLibCount] = useState(0);
  const [chartLabel, setChartLabel] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    // Create a reference to the location in the database
    const dataRef = ref(realtimeDb, "debug_runs"); // Replace 'path_to_data' with your actual database path

    // Setup the listener for real-time data
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const value = snapshot.val();
      console.log("Realtime data: ", value);
      setData(value); // Update state with the new data
    });

    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  function handleLibClick() {
    setChartLabel("LIBRARY");

    setMaxCount(20);
  }
  function handleSLClick() {
    setChartLabel("STUDENT LOUNGE");
    setCount(101);
    setMaxCount(120);
  }
  function handleRRClick() {
    setChartLabel("READING ROOM");
    setCount(35);
    setMaxCount(60);
  }

  const [maxCount, setMaxCount] = useState(20);

  const chartData = {
    labels: [chartLabel],
    datasets: [
      {
        label: "Count",
        data: chartLabel === "LIBRARY" ? [libCount] : [count],
        backgroundColor: "#CDF3F2",
        hoverBackgroundColor: "#CDF3F2",
        borderColor: "rgb(94,191,187)",
        borderWidth: 1,
        barThickness: 200,
      },
    ],
  };

  const chartOptions = {
    indexAxis: "x",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    scales: {
      y: {
        suggestedMax: maxCount, // Set the maximum value for the x-axis
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <>
      <div className="h-[100vh] w-[100%]">
        <div className="flex h-[90%]">
          <div className="w-[7.5%] flex flex-col ">
          </div>
          <div className=" w-[92.5%] flex">
            {/* GRAPH AND SELECTION */}
            <div className="flex flex-col w-[50%] h-[100%]">
              <div className="h-[50%] w-[100%] px-[5%] py-[2%] flex items-center justify-center">
                <Bar data={chartData} options={chartOptions} />
              </div>
              <div className="h-[50%] w-[100%] px-[5%] py-[2%] flex flex-col  ">
                <div className="h-[100%] w-[100%] flex flex-col border border-[#5EBFBB] border-1 rounded-t-[20px] ">
                  <div className="w-[100%] h-[25%] bg-[#9ee8e5] bg-opacity-[50%] flex items-center justify-center border-b-[1px] border-[#5EBFBB] rounded-t-[20px] ">
                    <span className="font-black text-[18px] ">
                      CLICK TO CHECK COUNT
                    </span>
                  </div>
                  <div
                    className="w-[100%] h-[25%] hover:bg-gray-50 hover:cursor-pointer flex "
                    onClick={handleLibClick}
                  >
                    <div className="h-[100%] w-[25%]  flex items-center justify-end pr-[6%]">
                      <i class="ri-book-2-fill text-red-500 text-[28px]"></i>
                    </div>
                    <div className="h-[100%] w-[75%] flex items-center justify-start pl-[10%]">
                      <span className="font-semibold text-[16px]">Library</span>
                    </div>
                  </div>
                  <div
                    className="w-[100%] h-[25%] hover:bg-gray-50 hover:cursor-pointer flex "
                    onClick={handleRRClick}
                  >
                    <div className="h-[100%] w-[25%]  flex items-center justify-end pr-[6%]">
                      <i class="ri-book-2-fill text-red-500 text-[28px]"></i>
                    </div>
                    <div className="h-[100%] w-[75%] flex items-center justify-start pl-[10%]">
                      <span className="font-semibold text-[16px]">
                        Reading Room
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-[100%] h-[25%] hover:bg-gray-50 hover:cursor-pointer flex "
                    onClick={handleSLClick}
                  >
                    <div className="h-[100%] w-[25%]  flex items-center justify-end pr-[6%]">
                      <i class="ri-book-2-fill text-red-500 text-[28px]"></i>
                    </div>
                    <div className="h-[100%] w-[75%] flex items-center justify-start pl-[10%]">
                      <span className="font-semibold text-[16px]">
                        Students' Lounge
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* CHECKIN DETAILS */}
            <div className="flex flex-col justify-center w-[50%] h-[100%]  px-[2%]">
              <div className="h-[96.7%] border border-[#5EBFBB] rounded-t-[20px] flex flex-col ">
                <div className="h-[15%] bg-[#5EBFBB] flex items-center border-b-[1px] border-[#5EBFBB] justify-center rounded-t-[20px]">
                  <span className="font-black">CHECK IN DETAILS</span>
                </div>
                <div className="h-[12%] text-gray-700 uppercase bg-[#9ee8e5] bg-opacity-[50%] font-bold text-[15px] flex border-b-[1px] border-[#5EBFBB]">
                  <div className="w-[10%] flex items-center justify-center">
                    Sr
                  </div>
                  <div className="w-[35%] flex items-center justify-center ">
                    NAME
                  </div>
                  <div className="w-[35%] flex items-center justify-center ">
                    PLACE
                  </div>
                  <div className="w-[20%] flex items-center justify-center ">
                    TIME
                  </div>
                </div>
                <div className="h-[73%] text-[14px] overflow-auto">
                  <div className="h-[10%] bg-white border-b h-[75px]  hover:bg-gray-50 flex">
                    <div className="w-[10%] flex items-center justify-center ">
                      1
                    </div>
                    <div className="w-[35%] flex items-center justify-center ">
                      Jash
                    </div>
                    <div className="w-[35%] flex items-center justify-center font-bold text-[#00f520] ">
                      Library
                    </div>
                    <div className="w-[20%] flex items-center justify-center ">
                      10:00am
                    </div>
                  </div>
                  <div className="h-[10%] bg-white border-b h-[75px]  hover:bg-gray-50 flex">
                    <div className="w-[10%] flex items-center justify-center ">
                      2
                    </div>
                    <div className="w-[35%] flex items-center justify-center ">
                      Juhi
                    </div>
                    <div className="w-[35%] flex items-center justify-center font-bold text-[#00f520] ">
                      Library
                    </div>
                    <div className="w-[20%] flex items-center justify-center ">
                      10:04am
                    </div>
                  </div>
                  <div className="h-[10%] bg-white border-b h-[75px]  hover:bg-gray-50 flex">
                    <div className="w-[10%] flex items-center justify-center ">
                      3
                    </div>
                    <div className="w-[35%] flex items-center justify-center ">
                      Nieander
                    </div>
                    <div className="w-[35%] flex items-center justify-center font-bold text-[#FDD227] ">
                      ReadingRoom
                    </div>
                    <div className="w-[20%] flex items-center justify-center ">
                      10:06am
                    </div>
                  </div>
                  <div className="h-[10%] bg-white border-b h-[75px]  hover:bg-gray-50 flex">
                    <div className="w-[10%] flex items-center justify-center ">
                      4
                    </div>
                    <div className="w-[35%] flex items-center justify-center ">
                      Winoliya
                    </div>
                    <div className="w-[35%] flex items-center justify-center font-bold text-[#00f520] ">
                      Library
                    </div>
                    <div className="w-[20%] flex items-center justify-center ">
                      10:06am
                    </div>
                  </div>
                  <div className="h-[10%] bg-white border-b h-[75px]  hover:bg-gray-50 flex">
                    <div className="w-[10%] flex items-center justify-center ">
                      5
                    </div>
                    <div className="w-[35%] flex items-center justify-center ">
                      Rysa
                    </div>
                    <div className="w-[35%] flex items-center justify-center font-bold text-[#FDD227] ">
                      ReadingRoom
                    </div>
                    <div className="w-[20%] flex items-center justify-center ">
                      10:08am
                    </div>
                  </div>
                  <div className="h-[10%] bg-white border-b h-[75px]  hover:bg-gray-50 flex">
                    <div className="w-[10%] flex items-center justify-center ">
                      6
                    </div>
                    <div className="w-[35%] flex items-center justify-center ">
                      Amey
                    </div>
                    <div className="w-[35%] flex items-center justify-center font-bold text-[#fc0000] ">
                      Students' Lounge
                    </div>
                    <div className="w-[20%] flex items-center justify-center ">
                      10:10am
                    </div>
                  </div>
                  <div className="h-[10%] bg-white border-b h-[75px]  hover:bg-gray-50 flex">
                    <div className="w-[10%] flex items-center justify-center ">
                      7
                    </div>
                    <div className="w-[35%] flex items-center justify-center ">
                      Sanal
                    </div>
                    <div className="w-[35%] flex items-center justify-center font-bold text-[#fc0000] ">
                      Students' Lounge
                    </div>
                    <div className="w-[20%] flex items-center justify-center ">
                      10:10am
                    </div>
                  </div>
                  <div className="h-[10%] bg-white border-b h-[75px]  hover:bg-gray-50 flex">
                    <div className="w-[10%] flex items-center justify-center ">
                      8
                    </div>
                    <div className="w-[35%] flex items-center justify-center ">
                      Jessica
                    </div>
                    <div className="w-[35%] flex items-center justify-center font-bold text-[#00f520] ">
                      Library
                    </div>
                    <div className="w-[20%] flex items-center justify-center ">
                      10:21am
                    </div>
                  </div>
                  <div className="h-[10%] bg-white border-b h-[75px]  hover:bg-gray-50 flex">
                    <div className="w-[10%] flex items-center justify-center ">
                      9
                    </div>
                    <div className="w-[35%] flex items-center justify-center ">
                      Simon
                    </div>
                    <div className="w-[35%] flex items-center justify-center font-bold text-[#FDD227] ">
                      ReadingRoom
                    </div>
                    <div className="w-[20%] flex items-center justify-center ">
                      10:22am
                    </div>
                  </div>
                  <div className="h-[10%] bg-white border-b h-[75px]  hover:bg-gray-50 flex">
                    <div className="w-[10%] flex items-center justify-center ">
                      10
                    </div>
                    <div className="w-[35%] flex items-center justify-center ">
                      Ayaan
                    </div>
                    <div className="w-[35%] flex items-center justify-center font-bold text-[#00f520] ">
                      Library
                    </div>
                    <div className="w-[20%] flex items-center justify-center ">
                      10:43am
                    </div>
                  </div>
                  <div className="h-[10%] bg-white border-b h-[75px]  hover:bg-gray-50 flex">
                    <div className="w-[10%] flex items-center justify-center ">
                      11
                    </div>
                    <div className="w-[35%] flex items-center justify-center ">
                      Faraaz
                    </div>
                    <div className="w-[35%] flex items-center justify-center font-bold text-[#fc0000] ">
                      Students' Lounge
                    </div>
                    <div className="w-[20%] flex items-center justify-center ">
                      11:11am
                    </div>
                  </div>
                  <div className="h-[10%] bg-white border-b h-[75px]  hover:bg-gray-50 flex">
                    <div className="w-[10%] flex items-center justify-center ">
                      12
                    </div>
                    <div className="w-[35%] flex items-center justify-center ">
                      Shelly
                    </div>
                    <div className="w-[35%] flex items-center justify-center font-bold text-[#FDD227] ">
                      ReadingRoom
                    </div>
                    <div className="w-[20%] flex items-center justify-center ">
                      11:16am
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Rooms;
