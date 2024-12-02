import React, { useRef, useState } from "react";
import Column from "./Column"; // Assurez-vous que le chemin est correct

const Matrix = () => {
    const columnsRefs = useRef(Array(8).fill(null)); // Références pour les colonnes
    const [hexValues, setHexValues] = useState([]);
    const [copyMessage, setCopyMessage] = useState(''); // État pour le message de copie

    const handleGetColumnHEX = () => {
        const values = columnsRefs.current.map((columnRef) => {
            if (columnRef) {
                return columnRef.getColumnHEX(); // Appel à la méthode de la colonne
            }
            return null;
        });
        setHexValues(values);
    };

    const copyToClipboard = () => {
        // Joindre les valeurs hexadécimales en une seule chaîne
        const hexString = hexValues.join(' ');
        const hexImage = hexString.repeat(8);
        const complete = 'FF'.repeat(8064);

        // Copier dans le presse-papier
        navigator.clipboard.writeText(hexImage.concat(complete))
            .then(() => {
                setCopyMessage('Copié dans le presse-papier !'); // Afficher le message
                setTimeout(() => setCopyMessage(''), 2000); // Masquer le message après 2 secondes
            })
            .catch(err => {
                console.error('Erreur lors de la copie :', err);
            });
    };

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {Array.from({ length: 8 }, (_, index) => (
                    <Column key={index} ref={el => (columnsRefs.current[index] = el)} />
                ))}
            </div>
            <button onClick={handleGetColumnHEX}>Récupérer les états hexadécimaux</button>
            <button onClick={copyToClipboard}>Copier dans le presse-papier</button>
            <div style={{ marginTop: '20px', fontWeight: 'bold', border: '1px solid black', padding: '10px' }}>
                Résultats : {hexValues.join(' ')}
            </div>
            {copyMessage && (
                <div style={{
                    marginTop: '10px',
                    padding: '10px',
                    border: '1px solid green',
                    backgroundColor: '#d4edda',
                    color: '#155724'
                }}>
                    {copyMessage}
                </div>
            )}
        </div>
    );
};

export default Matrix;