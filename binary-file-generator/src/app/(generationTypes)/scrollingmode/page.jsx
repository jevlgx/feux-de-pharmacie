"use client";

import React, { useRef, useState } from "react";
import Matrix from "../components/Matrix"; // Assurez-vous que le chemin est correct
import ToolBar from "../components/ToolBar";
import Workspace from "../components/Workspace";
import { MaxImages, SETTING_MODES } from "../utils";

const Scrollingmode = () => {
  const [matrices, setMatrices] = useState([{ id: Date.now(), occurence: 1 }]); // Initialiser avec une matrice
  const matrixRefs = useRef([React.createRef()]); // Références des matrices
  const [matrixMode, setMatrixMode] = useState(SETTING_MODES.mono)

  const handleOccurenceChange = (index, value) => {
    const newMatrices = [...matrices];
    const totalCurrentOccurences = newMatrices.reduce((acc, matrix) => acc + matrix.occurence, 0);
    const newValue = Math.max(1, Math.min(MaxImages, Number(value)));

    // Vérifie que le total des occurrences reste égal ou inférieur à MaxImages
    if (totalCurrentOccurences - newMatrices[index].occurence + newValue <= MaxImages) {
      newMatrices[index].occurence = newValue;
      setMatrices(newMatrices);
    } else {
      alert(`Le nombre d'occurrences doit être égal à ${MaxImages}`);
    }
  };

  const addMatrix = (count = 1) => {
    setMatrices((prevMatrices) => {
      let newMatrices = []; // Tableau pour stocker les nouvelles matrices
      for (let uniqueId = 1; uniqueId <= count; uniqueId++) {
        const newMatrix = { id: Date.now() + uniqueId, occurence: 1 }; // Nouvelle matrice avec occurrence initiale
        newMatrices.push(newMatrix); // Ajoute la nouvelle matrice au tableau
        matrixRefs.current.push(React.createRef()); // Ajoute une nouvelle référence
      }
      return [...prevMatrices, ...newMatrices]; // Retourne l'ancien état avec les nouvelles matrices
    });
  };

  const removeMatrix = (index) => {
    setMatrices((prevMatrices) => prevMatrices.filter((_, i) => i !== index));
    matrixRefs.current.splice(index, 1); // Supprime la référence de la matrice supprimée
  };

  const deleteAllMatrix = () =>{
    // Réinitialiser les matrices
    setMatrices([]);
  
    // Vider les références des matrices
    matrixRefs.current = [];
  }

  return (
    <div className="flex">
      <Workspace>
        <div id="matrix-container">
          {matrices.map((matrix, index) => (
            <div key={matrix.id} className="mb-4">
              <Matrix ref={matrixRefs.current[index]} index={index + 1} mode = {matrixMode}/>
              <div className="mt-2">
                <label htmlFor={`occurrence-${index}`} className="block text-center">
                  repetitions :
                </label>
                <input
                  type="number"
                  id={`occurrence-${index}`}
                  value={matrix.occurence}
                  onChange={(e) => handleOccurenceChange(index, e.target.value)}
                  min="1"
                  max={MaxImages}
                  className="w-full border rounded p-1 text-center"
                  disabled={matrixMode == SETTING_MODES.multy ? true : false}
                />
              </div>
              <button 
                onClick={() => removeMatrix(index)} 
                className="mt-2 bg-red-500 text-white p-2 rounded"
              >
                Supprimer la Matrice
              </button>
            </div>
          ))}
        </div>
      </Workspace>
      <ToolBar matrices={matrices} matrixRefs={matrixRefs} addMatrix={addMatrix} deleteAllMatrix={deleteAllMatrix} setMatrixMode={setMatrixMode}/>
    </div>
  );
};

export default Scrollingmode;