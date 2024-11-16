import React, { useRef } from 'react'

import './../assets/components/modalComponent.css'

import { useModalContext } from '../ModalContext'


type ModalComponentProps = {
  children?: React.ReactNode
}

type HeaderProps = { className?: string, children: React.ReactNode }
type BodyProps = { className?: string, children: React.ReactNode }
type FooterProps = { className?: string, children: React.ReactNode }
type CancelProps = { className?: string, onClick: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>, children?: React.ReactNode }
type ActProps = { className?: string, onClick:()=>any, children?: React.ReactNode }

const Header: React.FC<HeaderProps> = ({ className, children }) => (
  <div className={`modal__header ${className ?? ''}`}>
    <h3>{children}</h3>
  </div>
)

const Body: React.FC<BodyProps> = ({ className, children }) => (
  <div className={`modal__body ${className ?? ''}`}>{children}</div>
)

const Footer: React.FC<FooterProps> = ({ className, children }) => (
  <div className={`modal__footer ${className ?? ''}`}>{children}</div>
)

const Cancel: React.FC<CancelProps> = ({ className, onClick, children }) => (
  <button className={`modal__cancel ${className ?? ''}`} onClick={onClick}>
    {children ?? 'Annuler'}
  </button>
)

const Act: React.FC<ActProps> = ({ className, onClick, children }) => (
  <button className={`modal__submit ${className ?? ''}`} onClick={onClick}>
    {children ?? 'Confirmer'}
  </button>
)


const ModalComponent: React.FC<ModalComponentProps> & {
  Header: typeof Header
  Body: typeof Body
  Footer: typeof Footer
  Act: typeof Act
  Cancel: typeof Cancel
} = ({ children }) => {
  const modal = useModalContext()
  const modalRef = useRef<HTMLDivElement | null>(null)

  const handleClickOutside = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      modal.closeModal(false)
    }
  }

  return (
    <div className="modal" onMouseDown={handleClickOutside}>
      <div className="modal__content" ref={modalRef}>
        <div className="modal__close" onClick={()=>modal.closeModal(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
          </svg>
        </div>
        {children}
      </div>
    </div>
  )
}

ModalComponent.Header = Header
ModalComponent.Body = Body
ModalComponent.Footer = Footer
ModalComponent.Act = Act
ModalComponent.Cancel = Cancel

export default ModalComponent
