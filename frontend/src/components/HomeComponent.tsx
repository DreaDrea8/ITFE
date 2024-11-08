import { Link } from 'react-router-dom';
import './../assets/components/homeComponent.css'
import { useEffect, useState } from 'react';
import { useAppContext } from '../AppContext';
import FileComponent, { buttonInterface, fileInterface } from './FileComponent';

export type FileType = { 
  id: number,
  libelle: string,
  description: string,
  fileName: string,
  originalFileName: string,
  mimetype: string,
  referenceId: number,
  userId: number,
  size: number,
  createdAt: Date,
  updatedAt: Date,
  revokedAt?: Date
}


export function formatFileSize(sizeInBytes: number): string {
  const units = ['octets', 'Ko', 'Mo', 'Go', 'To'];
  let size = sizeInBytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

const HomeComponent: React.FC = () => {
  const appContext = useAppContext();
  const [fileListUser, setFileListUser] = useState<FileType[]>([])
  const [fileListOther, setFileListOther] = useState<FileType[]>([])
  const [size, setSize] = useState({
    "max-size": 0,
    "total-size": 0
  })

  
  const getFileList = async () => {
    try {
      const response = await fetch(`/api/file`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Baerer ' + appContext.app.token
        }
      });
      const result = await response.json();
      
      return result.data
    } catch (error) {
      console.error("Erreur lors du partage de fichier :", error);
    }
  }

  const getSize = async () => {
    try {
      const response = await fetch(`/api/file/size`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Baerer ' + appContext.app.token
        }
      });
      const result = await response.json();
      return result.data
    } catch (error) {
      console.error("Erreur lors du partage de fichier :", error);
    }
  }



  const displayFile = (list:FileType[]) => {
    const buttons: buttonInterface = {shareFile : true, updateFile : true, deleteFile : true, downloadFile : true}
    return list.map((fileElement:FileType )=> {
      const displayFile: fileInterface = {
        id: fileElement.id,
        libelle: fileElement.libelle,
        description: fileElement.description ?? '',
        fileName: fileElement.fileName ?? '',
        mimetype: fileElement.mimetype,
        size: formatFileSize(fileElement.size),
      }
     return <FileComponent button={buttons} file={displayFile}/>
    })
  }

  useEffect(() => {
    const fetchFileList = async () => {
      try {
        const fileListResult = await getFileList(); 
        const sizeResult = await getSize(); 
        
        if (fileListResult && fileListResult.user) {
          setFileListUser(() => [...fileListResult.user]);
          setFileListOther(() => [...fileListResult.other]);
        }

        if (sizeResult) {
          setSize((prev) => ({ ...prev, ...sizeResult }))
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la liste des fichiers :", error);
      }
    };
    fetchFileList();
  }, []);

  
  return (
    <div className="home">
      <h1>Fichier</h1>
      <div className='context-user'>
        <div className="add-file">
          <Link to="/file" className='add-file-btn button-icon-text button-primary'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 48-48 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l48 0 0 48c0 8.8 7.2 16 16 16s16-7.2 16-16l0-48 48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0 0-48z"/>
            </svg>
            <span>Ajouter un fichier</span>
          </Link>
        </div>
        <div className="size">
          <p>{formatFileSize(size['total-size'])} sur {formatFileSize(size['max-size'])}</p>
          <p>Reste {formatFileSize(size['max-size'] - size['total-size'])} soit {Math.round(100 - (size['total-size'] / size['max-size'] * 100))} %</p>
        </div>
      </div>
      <div className="display-files">
        <div className="user-file">
          <h2>Mes fichiers</h2>
          <div>
            {
              displayFile(fileListUser)
            }
          </div>
        </div>
        {
          fileListOther.length >= 0 ? (
            <div className="other-file">
              <h2>Autres</h2>
              <div>
                {displayFile(fileListUser)}
              </div>
            </div>
          ) : null
        }
      </div>
    </div>
  );
};

export default HomeComponent;