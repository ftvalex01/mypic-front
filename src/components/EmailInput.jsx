/* eslint-disable react/prop-types */
import  { useState } from 'react';
import validator from 'validator';


const EmailInput = ({ onNext, value, onChange }) => {
  const [emailError, setEmailError] = useState('');
  const [isFocused, setIsFocused] = useState(false); // Estado para gestionar el enfoque

  const validateEmail = (email) => {
    return validator.isEmail(email);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(value)) {
      setEmailError('Por favor introduce un correo electrónico válido.');
      return;
    }
    setEmailError('');
    onNext();
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(value !== ''); // Mantén el label arriba si hay contenido

  const handleEmailChange = (e) => {
    onChange(e.target.value);
    setEmailError(''); // Opcionalmente, restablece el mensaje de error al editar
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="form-field">
        <label htmlFor="email" className={`label ${isFocused || value ? 'focused' : ''}`}>
          Introduce tu correo electrónico
        </label>
        <input
          id="email"
          type="email"
          required
          placeholder=" "
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleEmailChange}
          className="input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-orange bg-corn-yellow"
        />
        {emailError && <p className="text-red-500 text-xs mt-2">{emailError}</p>}
      </div>
      <button
        type="submit"
        className="w-full py-2 text-white rounded-md bg-amber-orange hover:bg-peach-yellow focus:outline-none focus:ring-2 focus:ring-amber-orange-hover focus:ring-opacity-50"
        style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
      >
        Siguiente
      </button>
    </form>
  );
};

export default EmailInput;
