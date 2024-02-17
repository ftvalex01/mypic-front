/* eslint-disable react/prop-types */
import { useState } from 'react';
import useAuthContext from '../context/AuthContext'; // Verifica la ruta.

const UserNameInput = ({ onNext, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const { fetchUserByUsername } = useAuthContext(); // Asegúrate de que esta función esté implementada.

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(value !== '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Intenta buscar el nombre de usuario.
      const userExists = await fetchUserByUsername(value);
      setLoading(false);
      if (userExists) {
        alert('El nombre de usuario ya existe.');
      } else {
        // Si el usuario no existe, permite continuar.
        onNext();
      }
    } catch (error) {
      setLoading(false);
      // Considera un manejo de errores más detallado según tu API.
      alert('Error al verificar el nombre de usuario. Intente de nuevo.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <h3 className="text-2xl font-bold text-center text-burgundy mb-6">Crea un nombre de usuario</h3>
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
          className="input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-orange bg-corn-yellow"
          disabled={loading}
        />
      </div>
      <button 
        type="submit"
        className="w-full py-2 text-white rounded-md bg-amber-orange hover:bg-peach-yellow focus:outline-none focus:ring-2 focus:ring-amber-orange-hover focus:ring-opacity-50"
        disabled={loading}
      >
        {loading ? 'Comprobando...' : 'Siguiente'}
      </button>
    </form>
  );
};

export default UserNameInput;
