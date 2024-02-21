// src/components/Modal.js
import React from 'react';
import ReactDOM from 'react-dom';
import './BlockModal.css'
const BlockModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <>
            <div className="modal-overlay" onClick={onClose} />
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>Cerrar</button>
                {children}
            </div>
        </>,
        document.getElementById('modal-root') // Asegúrate de tener un div con este id en tu index.html
    );
};

export default BlockModal;
