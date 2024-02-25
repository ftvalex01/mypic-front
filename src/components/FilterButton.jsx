/* eslint-disable react/prop-types */
// Componente FilterButton.js
const FilterButton = ({ label, active, onClick }) => {
    return (
      <button
        onClick={onClick}
        className={`px-3 py-1 rounded-md text-sm font-medium focus:outline-none transition-colors ${
          active ? 'bg-blue-500 text-white' : 'bg-red-600 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {label}
      </button>
    );
  };
  
  export default FilterButton;
  