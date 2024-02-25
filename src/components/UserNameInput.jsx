/* eslint-disable react/prop-types */
import { useState } from 'react';
import useAuthContext from '../context/AuthContext'; // Verifica la ruta.
import Swal from 'sweetalert2';
const UserNameInput = ({ onNext, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const { checkUsernameAvailability } = useAuthContext(); // Asegúrate de que esta función esté implementada.

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(value !== '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await checkUsernameAvailability(value);
      setLoading(false);
      // Aquí manejas la respuesta dependiendo del mensaje o del código de estado
      if (response.message === 'Username is available') {
        // El nombre de usuario está disponible, permite continuar
        onNext();
      } else {
        // Manejar otros casos o ignorar si no es necesario
        Swal.fire({
          icon: 'error',
          title: 'Nombre de usuario existente',
          text: 'El nombre de usuario ya está en uso. Por favor, elige otro.',
        });
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 409) {
        // Aquí manejas específicamente el caso de conflicto
        Swal.fire({
          icon: 'error',
          title: 'Nombre de usuario existente',
          text: 'El nombre de usuario ya está en uso. Por favor, elige otro.',
        });
      } else {
        // Maneja otros errores no relacionados con la disponibilidad del nombre de usuario
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al verificar el nombre de usuario. Por favor, inténtalo de nuevo.',
        });
      }
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <h3 className="text-2xl my-3 font-bold text-center text-fireEngineRed">Crea un nombre de usuario</h3>
      <div className="form-field">
        <label htmlFor="username" className={`label ${isFocused || value ? 'focused' : ''}`}>
          Nombre de usuario
        </label>
        <input
          id="username"
          type="text"
          name="username"
          required
          placeholder=" "
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => onChange(e.target.value)}
          className="input-field w-full px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-darkSienna focus:outline-none"
        />
      </div>
      <button
        className="button-primary w-full py-2 rounded-md hover:bg-darkSienna focus:outline-none focus:ring-2 focus:ring-darkSienna-hover focus:ring-opacity-50"
        disabled={loading}
      >
        {loading ? 'Comprobando...' : 'Siguiente'}
      </button>
    </form>
  );
};

export default UserNameInput;
