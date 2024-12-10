import React, { useState, forwardRef, useImperativeHandle, useRef } from "react";
import Led from "./Led";

const Column = forwardRef(({ onGetColumnHEX }, ref) => {
    const [Leds, setLeds] = useState(Array(8).fill(false)); // 8 Leds dans chaque colonne
    const LedRefs = useRef(Array(8).fill(null))

    const handleToggle = (index) => {
        const newLeds = [...Leds];
        newLeds[index] = !newLeds[index];
        setLeds(newLeds);
    };

    const getColumnHEX = () => {
        // Convertir les états en binaire
        //const binaryString = Leds.map(isOn => (isOn ? '0' : '1'));
        const binaryString = LedRefs.current.map((ledRef, index)=>{
            if(ledRef){
                return ledRef.getState() ? '0' : '1'
            }else{
                return null;
            }
        })

        const bin1 = binaryString.slice(0, 4).reverse().join('');
        const bin2 = binaryString.slice(-4).reverse().join('');
        const hexValue1 = parseInt(bin1, 2).toString(16).toUpperCase()
        const hexValue2 = parseInt(bin2, 2).toString(16).toUpperCase()
        // Convertir la chaîne binaire en hexadécimal
        //const hexValue = parseInt(binaryString, 2).toString(16).toUpperCase().split('').reverse().join('');
        return hexValue2.concat(hexValue1) // Met à jour l'affichage des états en hexadécimal
    };

    const pasteColumnHex = (hexString)=>{
        const decimalValue = parseInt(hexString, 16);
        const binaryString = decimalValue.toString(2).padStart(8, '0').split('').reverse().join('');
        LedRefs.current.map((ledRef, index)=>{
            if(ledRef){
                ledRef.changeState(binaryString[index])
            }else{
                return null;
            }
        })

    }

    // Utiliser ref pour permettre à Matrix d'accéder à getColumnHEX
    useImperativeHandle(ref, () => ({
        getColumnHEX, pasteColumnHex
    }));

    return (
        <div>
            {Leds.map((isOn, index) => (
                <Led ref={(ref) => {LedRefs.current[index] = ref}} key={index} index={index} onToggle={handleToggle} />
            ))}
        </div>
    );
});

export default Column;