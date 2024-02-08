/* eslint-disable react/prop-types */
import { useState } from 'react';
import useAuthContext from '../context/AuthContext'; // Asegúrate de que la ruta sea correcta.

const UserNameInput = ({ onNext, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const { fetchUserByUsername } = useAuthContext();

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(value !== '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Indica que se está cargando/comprobando
    try {
      // Se asume que si el usuario no existe, la función lanzará un error
      await fetchUserByUsername(value);
      // Si llega a este punto sin errores, el nombre de usuario ya existe
      setLoading(false);
      alert('El nombre de usuario ya existe.');
    } catch (error) {
      // Se asume que un error indica que el nombre de usuario no existe
      setLoading(false);
      if (error.response.status === 404) {
        // El nombre de usuario no existe, por lo que se puede proceder
        onNext();
      } else {
        // Manejo de otros posibles errores de la red, servidor, etc.
        alert('Error al verificar el nombre de usuario. Intente de nuevo.');
      }
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
        style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
        disabled={loading}
      >
        {loading ? 'Comprobando...' : 'Siguiente'}
      </button>
    </form>
  );
};

export default UserNameInput;
