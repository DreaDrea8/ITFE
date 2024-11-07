import React, { useState } from 'react';
import { useAppContext } from '../AppContext';

interface fileInterface {
  id: number;
  libelle: string;
  description?: string;
  fileName?: string;
  mimetype: string;
  size: number;
}

interface buttonInterface {
  shareFile?: boolean;
  updateFile?: boolean;
  deleteFile?: boolean;
  downloadFile?: boolean;
}

interface FileComponentProps {
  file : fileInterface
  button : buttonInterface
}


const FileComponent: React.FC<FileComponentProps> = ({file, button}) => {
  const [link, setLink] = useState<string>('');
  const appContext = useAppContext();

  const handleCopy = (event: React.MouseEvent<HTMLButtonElement>, url: string) => {
    event.preventDefault();
    navigator.clipboard.writeText(url).then(() => alert('Lien copié dans le presse-papier'));
  };

  const handleRedirect = (event: React.MouseEvent<HTMLButtonElement>, url: string) => {
    event.preventDefault();
    window.location.href = url;
  };

  const handleShare = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/link/${file.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${appContext.app.token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      setLink(result.url);
    } catch (error) {
      console.error("Erreur lors du partage de fichier :", error);
    }
  };

  const handleDownload = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/file/${file.id}/download`);
      console.log(response)
    } catch (error) {
      console.error("Erreur lors du téléchargement de fichier :", error);
    }
  };

  const handleUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    window.location.href = `/api/file/${file.id}`;
  };

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await fetch(`/api/file/${file.id}`, { method: 'DELETE' });
      alert('Fichier supprimé');
    } catch (error) {
      console.error("Erreur lors de la suppression de fichier :", error);
    }
  };

  return (
    <div className="file">
      <div className="file-header">
        <h4>{file.libelle}</h4>
        <h5>Description</h5>
        <p>{file.description}</p>
      </div>
      <div className="file-info">
        <p>Nom du fichier : {file.fileName}</p>
        <p>MimeType : {file.mimetype}</p>
        <p>Size : {file.size} bytes</p>
        {link && (
          <div className="link">
            <p>{link}</p>
            <button onClick={(event) => handleCopy(event, link)}>
              Copier le lien
            </button>
            <button onClick={(event) => handleRedirect(event, link)}>
              Ouvrir le lien
            </button>
          </div>
        )}
      </div>
      <div className="file-action">
        {button.shareFile && (
          <button className="button-primary" onClick={handleShare}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"/>
            </svg>
          </button>
        )}
        {button.updateFile && (
          <button className="button-warning" onClick={handleUpdate}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/>
            </svg>
          </button>
        )}
        {button.downloadFile && (
          <button className="button-primary" onClick={handleDownload}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/>
            </svg>
          </button>
        )}
        {button.deleteFile && (
          <button className="button-danger" onClick={handleDelete}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default FileComponent;
