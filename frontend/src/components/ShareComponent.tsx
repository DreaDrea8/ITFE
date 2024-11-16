import { useState, useEffect } from 'react'

import './../assets/components/shareComponent.css'

import { FileType, formatFileSize } from './HomeComponent'
import FileComponent, { buttonInterface, fileInterface } from './FileComponent'


const ShareComponent: React.FC = () => {
  const [file, setFile] = useState<FileType>()
  let fileToken = ''
  
  const getFile = async () => {
    try {
      const response = await fetch(`/api/share/file?token=${fileToken}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const result = await response.json()
      
      return result.data
    } catch (error) {
      console.error("Erreur lors du partage de fichier :", error)
    }
  }

  const displayFile = (file:FileType) => {
    const buttons: buttonInterface = {downloadFileWithToken : true}
    const displayFile: fileInterface = {
      id: file.id,
      libelle: file.libelle,
      description: file.description ?? '',
      fileName: file.fileName ?? '',
      mimetype: file.mimetype,
      size: formatFileSize(file.size),
    }
    return <FileComponent button={buttons} fileProps={displayFile} key={file.id}/>
  }
  
  useEffect(() => {
    const tokenparam = new URLSearchParams(window.location.search).get('token')

    if (tokenparam){
      fileToken = tokenparam
    }

    console.log(fileToken)

    const initializeComponent = async () => {
      try {
  
        const fileResult = await getFile() 

        if (fileResult) {
          setFile(fileResult)
        }
        
      } catch (error) {
        console.error("Erreur lors de l'initialisation du composant :", error)
      }
    }
    initializeComponent()
  }, [])
  
  return (
    <div className="share">
      <h1>Partage de fichiers</h1>
      <div>
        {
          file ? displayFile(file) : 'File not found'
        }
      </div>
    </div>
  )
}

export default ShareComponent