// import React, { useState, useEffect } from "react";
// import Navbar from "./Navbar";
// import Sidebar from "./Sidebar";
// import { Bar } from "react-chartjs-2";
// import { Chart as ChartJS } from "chart.js/auto";
// import { db } from "./firebase"; // Firebase import
// import { doc, getDoc } from "firebase/firestore";

// const Rooms = () => {
//   const [count, setCount] = useState(0);
//   const [libCount, setLibCount] = useState(0);
//   const [chartLabel, setChartLabel] = useState("");
//   const [maxCount, setMaxCount] = useState(20);

//   const fetchCount = async () => {
//     try {
//       const docRef = doc(db, "rooms", "library"); // Assuming your collection is 'rooms' and the document is 'library'
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setLibCount(docSnap.data().count); // Assuming 'count' is a field in the document
//       } else {
//         console.log("No such document!");
//       }
//     } catch (err) {
//       console.error("Error fetching document: ", err);
//     }
//   };

//   useEffect(() => {
//     fetchCount();
//     const intervalId = setInterval(() => {
//       fetchCount();
//     }, 5000);

//     return () => clearInterval(intervalId);
//   }, []);

//   function handleLibClick() {
//     setChartLabel("LIBRARY");
//     setMaxCount(20);
//   }
//   function handleSLClick() {
//     setChartLabel("STUDENT LOUNGE");
//     setCount(101);
//     setMaxCount(120);
//   }
//   function handleRRClick() {
//     setChartLabel("READING ROOM");
//     setCount(35);
//     setMaxCount(60);
//   }

//   const chartData = {
//     labels: [chartLabel],
//     datasets: [
//       {
//         label: "Count",
//         data: chartLabel === "LIBRARY" ? [libCount] : [count],
//         backgroundColor: "#CDF3F2",
//         hoverBackgroundColor: "#CDF3F2",
//         borderColor: "rgb(94,191,187)",
//         borderWidth: 1,
//         barThickness: 200,
//       },
//     ],
//   };

//   const chartOptions = {
//     indexAxis: "x",
//     elements: {
//       bar: {
//         borderWidth: 2,
//       },
//     },
//     responsive: true,
//     scales: {
//       y: {
//         suggestedMax: maxCount,
//       },
//     },
//     maintainAspectRatio: false,
//   };

//   return (
//     <div className=" w-[92.5%] flex">
//       {/* GRAPH AND SELECTION */}
//       <div className="flex flex-col w-[50%] h-[100%]">
//         <div className="h-[50%] w-[100%] px-[5%] py-[2%] flex items-center justify-center">
//           <Bar data={chartData} options={chartOptions} />
//         </div>
//         <div className="h-[50%] w-[100%] px-[5%] py-[2%] flex flex-col  ">
//           <div className="h-[100%] w-[100%] flex flex-col border border-[#5EBFBB] border-1 rounded-t-[20px] ">
//             <div className="w-[100%] h-[25%] bg-[#9ee8e5] bg-opacity-[50%] flex items-center justify-center border-b-[1px] border-[#5EBFBB] rounded-t-[20px] ">
//               <span className="font-black text-[18px] ">
//                 CLICK TO CHECK COUNT
//               </span>
//             </div>
//             <div
//               className="w-[100%] h-[25%] hover:bg-gray-50 hover:cursor-pointer flex "
//               onClick={handleLibClick}
//             >
//               <div className="h-[100%] w-[25%]  flex items-center justify-end pr-[6%]">
//                 <i className="ri-book-2-fill text-red-500 text-[28px]"></i>
//               </div>
//               <div className="h-[100%] w-[75%] flex items-center justify-start pl-[10%]">
//                 <span className="font-semibold text-[16px]">Library</span>
//               </div>
//             </div>
//             <div
//               className="w-[100%] h-[25%] hover:bg-gray-50 hover:cursor-pointer flex "
//               onClick={handleRRClick}
//             >
//               <div className="h-[100%] w-[25%]  flex items-center justify-end pr-[6%]">
//                 <i className="ri-book-2-fill text-red-500 text-[28px]"></i>
//               </div>
//               <div className="h-[100%] w-[75%] flex items-center justify-start pl-[10%]">
//                 <span className="font-semibold text-[16px]">Reading Room</span>
//               </div>
//             </div>
//             <div
//               className="w-[100%] h-[25%] hover:bg-gray-50 hover:cursor-pointer flex "
//               onClick={handleSLClick}
//             >
//               <div className="h-[100%] w-[25%]  flex items-center justify-end pr-[6%]">
//                 <i className="ri-book-2-fill text-red-500 text-[28px]"></i>
//               </div>
//               <div className="h-[100%] w-[75%] flex items-center justify-start pl-[10%]">
//                 <span className="font-semibold text-[16px]">
//                   Students' Lounge
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* CHECKIN DETAILS */}
//       <div className="flex flex-col justify-center w-[50%] h-[100%]  px-[2%]">
//         <div className="h-[96.7%] border border-[#5EBFBB] rounded-t-[20px] flex flex-col ">
//           <div className="h-[15%] bg-[#5EBFBB] flex items-center border-b-[1px] border-[#5EBFBB] justify-center rounded-t-[20px]">
//             <span className="font-black">CHECK IN DETAILS</span>
//           </div>
//           {/* Rest of the check-in details remains the same */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Rooms;
