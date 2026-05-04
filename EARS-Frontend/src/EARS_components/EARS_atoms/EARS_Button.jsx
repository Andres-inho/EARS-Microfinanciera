import React from 'react';
import './EARS_Button.css';

const EARS_Button = ({ children, onClick, type = 'button', variant = 'primary', fullWidth, disabled }) => {
  return (
    <button
      className={`ears-btn ears-btn-${variant} ${fullWidth ? 'ears-btn-full' : ''}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default EARS_Button;
