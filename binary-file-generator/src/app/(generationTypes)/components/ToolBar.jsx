import { useState } from "react";
import {
  SETTING_MODES,
  copyToClipboard,
  downloadBinFile,
  downloadSetOfBinFiles,
  seralizeImagesToHex,
  seralizeImagesToHexArray,
} from "../utils";

export default function ToolBar({ matrices, matrixRefs, addMatrix, deleteAllMatrix, setMatrixMode }) {
  const [mode, setMode] = useState(SETTING_MODES.mono);
  const [numberOfLoopingImages, setnumberOfLoopingImages] = useState(1);

  const handleModeChange = (newMode) => {
    deleteAllMatrix();
    addMatrix();
    const mode = (newMode === '1' ? SETTING_MODES.mono : SETTING_MODES.multy)
    setMatrixMode(mode);
    setMode(mode);
  };

  const handleCountChange = (numberOfLoopingImages) => {
    deleteAllMatrix();
    addMatrix();
    setnumberOfLoopingImages(numberOfLoopingImages);
  };

  return (
    <div id="tool-bar" >
      <div className="p-2 flex-col justify-items-center">
        <h1 className="text-4xl font-bold text-center text-blue-500 my-4">Systèmes Embarqués</h1>
        <div className="py-4 w-full border-y-2 border-gray-300 rounded flex items-center justify-between">
          <div>Nombre de matrice</div>
          
          <select className="border border-gray-300 rounded p-2" name="matrixNumber" id="matrixNumber" onChange={(e)=>{handleModeChange(e.target.value)}}>
            <option value="1" >1</option>
            <option value="multiple">Plusieurs</option>
          </select>
        </div>    
        {mode === SETTING_MODES.mono ? (
            <div className="flex flex-col items-center py-6 border-b-2 border-gray-300 rounded">
              {(matrices.length < numberOfLoopingImages) && (
                <button
                  onClick={() => { addMatrix(); }}
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                >
                  Ajouter une Image
                </button>
              )}

              <div className="mt-4 flex items-center justify-between w-full">
                <label htmlFor="matrix-count" className="w-max">
                  Nombre d'image
                </label>
                <select
                  id="matrix-count"
                  value={numberOfLoopingImages}
                  onChange={(e) => handleCountChange(Number(e.target.value))}
                  className="mt-2 border border-gray-300 rounded p-2 w-max"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                  <option value={16}>16</option>
                  <option value={32}>32</option>
                  <option value={64}>64</option>
                  <option value={128}>128</option>
                </select>
              </div>
            </div>
        ) : (
          <div className="py-6 border-b-2 border-gray-300 rounded">
            <button
              onClick={() => { addMatrix(); }}
              className="w-full text-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Ajouter une Image
            </button>

          </div>
        )}
      </div>
      <div className="bg-blue-500 flex gap-4 text-white rounded-xl p-2 justify-evenly">
        {mode === SETTING_MODES.multy ? (
          <button
            onClick={() => {
              try {
                downloadSetOfBinFiles(seralizeImagesToHexArray(matrices, matrixRefs));
              } catch (e) {
                console.log(e);
                alert(e.message);
              }
            }}
          >
            Télécharger les fichiers
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                try {
                  copyToClipboard(seralizeImagesToHex(numberOfLoopingImages, matrices, matrixRefs));
                } catch (e) {
                  console.log(e);
                  alert(e.message);
                }
              }}
            >
              Copier
            </button>
            <div className="w-1px border border-2 rounded">

            </div>
            <button
              onClick={() => {
                try {
                  downloadBinFile("matrice.bin", seralizeImagesToHex(numberOfLoopingImages, matrices, matrixRefs));
                } catch (e) {
                  console.log(e);
                  alert(e.message);
                }
              }}
            >
              Télécharger
            </button>
          </>
        )}
      </div>
    </div>
  );
}

