"use client";

import React, { useRef, useState } from "react";
import Matrix from "../components/Matrix"; // Ensure the path is correct
import ToolBar from "../components/ToolBar";
import Workspace from "../components/Workspace";
import { MaxImages, SETTING_MODES } from "../utils";

const Scrollingmode = () => {
  const [matrices, setMatrices] = useState([{ id: Date.now(), occurence: 1, letter: "" }]);
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

  const handleLetterChange = (index, value) => {
    const newMatrices = [...matrices];
    newMatrices[index].letter = value; // Update the letter for the specific matrix
    setMatrices(newMatrices);
  };

  const addMatrix = (count = 1) => {
    setMatrices((prevMatrices) => {
      let newMatrices = [];
      for (let uniqueId = 1; uniqueId <= count; uniqueId++) {
        const newMatrix = { id: Date.now() + uniqueId, occurence: 1, letter: "" };
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
    <div className="flex flex-row ">
      <ToolBar
        matrices={matrices}
        matrixRefs={matrixRefs}
        addMatrix={addMatrix}
        deleteAllMatrix={deleteAllMatrix}
        setMatrixMode={setMatrixMode}
      />
      <Workspace>
        <div className="mt-1 p-4">
          <div id="matrix-container" className="overflow-y-auto">
            {matrices.map((matrix, index) => (
              <div
                key={matrix.id}
                className="shadow-lg rounded-lg p-4 border border-gray-200 bg-white transition duration-200 hover:shadow-xl flex flex-col"
              >
                <Matrix
                  ref={matrixRefs.current[index]}
                  index={index + 1}
                  mode={matrixMode}
                  letter={matrix.letter} // Pass the letter specific to the matrix
                />
                <div>
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
                    className="w-full border border-gray-300 rounded p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                    disabled={matrixMode === SETTING_MODES.multy}
                  />
                </div>
                {/* Input for entering a letter below the repetitions input */}
                <div className="mt-4">
                  <label
                    htmlFor={`letter-input-${index}`} // Unique id for each input
                    className="block text-center font-semibold text-gray-700"
                  >
                    Entrer une lettre:
                  </label>
                  <input
                    type="text"
                    id={`letter-input-${index}`}
                    value={matrix.letter} // Use the letter specific to the matrix
                    onChange={(e) => handleLetterChange(index, e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                    maxLength={1} // Limit to a single character
                  />
                </div>
                <button
                  onClick={() => removeMatrix(index)}
                  className="mt-4 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
                >
                  Supprimer la Matrice
                </button>
              </div>
            ))}
          </div>
        </div>
      </Workspace>
    </div>
  );
};

export default Scrollingmode;