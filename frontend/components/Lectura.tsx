"use client";

// frontend/components/Lectura.tsx
import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const Lectura: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ear, setEar] = useState(0);
  const [headPose, setHeadPose] = useState(0);
  const [perclos, setPerclos] = useState(0);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      startVideo();
    };

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error('Error con webcam:', err));
    };

    loadModels();
  }, []);

  useEffect(() => {
    let frameCount = 0;
    const interval = setInterval(async () => {
      if (videoRef.current && canvasRef.current && ++frameCount % 5 === 0) { // ~5 fps
        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();
        const context = canvasRef.current.getContext('2d');
        if (context && detections.length > 0) {
          context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          faceapi.draw.drawDetections(canvasRef.current, detections);

          const landmarks = detections[0].landmarks;
          // EAR básico (simplificado, necesita ajuste con fórmulas exactas)
          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();
          const earValue = (leftEye[1].y - leftEye[4].y) / (2 * (leftEye[0].x - leftEye[3].x)); // Aproximación
          setEar(earValue > 0.3 ? 100 : 0);

          // Head Pose (placeholder, necesita ángulos reales)
          setHeadPose(Math.random() * 100);

          // PERCLOS (placeholder, necesita tiempo de cierre)
          setPerclos(Math.random() * 100);
        }
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Pantalla de Lectura</h1>
      <div className="w-full max-w-lg">
        <div style={{ position: 'relative' }}>
          <video ref={videoRef} autoPlay muted style={{ width: '100%' }} />
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%' }} />
        </div>
        <div className="mt-4 p-4 bg-white rounded-md overflow-auto" style={{ maxHeight: '400px' }}>
          <p>Texto de ejemplo (scroll si es extenso)... Lorem ipsum dolor sit amet...</p>
        </div>
        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-4">
          Terminé
        </button>
        <div className="mt-4">
          <p>EAR: {ear.toFixed(2)}%</p>
          <p>Head Pose: {headPose.toFixed(2)}%</p>
          <p>PERCLOS: {perclos.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
};

export default Lectura;