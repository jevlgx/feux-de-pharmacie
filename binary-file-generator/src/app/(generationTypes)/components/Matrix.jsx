import React, { useRef, forwardRef, useImperativeHandle, useState, useEffect } from "react";
import Column from "./Column"; // Ensure the path is correct
import { copyToClipboard } from "../utils";

const Matrix = forwardRef(({ index = 1, letter }, ref) => { // Add letter prop
  const columnsRefs = useRef(Array(8).fill(null)); // References for the columns
  const [showTooltip, setShowTooltip] = useState(false); // State for tooltip visibility
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 }); // Tooltip position
  const tooltipRef = useRef(null); // Reference for the tooltip

  const getStaticImage = () => {
    const values = columnsRefs.current.map((columnRef) => {
      if (columnRef) {
        return columnRef.getColumnHEX(); // Call to the column method
      }
      return null; // TODO: throw an exception as a reference should always point to a column
    });
    return values.join('').repeat(8);
  };

  useImperativeHandle(ref, () => ({
    getStaticImage, pasteSymbole, 
  }));

  const handleContextMenu = (event) => {
    event.preventDefault(); // Prevent default context menu
    setShowTooltip(true); // Show tooltip
    setTooltipPosition({ left: event.pageX, top: event.pageY }); // Position tooltip at click location
  };

  const handleCopy = () => {
    copyToClipboard(getStaticImage().slice(0, 16)); // Copy matrix state without repetition
    setShowTooltip(false); // Hide tooltip after click
  };

  const pasteSymbole = (text)=>{
    const hexPattern = /^[0-9A-Fa-f]{16}$/;
    if (hexPattern.test(text)) { // Only paste if value matches possible matrix state
      columnsRefs.current.forEach((columnRef, index) => {
        if (columnRef) {
          columnRef.pasteColumnHex(text.slice(index * 2, index * 2 + 2)); // Call to the column method
        }
      });
    } else {
      alert('Veuillez copier une matrice avant');
    }
  }

  const pasteFromClipBoard = () => {
    navigator.clipboard.readText()
      .then(text => {
        const hexPattern = /^[0-9A-Fa-f]{16}$/;
    if (hexPattern.test(text)) { // Only paste if value matches possible matrix state
      columnsRefs.current.forEach((columnRef, index) => {
        if (columnRef) {
          columnRef.pasteColumnHex(text.slice(index * 2, index * 2 + 2)); // Call to the column method
        }
      });
    } else {
      alert('Veuillez copier une matrice avant');
    }
      })
      .catch(err => {
        alert('Erreur lors du collage : ');
        console.log(err);
      });
    setShowTooltip(false); // Hide tooltip after click
  };

  // Handle click outside the tooltip
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="flex justify-center bg-white"
      onContextMenu={handleContextMenu}
    >
      <div className="w-[200px]">
        <div className="grid grid-cols-8 hover:bg-gray-300">
          {Array.from({ length: 8 }, (_, colIndex) => (
            <Column key={colIndex} ref={(el) => (columnsRefs.current[colIndex] = el)} />
          ))}
        </div>
        <p className="text-center py-2 matrix-index">Image {index}</p>
      </div>

      {showTooltip && (
        <div 
          ref={tooltipRef} // Reference for the tooltip
          className="cursor-pointer absolute bg-gray-700 text-white p-2 rounded"
          style={{ left: tooltipPosition.left, top: tooltipPosition.top }}
        >
          <div className="text-white" onClick={handleCopy}>Copier</div>
          <div className="text-white" onClick={pasteFromClipBoard}>Coller</div>
        </div>
      )}
    </div>
  );
});

export default Matrix;