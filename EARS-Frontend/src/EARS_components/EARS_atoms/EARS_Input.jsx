import React from 'react';
import './EARS_Input.css';

const EARS_Input = ({ type = 'text', placeholder, value, onChange, name, id, required }) => {
  return (
    <input
      className="ears-input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      id={id}
      required={required}
    />
  );
};

export default EARS_Input;
