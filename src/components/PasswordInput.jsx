/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const PasswordInput = ({ onNext, password, confirmPassword, onPasswordChange, onConfirmPasswordChange }) => {
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSymbol: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const updatePasswordCriteria = () => {
      const criteria = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSymbol: /[^A-Za-z0-9]/.test(password),
      };

      setPasswordCriteria(criteria);

      const strength = Object.values(criteria).filter(Boolean).length;
      setPasswordStrength(strength);
    };

    updatePasswordCriteria();
  }, [password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordStrength < 4 || password !== confirmPassword) {
      setFormError('Asegúrate de que la contraseña cumple con todos los criterios y que las contraseñas coincidan.');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="form-field relative">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          required
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-orange bg-corn-yellow"
          aria-label="Password"
        />
        <button 
          type="button" 
          onClick={() => setShowPassword(!showPassword)} 
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
          {showPassword ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
      <div className="form-field relative mt-4">
        <input
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          required
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          className="input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-orange bg-corn-yellow"
          aria-label="Confirm Password"
        />
        <button 
          type="button" 
          onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
          {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
      {formError && <div className="text-red-500 text-xs mt-2">{formError}</div>}
      <ul className="list-disc pl-5 space-y-1">
        {Object.entries(passwordCriteria).map(([key, isMet]) => (
          <li key={key} className={`${isMet ? 'text-green-500' : 'text-red-500'}`}>
            {isMet ? "✅" : "🔴"} {criteriaText(key)}
          </li>
        ))}
      </ul>
      <div className="w-full bg-gray-300 h-2 rounded-lg overflow-hidden my-2">
        <div className={`h-full ${passwordStrengthColor(passwordStrength)}`}
            style={{ width: `${passwordStrength * 25}%` }}></div>
      </div>
      <button 
        type="submit"
        className="w-full py-2 text-white rounded-md bg-amber-orange hover:bg-peach-yellow focus:outline-none focus:ring-2 focus:ring-amber-orange-hover focus:ring-opacity-50"
      >
        Siguiente
      </button>
    </form>
  );

  function criteriaText(key) {
    switch (key) {
      case 'minLength':
        return "Mínimo 8 caracteres";
      case 'hasUppercase':
        return "Al menos una mayúscula";
      case 'hasNumber':
        return "Incluye un número";
      case 'hasSymbol':
        return "Contiene un símbolo";
      default:
        return "";
    }
  }

  function passwordStrengthColor(strength) {
    return `h-full transition-width duration-500 ${strength === 4 ? 'bg-green-500' : strength >= 2 ? 'bg-yellow-500' : 'bg-red-500'}`;
  }
};

export default PasswordInput;
