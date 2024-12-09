import { useState, forwardRef, useImperativeHandle } from "react";

const Led = forwardRef(({ index, onToggle }, ref) => {
    // Declare a state variable "isOn" initialized to false (off)
    const [isOn, setIsOn] = useState(false);

    const toggleLED = () => {
        setIsOn(prevIsOn => !prevIsOn);
        onToggle(index); // Call the parent function to notify the change
    };

    const changeState = (state) => {
        setIsOn(state === "1" ? false : true);
    };

    useImperativeHandle(ref, () => ({
        changeState,
    }));

    // Define the LED style
    const style = {
        width: '100%',
        aspectRatio: '1 / 1',
        border: '1px solid black',
        borderRadius: '50%',
        cursor: 'pointer', 
    };

    return (
        <div 
            style={style} 
            className={isOn ? 'bg-green-500' : 'bg-white'} 
            onClick={toggleLED}
        >
        </div>
    );
});

export default Led;