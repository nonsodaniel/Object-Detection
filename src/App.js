import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { ObjectDetection } from "@tensorflow-models/coco-ssd";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { drawRect } from "./draw";

import './App.css'

const App = () => { 
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runCoco = async () => {
    const net = await cocossd.load();
    setInterval(() => {
      detect(net); 
    }, 10);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      //get video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      const obj = await net.detect(video);
      // console.log(obj);

      //draw the mesh

      const ctx = canvasRef.current.getContext("2d");
       // console.log(obj, ctx);
      drawRect(obj, ctx);
    }
  };

  useEffect(() => {
    runCoco();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
};

export default App;
