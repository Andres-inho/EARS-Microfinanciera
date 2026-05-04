import React from 'react';
import EARS_Input from '../EARS_atoms/EARS_Input.jsx';
import './EARS_FormField.css';

const EARS_FormField = ({ label, type, placeholder, value, onChange, name, id, required }) => {
  return (
    <div className="ears-form-field">
      <label htmlFor={id} className="ears-label">{label}</label>
      <EARS_Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        required={required}
      />
    </div>
  );
};

export default EARS_FormField;
