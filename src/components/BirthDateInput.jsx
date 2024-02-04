/* eslint-disable react/prop-types */
const BirthDateInput = ({ onNext, birthDate, onChange, error }) => {
  const handleDateChange = (e) => {
    onChange(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
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
