import React, { useState } from 'react';
import validator from 'validator';
import Swal from 'sweetalert2';
import useAuthContext from '../context/AuthContext'; // Asegúrate de usar la ruta correcta a tu AuthContext

const EmailInput = ({ onNext, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const { checkEmailUnique } = useAuthContext();

  const validateEmail = (email) => {
    return validator.isEmail(email);
  };

  const handleEmailChange = (e) => {
    onChange(e.target.value);
  };

  const handleEmailBlur = async () => {
    if (!validateEmail(value)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor introduce un correo electrónico válido.',
      });
      return;
    }

    setLoading(true);
    const response = await checkEmailUnique(value);
    setLoading(false);
    if (response.message === 'El correo electrónico ya está registrado.') {
      Swal.fire({
        icon: 'error',
        title: 'Correo electrónico en uso',
        text: response.message,
      });
    } else {
      // Si quieres, aquí podrías mostrar una confirmación de que el correo está disponible
      // Swal.fire('¡Perfecto!', 'El correo electrónico está disponible.', 'success');
      onNext(); // El correo electrónico está disponible, procede al siguiente paso
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(value)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor introduce un correo electrónico válido.',
      });
      return;
    }
    handleEmailBlur(); // Realiza la verificación al enviar el formulario
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(value !== ''); // Ajusta el estado de enfoque basado en si el valor está presente
    handleEmailBlur(); // Verifica la unicidad del correo electrónico al perder el foco
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <h3 className="text-2xl my-3 font-bold text-center text-fireEngineRed">Correo electrónico</h3>
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
          className="input-field w-full px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-darkSienna focus:outline-none"
          disabled={loading} // Deshabilita el input durante la carga
        />
      </div>
      <button
 
        className="button-primary w-full py-2 rounded-md hover:bg-darkSienna focus:outline-none focus:ring-2 focus:ring-darkSienna-hover focus:ring-opacity-50"
        disabled={loading} // Deshabilita el botón durante la carga
      >
        {loading ? 'Comprobando...' : 'Siguiente'}
      </button>
    </form>
  );
};

export default EmailInput;
