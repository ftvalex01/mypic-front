/* eslint-disable react/prop-types */
import { useState } from 'react';
import './style.css';

const NameInput = ({ onNext, value, onChange, error }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Validación del nombre
  const validateName = (name) => {
    if (!name) return 'El nombre no puede estar vacío.';
    if (!isNaN(name)) return 'El nombre no puede contener solo números.';
    if (name.length < 2) return 'El nombre debe tener al menos 2 caracteres.';
    if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]/.test(name)) return 'El nombre no puede contener caracteres especiales o números.';
    return '';
  };

  // Manejo del foco y desenfoque de input
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(value !== '');
    const error = validateName(value);
    setValidationError(error);
  };

  // Manejo del cambio de input y validación inmediata
  const handleInputChange = (e) => {
    onChange(e.target.value);
    if (validationError) {
      setValidationError(validateName(e.target.value));
    }
  };

  // Manejo del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateName(value);
    if (!error) {
      onNext();
    } else {
      setValidationError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7 relative">
      <h3 className="text-2xl font-bold text-center text-burgundy mb-6">Pon tu nombre</h3>
      <div className="form-field">
        <label 
          htmlFor="name"
          className={`label ${isFocused || value ? 'focused' : ''}`}
        >
          Tu nombre completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder=" "
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleInputChange}
          className="input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-orange bg-corn-yellow"
        />
        {(validationError || error) && <p className="text-red-500 text-xs">{validationError || error}</p>}
      </div>
      <button 
        type="submit"
        className="w-full py-2 text-white rounded-md bg-amber-orange hover:bg-peach-yellow focus:outline-none focus:ring-2 focus:ring-amber-orange-hover focus:ring-opacity-50"
        style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
      >
        Continuar
      </button>
    </form>
  );
};

export default NameInput;
