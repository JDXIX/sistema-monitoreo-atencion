"use client";

// frontend/components/HomePage.tsx
import React, { useState } from 'react';
import PreMonitoreo from './PreMonitoreo';
import Lectura from './Lectura';

const HomePage: React.FC = () => {
  const [mostrarPreMonitoreo, setMostrarPreMonitoreo] = useState(false);
  const [mostrarLectura, setMostrarLectura] = useState(false);
  const [tiempoEstimado, setTiempoEstimado] = useState('');

  const handleSeleccionar = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    setTiempoEstimado(
      valor === 'corto' ? '1-1.5 minutos' :
      valor === 'mediano' ? '2-2.5 minutos' :
      '4-5 minutos'
    );
  };

  const handleIniciaLectura = () => {
    setMostrarPreMonitoreo(true);
  };

  const handleIniciaMonitoreo = () => {
    setMostrarLectura(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {!mostrarPreMonitoreo && !mostrarLectura ? (
        <>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Sistema de Monitoreo de Atención
          </h1>
          <div className="w-full max-w-md">
            <label htmlFor="document-select" className="block text-lg font-medium text-gray-700 mb-2">
              Selecciona un documento:
            </label>
            <select
              id="document-select"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              onChange={handleSeleccionar}
              value={tiempoEstimado ? 'corto' : ''} // Asegura que el valor esté controlado
            >
              <option value="corto">Corto (1-1.5 min)</option>
              <option value="mediano">Mediano (2-2.5 min)</option>
              <option value="extenso">Extenso (~4-5 min)</option>
            </select>
            <button
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              onClick={handleIniciaLectura}
              disabled={!tiempoEstimado}
            >
              Seleccionar Documento
            </button>
          </div>
        </>
      ) : mostrarPreMonitoreo && !mostrarLectura ? (
        <PreMonitoreo tiempo={tiempoEstimado} onIniciaLectura={handleIniciaMonitoreo} />
      ) : (
        <Lectura />
      )}
    </div>
  );
};

export default HomePage;