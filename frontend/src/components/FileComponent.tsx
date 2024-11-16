import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import './../assets/components/fileUpdate.css'
import '../assets/components/fileComponent.css'

import { useAppContext } from '../AppContext'
import ModalComponent from './ModalComponent'
import { useModalContext } from '../ModalContext'
import { LinkInitialStateType, LinkServices } from '../redux/slice/LinkSlice'


export interface fileInterface {
  id: number,
  libelle: string,
  description?: string,
  fileName?: string,
  mimetype: string,
  size: string,
}

export interface buttonInterface {
  shareFile?: boolean,
  updateFile?: boolean,
  deleteFile?: boolean,
  downloadFile?: boolean,
  downloadFileWithToken?: boolean,
}

interface FileComponentProps {
  fileProps : fileInterface
  button : buttonInterface
}

const getGoodLink = (data:{ link: LinkInitialStateType}, fileId:number ) => {
  return data.link.linkList
    .filter(link => link.fileId === fileId)
    .sort((a, b) =>new Date(b.exp).getTime() - new Date(a.exp).getTime())
}

const FileComponent: React.FC<FileComponentProps> = ({fileProps, button}) => {
  const [file, setFile] = useState<fileInterface>(fileProps)
  const appContext = useAppContext()
  const { openModal, closeModal } = useModalContext()
  const dispatch = useDispatch()
  const linkList = useSelector((state:{ link: LinkInitialStateType}) => state.link.linkList)
  const [isDisabled, setIsDisabled] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  const [link, setLink] = useState<string>('')

  const filteredLinkList = useMemo(() => {
    return getGoodLink({ link: { linkList } }, file.id)
  }, [linkList, file.id])

  useEffect(() => {
    if (filteredLinkList.length > 0) {
      const link = linkList.find((link)=> link.fileId === file.id)?.jwt
      setLink(`${appContext.app.host}/share?token=${link}`)
    }
  }, [])

  const handleCopy = (event: React.MouseEvent<HTMLButtonElement | HTMLParagraphElement>, url: string) => {
    event.preventDefault()
    navigator.clipboard.writeText(url)
  }

  const handleRedirect = (event: React.MouseEvent<HTMLButtonElement>, url: string) => {
    event.preventDefault()
    window.open(url)
  }

  const handleClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    const target = (event.target as HTMLElement).closest('button') as HTMLButtonElement | null
    setIsDisabled(() => true)
    switch (target?.name) {
      case 'createLink':
        await createLink()
        break
      case 'downloadFile': 
        await downloadFile()
        break
      case 'downloadFileWithToken': 
        await downloadFileWidthToken()
        break
      case 'updateFile': 
        await updateFile()
        break
      case 'deleteFile': 
        await deleteFile()
        break
      default: 
        null
        break
      }
    setIsDisabled(() => false)
  }

  const createLink = async () => {
    try {
      const authToken = await appContext.getToken()
      const response = await fetch(`/api/link`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file_id: file.id
        })
      })
      const result = await response.json()
      const url = result.data.url 
      const urlObj = new URL(url)
      const token = urlObj.searchParams.get("token")
      if (token) {
        setLink(url)
        dispatch(LinkServices.actions.addLink(token))
      }
    } catch (error) {
      console.error("Erreur lors du partage de fichier :", error)
    }
  }

  const downloadFile = async () => {
    try {
      const token = await appContext.getToken()
      const response = await fetch(`api/file/${file.id}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const fileName = response?.headers?.get('Content-Disposition')?.replace(/.*filename="(.+?)".*/, '$1') ?? 'undifined'
      const link = document.createElement('a')
      link.href = url
      link.download =  fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Erreur lors du téléchargement de fichier :", error)
    }
  }

  const downloadFileWidthToken = async () => {
    try {
      const tokenparam = new URLSearchParams(window.location.search).get('token')
      const response = await fetch(`api/share/download?token=${tokenparam}`, {
        method: 'GET'
      })

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const fileName = response?.headers?.get('Content-Disposition')?.replace(/.*filename="(.+?)".*/, '$1') ?? 'undifined'
      const link = document.createElement('a')
      link.href = url
      link.download =  fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Erreur lors du téléchargement de fichier :", error)
    }
  }

  const updateFile = async () => {
    interface formReturn {libelle:string, description:string, fileName:string}

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const value : formReturn = {      
        libelle : event.currentTarget.libelle.value ?? event.currentTarget.defaultValue.value,
        description: event.currentTarget.description.value ?? event.currentTarget.defaultValue.value,
        fileName: event.currentTarget.fileName.value ?? event.currentTarget.defaultValue.value
      }
      closeModal(value)
    }
    
    const confirm = async () => {
      closeModal(true) 
    }

    const cancel = async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      closeModal(false) 
    }
  

    const result: formReturn = await openModal(
      <>
        <ModalComponent.Header>{'Modification de ' + file.libelle}</ModalComponent.Header>
        <ModalComponent.Body>
          <div className="file__update">
            <form name='update' onSubmit={handleSubmit}>
              <div>
                <label htmlFor="libelle" className="interact-field">
                  <fieldset>
                    <input type="text" tabIndex={1} placeholder="Libellé" name="libelle" id="libelle" autoComplete="off" minLength={2} defaultValue={file.libelle}/>
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
                    <input type="text" tabIndex={2} placeholder="Description" name="description" id="description" autoComplete="off" defaultValue={file.description}/>
                    <legend>Description</legend>
                  </fieldset>
                </label>
              </div>

              <div>
                <label htmlFor="fileName" className="interact-field">
                  <fieldset>
                    <input type="text" tabIndex={3} placeholder="Nom du fichier" name="fileName" id="fileName" autoComplete="off" minLength={2} pattern="^[A-Za-z0-9_\-]+$" defaultValue={file.fileName}/>
                    <legend>Nom du fichier</legend>
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

              <div className="actions">
                <button tabIndex={6} className='button-error cancel' onClick={cancel}>Annuler</button>
                <button type="reset" className='button-secondary' tabIndex={5}>Reinitialiser</button>
                <button type="submit" tabIndex={4}>Valider</button>
              </div>

            </form>
          </div>
        </ModalComponent.Body>
      </>
    )

    if (result) {
      const result2 = await openModal(
        <>
          <ModalComponent.Header>Confirmation</ModalComponent.Header>
          <ModalComponent.Body>
            <div className="file__update-confirm">
              <p><span className='info-name'>Libelle: </span>{result.libelle}</p>
              <p><span className='info-name'>Description: </span>{result.description}</p>
              <p><span className='info-name'>Nom du fichier: </span>{result.fileName}</p>
            </div>
          </ModalComponent.Body>
          <ModalComponent.Footer>
            <ModalComponent.Cancel onClick={cancel} className="button-secondary">Annuler</ModalComponent.Cancel>
            <ModalComponent.Act onClick={confirm}>Confirmer</ModalComponent.Act>
          </ModalComponent.Footer>
        </>
      )

      if (result2) {
        const update: Partial<formReturn> = {}

        if (result.libelle !== file.libelle) update.libelle = result.libelle
        if (result.description !== file.description) update.description = result.description
        if (result.fileName !== file.fileName) update.fileName = result.fileName

        if (Object.keys(update).length > 0) {
          try {
            const token = await appContext.getToken()
            const response = await fetch(`/api/file/${file.id}`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(update)
            })
            const result = await response.json()
            setFile((prev) => ({
              ...prev,
              libelle: result.data.libelle,
              description: result.data.description,
              fileName: result.data.fileName,
            }))
          } catch (error) {
            console.error("Erreur lors du partage de fichier :", error)
          }
        }
      }
    }
  }

  const deleteFile = async () => {
    const confirm = async () => {
      closeModal(true)
    }
    
    const cancel = async () => {
      closeModal(false) 
    }

    const result = await openModal(
      <>
        <ModalComponent.Header>Confirmation</ModalComponent.Header>
        <ModalComponent.Body>Êtes-vous sûr de vouloir continuer ?</ModalComponent.Body>
        <ModalComponent.Footer>
          <ModalComponent.Cancel onClick={cancel} className="button-secondary">Annuler</ModalComponent.Cancel>
          <ModalComponent.Act onClick={confirm} className="button-error">Confirmer</ModalComponent.Act>
        </ModalComponent.Footer>
      </>
    )
    
    if (result){
      try {
        const token = await appContext.getToken()
        ref.current ? ref.current.remove(): null
        const response = await fetch(`/api/file/${file.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
          }
        })
        const result = await response.json()
        if (!result.data){
          throw new Error('Fichier non supprimer')
        }
      } catch (error) {
        console.error("Erreur lors de la suppression de fichier :", error)
      }
    }

  }

  return (
    <div className="file" ref={ref}>
      <div className="file-header">
        <h3>{file.libelle}</h3>
        {
        file.description && (
          <>
            <h5>Résumé</h5>
            <p>{file.description}</p>
          </>
          )
        } 
      </div>
      <div className="file-info">
        <h4>Informations</h4>
        <p><span className='info-name'>Nom du fichier </span>{file.fileName}</p>
        <p><span className='info-name'>Types MIME </span>{file.mimetype}</p>
        <p><span className='info-name'>Taille </span>{file.size}</p>
        {link && (
          <div className="link">
            <h5>Lien</h5>
            <p onClick={(event) => handleCopy(event, link)}>{link}</p>
            <div className="link-action">
              <button className="button-outline-primary" onClick={(event) => handleCopy(event, link)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z"/>
                </svg>
              </button>
              <button className="button-outline-primary" onClick={(event) => handleRedirect(event, link)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"/>
                </svg>
              </button>
            </div>
          </div> 
        )}
      </div>
      <div className={`file-action ${isDisabled ?'disabled': ''}`} onClick={handleClick}>
        {button.shareFile && (
          <button className="button-success" name="createLink" disabled={isDisabled}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z"/>
          </svg>
          </button>
        )}
        {button.downloadFile && (
          <button className="button-primary" name="downloadFile" disabled={isDisabled}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 192 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-210.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-64z"/>
            </svg>
          </button>
        )}
        {button.downloadFileWithToken && (
          <button className="button-primary" name="downloadFileWithToken" disabled={isDisabled}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 192 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-210.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-64z"/>
            </svg>
          </button>
        )}
        {button.updateFile && (
          <button className="button-warning" name="updateFile" disabled={isDisabled}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/>
            </svg>
          </button>
        )}
        {button.deleteFile && (
          <button className="button-error" name="deleteFile" disabled={isDisabled}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default FileComponent
