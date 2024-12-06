import React, { useRef, forwardRef, useImperativeHandle, useState } from "react";
import Column from "./Column"; // Assurez-vous que le chemin est correct

const Matrix = forwardRef(({ index = 1 }, ref) => {
  const columnsRefs = useRef(Array(8).fill(null)); // Références pour les colonnes
  const [showTooltip, setShowTooltip] = useState(false); // État pour afficher l'info-bulle
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 }); // Position de l'info-bulle

  const getStaticImage = () => {
    // Récupère le code hexadécimal pour dessiner l'image représentée par la matrice
    const values = columnsRefs.current.map((columnRef) => {
      if (columnRef) {
        return columnRef.getColumnHEX(); // Appel à la méthode de la colonne
      }
      return null; // TODO: lancer une exception car une référence doit toujours pointer vers une colonne
    });
    return values.join('').repeat(8); // Pour avoir une image nette, on doit parcourir la matrice 8 fois
  };

  // Expose la méthode au parent
  useImperativeHandle(ref, () => ({
    getStaticImage,
  }));

  // Gérer le clic droit
  const handleContextMenu = (event) => {
    event.preventDefault(); // Empêche le menu contextuel par défaut
    setShowTooltip(true); // Affiche l'info-bulle
    setTooltipPosition({ left: event.pageX, top: event.pageY }); // Positionne l'info-bulle à l'endroit du clic
  };

  // Gérer le clic sur l'info-bulle
  const handleCopy = () => {
    const staticImage = getStaticImage();
    navigator.clipboard.writeText(staticImage) // Copie dans le presse-papier
      .then(() => {
        alert("Image copiée dans le presse-papier !"); // Alerte de succès
      })
      .catch((err) => {
        console.error("Erreur lors de la copie : ", err);
      });
    setShowTooltip(false); // Masque l'info-bulle après le clic
  };

  return (
    <div
      className="flex-grow flex justify-center bg-white hover:bg-blue-300" // Couleur blanche par défaut et bleue au survol
      onContextMenu={handleContextMenu} // Ajouter le gestionnaire de clic droit
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
          className="absolute bg-gray-700 text-white p-2 rounded"
          style={{ left: tooltipPosition.left, top: tooltipPosition.top }}
        >
          <button onClick={handleCopy}>Copier</button>
        </div>
      )}
    </div>
  );
});

export default Matrix;