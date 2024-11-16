import { Navigate } from 'react-router-dom'
import { FC, ReactNode, useEffect, useState } from 'react'

import { useAppContext } from './AppContext'
import { useModalContext } from './ModalContext'
import ModalComponent from './components/ModalComponent'


interface PrivateRouteProps {
  children: ReactNode[]
}


const PrivateRoute: FC<PrivateRouteProps> =  ({ children }) => {
  const { openModal, closeModal } = useModalContext()
  const [state, setState] = useState<any>(children[0])

  if (!children.length){
    return <Navigate to="/auth/signin" />
  }

  const appContext = useAppContext()
  if (!appContext && children[1]) {
    return <>{children[1]}</>
  }
  if (!appContext) {
    return <Navigate to="/auth/signin" />
  }

  const confirm = () => {
    closeModal(true)
  }
  
  const cancel = () => {
    closeModal(false) 
  }

  const confirmModal = async () => {
    return openModal(
      <>
        <ModalComponent.Header>Déconnecté</ModalComponent.Header>
        <ModalComponent.Body>
          Vous avez été déconnecté, souhaitez-vous vous reconnecter ?
        </ModalComponent.Body>
        <ModalComponent.Footer>
        <ModalComponent.Cancel onClick={cancel} className="button-secondary">Annuler</ModalComponent.Cancel>
        <ModalComponent.Act onClick={confirm} className="button-error">Confirmer</ModalComponent.Act>
        </ModalComponent.Footer>
      </>
    )
  }

  useEffect((() => {
    const isTokenValid = appContext.verifyToken()
    if (isTokenValid === null) {
      setState(()=>children[1])
    } else if (!isTokenValid) {
      confirmModal()
      .then(reuslt => {
        if(reuslt){
          setState(<Navigate to="/auth/signin" />)
        } else {
          setState(<Navigate to="/download" />)
        }
      })
    } else {

      setState(()=>children[0])
    }
  }), [appContext])

  return <>{state}</>
}

export default PrivateRoute