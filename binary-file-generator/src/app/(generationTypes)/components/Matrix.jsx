import React, { useRef, forwardRef, useImperativeHandle, useState, useEffect } from "react";
import Column from "./Column"; // Assurez-vous que le chemin est correct
import { copyToClipboard } from "../utils";

const Matrix = forwardRef(({ index = 1 }, ref) => {
  const columnsRefs = useRef(Array(8).fill(null)); // Références pour les colonnes
  const [showTooltip, setShowTooltip] = useState(false); // État pour afficher l'info-bulle
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 }); // Position de l'info-bulle
  const tooltipRef = useRef(null); // Référence pour l'info-bulle

  const getStaticImage = () => {
    const values = columnsRefs.current.map((columnRef) => {
      if (columnRef) {
        return columnRef.getColumnHEX(); // Appel à la méthode de la colonne
      }
      return null; // TODO: lancer une exception car une référence doit toujours pointer vers une colonne
    });
    return values.join('').repeat(8);
  };

  useImperativeHandle(ref, () => ({
    getStaticImage,
  }));

  const handleContextMenu = (event) => {
    event.preventDefault(); // Empêche le menu contextuel par défaut
    setShowTooltip(true); // Affiche l'info-bulle
    setTooltipPosition({ left: event.pageX, top: event.pageY }); // Positionne l'info-bulle à l'endroit du clic
  };

  const handleCopy = () => {
    copyToClipboard(getStaticImage().slice(0,16));//etat de la matrice sans répetition
    setShowTooltip(false); // Masque l'info-bulle après le clic
  };
  const handlePaste = () => {
    navigator.clipboard.readText()
    .then(text => {
      const hexPattern = /^[0-9A-Fa-f]{16}$/;
        if( hexPattern.test(text)){//on ne colle que si la valeur correspond à l'état possible d'une matrice
          columnsRefs.current.map((columnRef, index) => {
            if (columnRef) {
              return columnRef.pasteColumnHex(text.slice(index*2, index*2 +2)); // Appel à la méthode de la colonne
            }
            return null; // TODO: lancer une exception car une référence doit toujours pointer vers une colonne
          });
        }else{
            alert('veuillez copier une matrice avant')
        }
    })
    .catch(err => {
      alert('Erreur lors du collage : ');
      console.error(err)
    });
    setShowTooltip(false); // Masque l'info-bulle après le clic
  };

  // Gérer le clic en dehors de l'info-bulle
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    // Ajouter l'écouteur d'événements
    document.addEventListener("mousedown", handleClickOutside);

    // Nettoyer l'écouteur d'événements lors du démontage
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="flex-grow flex justify-center bg-white hover:bg-blue-300"
      onContextMenu={handleContextMenu}
    >
      <div className="w-[200px]">
        <div className="grid grid-cols-8">
          {Array.from({ length: 8 }, (_, colIndex) => (
            <Column key={colIndex} ref={(el) => (columnsRefs.current[colIndex] = el)} />
          ))}
        </div>
        <p className="text-center py-2">{index}</p>
      </div>

      {showTooltip && (
        <div 
          ref={tooltipRef} // Référence pour l'info-bulle
          className="cursor-pointer absolute bg-gray-700 text-white p-2 rounded"
          style={{ left: tooltipPosition.left, top: tooltipPosition.top }}
        >
          <div onClick={handleCopy}>Copier</div>
          <div onClick={handlePaste}>coller</div>
        </div>
      )}
    </div>
  );
});

export default Matrix;