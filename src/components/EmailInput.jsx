import { useState } from "react";

const EmailInput = ({ onNext, value, onChange, error }) => {
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false); // Estado añadido aquí

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true); // Marca que el usuario ha intentado enviar el formulario

    if (!validateEmail(value)) {
      setEmailError('Por favor introduce un correo electrónico válido.');
      // No procedas a onNext si el correo no es válido
      return;
    }
    // Si el correo es válido, limpia el mensaje de error y continúa
    setEmailError('');
    onNext();
  };

  const handleEmailChange = (e) => {
    onChange(e.target.value);
    // Opcionalmente, restablece el estado de submitted si quieres que el mensaje de error desaparezca al empezar a editar
    setSubmitted(false);
    setEmailError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          placeholder="Introduce tu correo electrónico"
          value={value}
          onChange={handleEmailChange}
          className="w-full px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-amber-orange focus:outline-none bg-corn-yellow"
        />
        {submitted && emailError && <p className="text-red-500 text-xs mt-2">{emailError}</p>}
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
