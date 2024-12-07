"use client";

import React, { useRef, useState } from "react";
import Matrix from "../components/Matrix"; // Ensure the path is correct
import ToolBar from "../components/ToolBar";
import Workspace from "../components/Workspace";
import { MaxImages, SETTING_MODES } from "../utils";

const Scrollingmode = () => {
  const [matrices, setMatrices] = useState([{ id: Date.now(), occurence: 1 }]);
  const [letter, setLetter] = useState(""); // State for the letter input
  const matrixRefs = useRef([React.createRef()]);
  const [matrixMode, setMatrixMode] = useState(SETTING_MODES.mono);

  const handleOccurenceChange = (index, value) => {
    const newMatrices = [...matrices];
    const totalCurrentOccurences = newMatrices.reduce(
      (acc, matrix) => acc + matrix.occurence,
      0
    );
    const newValue = Math.max(1, Math.min(MaxImages, Number(value)));

    if (
      totalCurrentOccurences - newMatrices[index].occurence + newValue <=
      MaxImages
    ) {
      newMatrices[index].occurence = newValue;
      setMatrices(newMatrices);
    } else {
      alert(`Le nombre d'occurrences doit être égal à ${MaxImages}`);
    }
  };

  const addMatrix = (count = 1) => {
    setMatrices((prevMatrices) => {
      let newMatrices = [];
      for (let uniqueId = 1; uniqueId <= count; uniqueId++) {
        const newMatrix = { id: Date.now() + uniqueId, occurence: 1 };
        newMatrices.push(newMatrix);
        matrixRefs.current.push(React.createRef());
      }
      return [...prevMatrices, ...newMatrices];
    });
  };

  const removeMatrix = (index) => {
    setMatrices((prevMatrices) =>
      prevMatrices.filter((_, i) => i !== index)
    );
    matrixRefs.current.splice(index, 1);
  };

  const deleteAllMatrix = () => {
    setMatrices([]);
    matrixRefs.current = [];
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-row flex-grow p-4 bg-gray-50">
        <ToolBar
          matrices={matrices}
          matrixRefs={matrixRefs}
          addMatrix={addMatrix}
          deleteAllMatrix={deleteAllMatrix}
          setMatrixMode={setMatrixMode}
        />
        <Workspace>
          <div id="matrix-container" className="mt-6 space-y-6">
            {matrices.map((matrix, index) => (
              <div
                key={matrix.id}
                className="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
              >
                <Matrix
                  ref={matrixRefs.current[index]}
                  index={index + 1}
                  mode={matrixMode}
                  letter={letter} // Pass the letter to the Matrix component
                />
                <div className="mt-4">
                  <label
                    htmlFor={`occurrence-${index}`}
                    className="block text-center font-semibold text-gray-700"
                  >
                    Repetitions:
                  </label>
                  <input
                    type="number"
                    id={`occurrence-${index}`}
                    value={matrix.occurence}
                    onChange={(e) => handleOccurenceChange(index, e.target.value)}
                    min="1"
                    max={MaxImages}
                    className="w-full border border-gray-300 rounded p-2 text-center"
                    disabled={matrixMode === SETTING_MODES.multy}
                  />
                </div>
                <button
                  onClick={() => removeMatrix(index)}
                  className="mt-4 w-full bg-red-400 text-white p-2 rounded hover:bg-red-500 transition duration-200"
                >
                  Supprimer la Matrice
                </button>
              </div>
            ))}
          </div>
        </Workspace>
      </div>
    </div>
  );
};

export default Scrollingmode;