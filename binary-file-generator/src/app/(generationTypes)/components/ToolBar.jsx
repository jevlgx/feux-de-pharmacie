import { useState } from "react";
import {
  SETTING_MODES,
  copyToClipboard,
  downloadBinFile,
  downloadSetOfBinFiles,
  seralizeImagesToHex,
  seralizeImagesToHexArray,
} from "../utils"; // Assurez-vous que downloadSetOfBinFiles est importé

export default function ToolBar({ matrices, matrixRefs, addMatrix, deleteAllMatrix, setMatrixMode }) {
  const [mode, setMode] = useState(SETTING_MODES.mono); // État pour le mode d'utilisation
  const [numberOfLoopingImages, setnumberOfLoopingImages] = useState(1); // État pour le nombre de matrices sélectionnées

  const handleModeChange = (newMode) => {
    deleteAllMatrix(); // Supprime toutes les matrices
    addMatrix(); //ajoute une matrice
    setMatrixMode(newMode);

    setMode(newMode)
  };

  const handleCountChange = (numberOfLoopingImages)=>{
    deleteAllMatrix();
    addMatrix(); // Ajoute le nombre de matrices correspondant à l'option sélectionnée
    
    setnumberOfLoopingImages(numberOfLoopingImages)
  }

  return (
    <div id="tool-bar">
      <div className="p-4">
        {mode === SETTING_MODES.mono ? (
          <>
            {(matrices.length < numberOfLoopingImages) &&
              <button
                onClick={() => { addMatrix()}}
                className="mt-4 bg-blue-500 text-white p-2 rounded"
              >
                Ajouter une Matrice
              </button>
            }
            <button
              onClick={() => { handleModeChange(SETTING_MODES.multy)}}
              className="mt-4 bg-green-500 text-white p-2 rounded"
            >
              Passer en mode Multi
            </button>
            <div className="mt-4">
              <label htmlFor="matrix-count" className="block">
                Nombre max d'images :
              </label>
              <select
                id="matrix-count"
                value={numberOfLoopingImages}
                onChange={(e) => handleCountChange(Number(e.target.value))}
                className="mt-2 border rounded p-1"
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
          </>
        ) : (
          <><button
                onClick={() => { addMatrix()}}
                className="mt-4 bg-blue-500 text-white p-2 rounded"
              >
                Ajouter une Image
              </button>
            <button
              onClick={() => { handleModeChange(SETTING_MODES.mono)}}
              className="mt-4 bg-green-500 text-white p-2 rounded"
            >
              Passer en mode Mono
            </button>
          </>
        )}
      </div>
      <div className="bg-[#EF4EF3] p-2">
        <div className="mt-4 bg-gray-300 flex gap-4 justify-evenly">
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
                    console.error(e);
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
    </div>
  );
}