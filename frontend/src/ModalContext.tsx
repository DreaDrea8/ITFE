import React, { createContext, useContext, useState, ReactNode, useRef } from 'react'

import ModalComponent from './components/ModalComponent'

type ModalContextType = {
  openModal: (content: ReactNode) => Promise<any>
  closeModal: (result: any) => void | Promise<any>
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const useModalContext = (): ModalContextType => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider')
  }
  return context
}

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [modalContent, setModalContent] = useState<ReactNode>(null)
  const resolveRef = useRef<((value: boolean) => void) | null>(null)

  const openModal = (content: ReactNode): Promise<any> => {
    return new Promise((resolve) => {
      setModalContent(content)
      setIsOpen(true)
      resolveRef.current = resolve 
    })
  }

  const closeModal = (result: any) => {
    if (resolveRef.current) {
      resolveRef.current(result)
      resolveRef.current = null 
    } 
    setIsOpen(false)
    setModalContent(null)
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      <div id="content" className={isOpen ? 'disabled' : ''}>
        {children}
      </div>
      {isOpen && <ModalComponent>{modalContent}</ModalComponent>}
    </ModalContext.Provider>
  )
}