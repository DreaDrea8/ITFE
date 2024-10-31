import Menu from './menu'
import { useState } from 'react';

export default function Root() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event:any) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setUploadStatus('Veuillez sélectionner un fichier d\'abord.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://localhost/api/file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
      }

      const data = await response.json();
      setUploadStatus('Fichier envoyé avec succès !');
      console.log('Réponse du serveur:', data);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du fichier:', error);
      setUploadStatus('Erreur lors de l\'envoi du fichier.');
    }
  };
    return (
      <>
        <Menu />
        <input type='file' onChange={handleFileChange}/>
        <button onClick={handleFileUpload}>envoyer</button>
        <p>{uploadStatus}</p>
      </>
    );
  }
  