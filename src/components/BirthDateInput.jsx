/* eslint-disable react/prop-types */

import Swal from 'sweetalert2';

const BirthDateInput = ({ onNext, birthDate, onChange, error }) => {
  const handleDateChange = (e) => {
    onChange(e.target.value);
  };
  // Función para calcular la edad
  const calculateAge = (birthDate) => {
    const dob = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };


  // Validar si el usuario tiene al menos 18 años
  const isEighteenOrOlder = (birthDate) => {
    console.log(birthDate)
    return calculateAge(birthDate) >= 18;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Verificar si el usuario tiene 18 años o más
    if (isEighteenOrOlder(birthDate)) {
      onNext(); // Pasa al siguiente componente si la verificación de edad es exitosa
    } else {
      // Si el usuario no tiene 18 años, mostrar un mensaje de error con SweetAlert
      Swal.fire('Error', 'Debes tener al menos 18 años para registrarte.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="date"
          placeholder="Fecha de nacimiento"
          value={birthDate}
          onChange={handleDateChange}
          className="w-full px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-amber-orange focus:outline-none bg-corn-yellow"
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
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

export default BirthDateInput;
