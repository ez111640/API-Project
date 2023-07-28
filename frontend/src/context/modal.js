import React, {useContext, useRef, useState} from 'react'
import "./Modal.css"
import  ReactDOM  from 'react-dom';

const ModalContext = React.createContext();

function ModalProvider({children}) {
    const modalRef = useRef();
const [modalContent, setModalContent]  = useState(null);
const [onModalClose, setOnModalClose] = useState(null)


    const closeModal = () => {
        setModalContent(null)
        if(typeof onModalClose === 'function') {
            setOnModalClose(null);
            onModalClose();
        }
    }

    const contextValue = {
        modalRef,
        modalContent,
        onModalClose,
        setModalContent,
        setOnModalClose,
        closeModal,
    }
    return (

        <>
        <ModalContext.Provider
        value={contextValue}>
            {children}
            </ModalContext.Provider>
        <div ref={modalRef}></div>
        </>
    )
}

export function Modal(){
    const {modalRef, modalContent, closeModal} = useContext(ModalContext)

    if(!modalRef || !modalRef.current || !modalContent) return null;

    return ReactDOM.createPortal(
        <div id="modal">
            <div id="modal-background" onClick={closeModal} />
            <div id="modal-content">{modalContent}</div>
        </div>,
        modalRef.current
    )
}
export const useModal = () => useContext(ModalContext);

export default ModalProvider;
