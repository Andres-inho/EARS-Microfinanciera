import React from 'react';
import { X } from 'lucide-react';
import './EARS_Modal.css';

const EARS_Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="ears-modal-overlay">
      <div className="ears-modal-content ears-glass ears-animate-fade">
        <div className="ears-modal-header">
          <h3>{title}</h3>
          <button className="ears-modal-close" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>
        <div className="ears-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default EARS_Modal;
