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
    setMatrixMode(newMode);
    setMode(newMode);
  };

  const handleCountChange = (numberOfLoopingImages) => {
    deleteAllMatrix();
    addMatrix();
    setnumberOfLoopingImages(numberOfLoopingImages);
  };

  return (
    <div id="tool-bar" >
      <div className="p-2 flex-col justify-items-center">
        <h1 className="text-4xl font-bold text-center text-blue-500 my-4">TP Systèmes Embarqués</h1>        {mode === SETTING_MODES.mono ? (
          <>
            <div className="flex flex-col items-center mt-4">
              <button
                onClick={() => { handleModeChange(SETTING_MODES.multy); }}
                className="mt-4 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
              >
                Passer en mode Multi
              </button>
              {(matrices.length < numberOfLoopingImages) && (
                <button
                  onClick={() => { addMatrix(); }}
                  className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                >
                  Ajouter une Image
                </button>
              )}

              <div className="mt-4">
                <label htmlFor="matrix-count" className="block">
                  Nombre maximum d'images :
                </label>
                <select
                  id="matrix-count"
                  value={numberOfLoopingImages}
                  onChange={(e) => handleCountChange(Number(e.target.value))}
                  className="mt-2 border border-gray-300 rounded p-2 w-full"
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
          </>
        ) : (
          <>
            <button
              onClick={() => { handleModeChange(SETTING_MODES.mono); }}
              className="mt-4 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
            >
              Passer en mode Mono
            </button>
            <button
              onClick={() => { addMatrix(); }}
              className="mt-4 w-full text-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Ajouter une Image
            </button>

          </>
        )}
      </div>
      <div className="bg-blue-500 flex gap-4 text-white rounded-xl p-2 justify-evenly">
        {mode === SETTING_MODES.multy ? (
          <button
            onClick={() => {
              try {
                downloadSetOfBinFiles(seralizeImagesToHexArray(matrices, matrixRefs));
              } catch (e) {
                console.error(e);
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
                  console.error(e);
                  alert(e.message);
                }
              }}
            >
              Copier
            </button>
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
              Télécharger le .bin
            </button>
          </>
        )}
      </div>
    </div>
  );
}

