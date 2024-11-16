import { ChangeEvent, DragEvent, useEffect, useState } from 'react'

import ModalComponent from './ModalComponent'
import { useAppContext } from '../AppContext'
import { useModalContext } from '../ModalContext'
import FileComponent, { buttonInterface, fileInterface } from './FileComponent' 

import './../assets/components/homeComponent.css'
import './../assets/components/fileCreate.css'


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
  const units = ['Octets', 'Ko', 'Mo', 'Go', 'To']
  let size = sizeInBytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`
}


const HomeComponent: React.FC = () => {
  const appContext = useAppContext()
  const [fileListUser, setFileListUser] = useState<FileType[]>([])
  const [fileListOther, setFileListOther] = useState<FileType[]>([])
  const [size, setSize] = useState({
    "max-size": 0,
    "total-size": 0
  })
  const {openModal, closeModal} = useModalContext()
  const [isDisabled, setIsDisabled] = useState(false)

  
  const getFileList = async () => {
    const token = await appContext.getToken()
    
    try {
      const response = await fetch(`/api/file`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      const result = await response.json()
      
      return result.data
    } catch (error) {
      console.error("Erreur lors du partage de fichier :", error)
    }
  }


  const getSize = async () => {
    const token = await appContext.getToken()
    try {
      const response = await fetch(`/api/file/size`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      const result = await response.json()
      return result.data
    } catch (error) {
      console.error("Erreur lors du partage de fichier :", error)
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
     return <FileComponent button={buttons} fileProps={displayFile} key={fileElement.id}/>
    })
  }

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        const fileListResult = await getFileList() 
        const sizeResult = await getSize()

        if (fileListResult?.user) {
          setFileListUser(fileListResult.user)
        } else {
          setFileListUser([])
        }
  
        if (fileListResult?.other) {
          setFileListOther(fileListResult.other)
        } else {
          setFileListOther([])
        }
  
        if (sizeResult) {
          setSize(sizeResult)
        } else {
          setSize({
            "max-size": 0,
            "total-size": 0,
          })
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation du composant :", error)
      }
    }
  
    initializeComponent()
  }, [])

  const addFile = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault() 
    setIsDisabled(true)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault()
      const form = event.currentTarget

      const data: any = {
        libelle: form.libelle.value,
        description: form.description.value,
        file: document.querySelector<HTMLInputElement>('#file')?.files?.[0]
      }

      closeModal(data)
    }
    
    const handleDragOver = (event: DragEvent<HTMLLabelElement>): void => {
      event.preventDefault()
      event.stopPropagation()
      event.currentTarget.classList.add('drag')
    }
    
    const handleDragLeave = (event: DragEvent<HTMLLabelElement>): void => {
      event.preventDefault()
      event.stopPropagation()
      event.currentTarget.classList.remove('drag')
    }
    
    const handleDrop = (event: DragEvent<HTMLLabelElement>): void => {
      event.preventDefault()
      event.stopPropagation()
      
      const dt = event.dataTransfer
      const files = dt.files
      
      if (files.length) {
        const fileInput = document.querySelector<HTMLInputElement>('#file')
        if (fileInput) {
          const dataTransfer = new DataTransfer()
          dataTransfer.items.add(files[0])
          fileInput.files = dataTransfer.files
        }
        updateFileDisplay(files[0])
      }
      event.currentTarget.classList.add('drop')
    }
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
      const files = e.target.files
      if (files?.length) {
        updateFileDisplay(files[0])
      }
    }
    
    const updateFileDisplay = (file: File): void => {
      const fileBlock = document.querySelector<HTMLDivElement>('.file-block')
      const fileName = document.querySelector<HTMLSpanElement>('.file-name')
      const fileSize = document.querySelector<HTMLSpanElement>('.file-size')
      
      if (fileBlock && fileName && fileSize) {
        fileName.textContent = file.name
        fileSize.textContent = formatFileSize(file.size)
        fileBlock.style.visibility = 'visible'
      }
    }
    
    const removeFile = (): void => {
      const fileInput = document.querySelector<HTMLInputElement>('#file')
      const fileBlock = document.querySelector<HTMLDivElement>('.file-block')
      const fileName = document.querySelector<HTMLSpanElement>('.file-name')
      const fileSize = document.querySelector<HTMLSpanElement>('.file-size')
      const fileLabel = document.querySelector<HTMLSpanElement>('label[for="file"]')
      
      if (fileBlock && fileName && fileSize && fileInput && fileLabel) {
        fileName.textContent = 'No file selected'
        fileSize.textContent = ''
        fileBlock.style.visibility = 'hidden'
        fileInput.value = ''
        fileLabel.classList.remove('drag', 'drop')
      }
    }

    const cancel = async (): Promise<void> => {
      closeModal(false)
      setIsDisabled(false)
    }
    
    const result = await openModal(
      <>
        <ModalComponent.Header>Ajouter un fichier</ModalComponent.Header>
        <ModalComponent.Body>
          <div className="file__create">
            <form id="myForm" name="myForm" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="libelle" className="interact-field">
                  <fieldset>
                    <input 
                      type="text" 
                      tabIndex={1} 
                      placeholder="Libellé" 
                      name="libelle" 
                      id="libelle" 
                      autoComplete="off" 
                      minLength={2}
                      required
                    />
                    <legend>Libellé</legend>
                  </fieldset>
                </label>
                <div>
                  <button type='button' className="button-outline-info btn-tooltip">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
                      <path d="M48 80a48 48 0 1 1 96 0A48 48 0 1 1 48 80zM0 224c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 224 32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32l32 0 0-192-32 0c-17.7 0-32-14.3-32-32z"/>
                    </svg>
                  </button>
                  <div className="info-tooltip">
                    <p>Veuillez entrer au moins 2 caractères, uniquement lettres et chiffres.</p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="interact-field">
                  <fieldset>
                    <input 
                      type="text" 
                      tabIndex={2} 
                      placeholder="Description" 
                      name="description" 
                      id="description" 
                      autoComplete="off"
                    />
                    <legend>Description</legend>
                  </fieldset>
                </label>
              </div>

              <div className='addFile'>
                <label 
                  htmlFor='file'
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 192 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-210.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-64z"/>
                  </svg>
                  <h4>Glisser & déposer</h4>
                  <input 
                    type="file" 
                    tabIndex={3} 
                    placeholder="File" 
                    name="file" 
                    id="file" 
                    required
                    onChange={handleFileChange}
                  />
                </label>
                <div className="file-block">
                  <div className="file-info">
                    <span className="file-name">No file selected</span><span className="file-size">0</span>
                  </div>
                  <div className="file-button">
                    <span onClick={removeFile}>Delete</span>
                  </div>
                </div>
              </div>

              <div className="actions">
                <button tabIndex={6} className='button-error cancel' onClick={cancel} type="button">Annuler</button>
                <button type="reset" className='button-secondary' tabIndex={5}>Reinitialiser</button>
                <button type="submit" tabIndex={4}>Valider</button>
              </div>
            </form>
          </div>
        </ModalComponent.Body>
      </>
    )
    
    if (result){
      const formdata = new FormData()
      formdata.append("libelle", result.libelle)
      formdata.append("description", result.description)
      formdata.append("file", result.file)

      try {
        const token = await appContext.getToken()
        const response = await fetch(`/api/file`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formdata
        })
        const res = await response.json()
        if (!res.data){
          throw new Error('Fichier non supprimer')
        }
        setFileListUser((prev) => [...prev, res.data])
      } catch (error) {
        console.error("Erreur lors de l'ajout fichier :", error)
      }
    }
    setIsDisabled(false)
  }

  return (
    <div className="home">
      <h1>Fichier</h1>
      <div className='context-user'>
        <div className={`add-file ${isDisabled ?'disabled': ''}`}>
          <button className='add-file-btn button-icon-text button-primary' onClick={addFile} disabled={isDisabled}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 48-48 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l48 0 0 48c0 8.8 7.2 16 16 16s16-7.2 16-16l0-48 48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0 0-48z"/>
            </svg>
            <span>Ajouter un fichier</span>
          </button>
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
          fileListOther.length > 0 ? (
            <div className="other-file">
              <h2>Autres</h2>
              <div>
                {displayFile(fileListOther)}
              </div>
            </div>
          ) : null
        }
      </div>
    </div>
  )
}

export default HomeComponent