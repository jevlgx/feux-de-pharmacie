export const MaxImages = 128; // Nombre max d'images nettes représentables dans la mémoire (2^13/8*8)
export const SETTING_MODES = {
    mono: "mono",
    multy: "multy"
}

export const encodeHex = {
  'clear': "FFFFFFFFFFFFFFFF",
  'full': "0000000000000000",
  'A': "FF0301ECEC0103FF",
  'B': "FF000066660089FF",
  'C': "FF81007E7E3CBDFF",
  'D': "FF00007E7E0081FF",
  'E': "FF000066666666FF",
  'F': "FF0000E6E6E6FEFF",
  'G': "FF81007E5E1C1DFF",
  'H': "FF0000E7E70000FF",
  'I': "FFFF7E00007EFFFF",
  'J': "FFBF3F7F7F0080FF",
  'K': "FF0000C3993C7EFF",
  'L': "FF00007F7F7F7FFF",
  'M': "0000F9F3F90000FF",
  'N': "FF0000E3C70000FF",
  'O': "FF81007E7E0081FF",
  'P': "FF0000EEEEE0F1FF",
  'Q': "81007E7E00017F7F",
  'R': "0000E6C690397FFF",
  'S': "B9306666048DFFFF",
  'T': "FEFEFE0000FEFEFE",
  'U': "FF80007F7F0080FF",
  'V': "FFC0803F3F80C0FF",
  'W': "C0803F9F3F80C0FF",
  'X': "FF3810C7C71038FF",
  'Y': "FFF0E00F0FE0F0FF",
  'Z': "3C1C0E466270383C",
  '!': "FFFFFF4040FFFFFF",
  '?': "FFFDFC4E4EE0F1FF",
  '0': "FF81006E760081FF",
  '1': "FFF77301007FFFFF",
  '2': "FF7D3C1E4E6071FF",
  '3': "BD3C7E66660091FF",
  '4': "FFC1C0DF0707DFFF",
  '5': "FFB0206666068EFF",
  '6': "FF81006E6E0C9DFF",
  '7': "FFFEFE0E06F0F8FF",
  '8': "FF91006E6E0091FF",
  '9': "FFB13076760081FF",
  '<-': "EFC78301C7C7C7FF",
};

export const copyToClipboard = (hexValues) => {
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
  }
    const matrixImages = matrices.map((matrix, index) => {
      const matrixRef = matrixRefs.current[index]; // Récupère la référence correspondante
      if (matrixRef.current) {
        return matrixRef.current.getStaticImage().repeat(matrix.occurence); // Chaque image est enregistrée plusieurs fois dans la mémoire
      }
      return null;
    });
    return matrixImages.join('').repeat(correspondingRepetition); // Toutes les images sont jointes en une seule
  
}; 

export const seralizeImagesToHexArray = (matrices, matrixRefs)=>{

  const totalCurrentOccurences = matrices.reduce((acc, matrix) => acc + matrix.occurence, 0);
  if (totalCurrentOccurences < 1) {
    throw new Error(`vous devez avoir au moins une image`);
  }
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

