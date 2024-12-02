import React, { useState, forwardRef, useImperativeHandle } from "react";
import Led from "./Led";

const Column = forwardRef(({ onGetColumnHEX }, ref) => {
    const [Leds, setLeds] = useState(Array(8).fill(false)); // 8 Leds dans chaque colonne

    const handleToggle = (index) => {
        const newLeds = [...Leds];
        newLeds[index] = !newLeds[index];
        setLeds(newLeds);
    };

    const getColumnHEX = () => {
        // Convertir les états en binaire
        const binaryString = Leds.map(isOn => (isOn ? '0' : '1'));
        const bin1 = binaryString.slice(0, 4).reverse().join('');
        const bin2 = binaryString.slice(-4).reverse().join('');
        const hexValue1 = parseInt(bin1, 2).toString(16).toUpperCase()
        const hexValue2 = parseInt(bin2, 2).toString(16).toUpperCase()
        // Convertir la chaîne binaire en hexadécimal
        //const hexValue = parseInt(binaryString, 2).toString(16).toUpperCase().split('').reverse().join('');
        return hexValue2.concat(hexValue1) // Met à jour l'affichage des états en hexadécimal
    };

    // Utiliser ref pour permettre à Matrix d'accéder à getColumnHEX
    useImperativeHandle(ref, () => ({
        getColumnHEX
    }));

    return (
        <div>
            {Leds.map((isOn, index) => (
                <Led key={index} index={index} onToggle={handleToggle} />
            ))}
        </div>
    );
});

export default Column;