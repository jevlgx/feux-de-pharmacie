"use client";

import React, { useRef, useState } from "react";
import Matrix from "../components/Matrix"; // Ensure the path is correct
import ToolBar from "../components/ToolBar";
import Workspace from "../components/Workspace";
import { MaxImages, SETTING_MODES, encodeHex } from "../utils";

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

  const handleSelectSymbol = (symbol,reference) => {
    console.log(symbol, reference)
    console.log(encodeHex[symbol])
    reference.current.pasteSymbole(encodeHex[symbol])
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
                <div className="matrix-options">
                  {/* Input for entering a letter */}
                  <div className="items-center rounded">
                    
                    <select id={`symbole-select-${index}`} onChange={(event)=>{handleSelectSymbol(event.target.value,matrixRefs.current[index])}} className="w-[60px] h-full border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-400">
                      {
                        Object.keys(encodeHex).map((symbol, ind)=>(
                          <option key ={ind} value={symbol}>{symbol}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="border border-gray-100 flex">
                    <span className="mx-auto bg-red relative left-[10px]">x</span>
                    <input
                      type="number"
                      id={`occurrence-${index}`}
                      value={matrix.occurence}
                      onChange={(e) => handleOccurenceChange(index, e.target.value)}
                      min="1"
                      max={MaxImages}
                      className="w-[60px] text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                      disabled={matrixMode === SETTING_MODES.multy}
                    />
                  </div>
                  <button
                    onClick={() => removeMatrix(index)}
                    className="w-full flex items-center justify-center text-white bg-red-500 rounded hover:bg-red-600 transition duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFF" className="bi bi-trash" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Workspace>
    </div>
  );
};

export default Scrollingmode;