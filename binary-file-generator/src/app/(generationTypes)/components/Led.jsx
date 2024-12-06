import { useState } from "react";

export default function Led({index, onToggle}) {
    // Déclare une variable d'état "isOn" initialisée à false (éteint)
    const [isOn, setIsOn] = useState(false);

    const toggleLED = () => {
        setIsOn(prevIsOn => !prevIsOn);
        onToggle(index); // Appelle la fonction parent pour notifier le changement
    };

    // Style de la LED
    const style = {
        width: '100%',
        aspectRatio: '1 / 1',
        border: '1px solid black',
        borderRadius: '50%',
        backgroundColor: isOn ? 'green' : 'white', // Vert si allumé, blanc si éteint
        cursor: 'pointer' // Change le curseur pour indiquer qu'il est cliquable
    };

    return (
        <div style={style} onClick={toggleLED}>
        </div>
    );
}