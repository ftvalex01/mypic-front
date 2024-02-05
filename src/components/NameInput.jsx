/* eslint-disable react/prop-types */



const NameInput = ({ onNext, value, onChange, error }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Tu nombre completo"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-orange bg-corn-yellow"
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
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

