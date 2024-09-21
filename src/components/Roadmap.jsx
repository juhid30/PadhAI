import React from 'react'
import VideoPlayer from './VideoPlayer'
import { topics } from '../assets/quizData'
import about from "../assets/About.mp4"
import iffframe from "./../../Roadmap/index.html"

export const Roadmap = () => {
  return (
    <div style={{width:"100vw", height:"100vh"}}>
        {/* <iframe src="./assets/react.svg" frameborder="0"></iframe> */}
          <iframe src={iffframe} frameborder="0" style={{height:"100%",width:"100%"}}></iframe>
            {/* <img src="../assets/react.svg" alt="" />
            <video src={about}></video> */}
        
    </div>
  )
}
