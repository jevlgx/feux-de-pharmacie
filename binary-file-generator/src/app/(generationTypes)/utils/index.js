export const MaxImages = 128; // Nombre max d'images nettes représentables dans la mémoire (2^13/8*8)
export const SETTING_MODES = {
    mono: "mono",
    multy: "multy"
}

export const copyToClipboard = (hexValues) => {
    console.log("arrive dans copy",hexValues.length)
    navigator.clipboard.writeText(hexValues)
        .then(() => {
            alert('Copié dans le presse-papier !')
        })
        .catch(err => {
            alert('Erreur lors de la copie :')
            console.error('Erreur lors de la copie :', err);
        });
};

export const seralizeImagesToHex = (numberOfLoopingImages, matrices, matrixRefs) => {
  
  const correspondingRepetition = 128/numberOfLoopingImages

  const totalCurrentOccurences = matrices.reduce((acc, matrix) => acc + matrix.occurence, 0);
  if (totalCurrentOccurences !== numberOfLoopingImages) {
    throw new Error(`Le nombre d'images doit être égal à ${numberOfLoopingImages}`);
  } else {
    const matrixImages = matrices.map((matrix, index) => {
      const matrixRef = matrixRefs.current[index]; // Récupère la référence correspondante
      if (matrixRef.current) {
        return matrixRef.current.getStaticImage().repeat(matrix.occurence); // Chaque image est enregistrée plusieurs fois dans la mémoire
      }
      return null;
    });
    return matrixImages.join('').repeat(correspondingRepetition); // Toutes les images sont jointes en une seule
  }
}; 

export const seralizeImagesToHexArray = (matrices, matrixRefs)=>{
    const matrixImages = matrices.map((matrix, index) => {
      const matrixRef = matrixRefs.current[index]; // Récupère la référence correspondante
      if (matrixRef.current) {
        return matrixRef.current.getStaticImage().repeat(MaxImages); // L'image occupe toute la mémoire
      }
      return null;
    });
    return matrixImages;
}

export const downloadBinFile = (fileName, hexValues) => {

    // Convertir la chaîne hexadécimale en tableau d'octets
    const byteArray = [];

    // Parcourir la chaîne deux caractères à la fois
    for (let i = 0; i < hexValues.length; i += 2) {
        // Extraire deux caractères
        const hexPair = hexValues.substring(i, i + 2);
        // Convertir en entier et ajouter au tableau
        byteArray.push(parseInt(hexPair, 16));
    }

    // Créer un tableau d'octets (Uint8Array) à partir du tableau d'entiers
    const uint8Array = new Uint8Array(byteArray);

    // Créer un Blob à partir du tableau d'octets
    const blob = new Blob([uint8Array], { type: 'application/octet-stream' });

    // Créer un lien temporaire pour le téléchargement
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName; // Nom du fichier à télécharger

    // Ajouter le lien au document et déclencher le téléchargement
    document.body.appendChild(link);
    link.click(); // Déclenche le téléchargement

    // Nettoyer : supprimer le lien et libérer l'URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

};

export const downloadSetOfBinFiles = (hexValuesArray) => {
    hexValuesArray.forEach((hexValues, index) => {
        downloadBinFile(`matrice_${index + 1}.bin`, hexValues)
    });
};

