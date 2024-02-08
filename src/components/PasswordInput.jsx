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
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    setPasswordCriteria({
      minLength,
      hasUppercase,
      hasNumber,
      hasSymbol,
    });

    const strength = [minLength, hasUppercase, hasNumber, hasSymbol].filter(Boolean).length;
    setPasswordStrength(strength);
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
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
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
        />
        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
          {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
      {formError && <div className="text-red-500 text-xs mt-2">{formError}</div>}
      <ul className="list-disc pl-5 space-y-1">
        <li className={`${passwordCriteria.minLength ? 'text-green-500' : 'text-red-500'}`}>
          {passwordCriteria.minLength ? "✅" : "🔴"} Mínimo 8 caracteres
        </li>
        <li className={`${passwordCriteria.hasUppercase ? 'text-green-500' : 'text-red-500'}`}>
          {passwordCriteria.hasUppercase ? "✅" : "🔴"} Al menos una mayúscula
        </li>
        <li className={`${passwordCriteria.hasNumber ? 'text-green-500' : 'text-red-500'}`}>
          {passwordCriteria.hasNumber ? "✅" : "🔴"} Incluye un número
        </li>
        <li className={`${passwordCriteria.hasSymbol ? 'text-green-500' : 'text-red-500'}`}>
          {passwordCriteria.hasSymbol ? "✅" : "🔴"} Contiene un símbolo
        </li>
      </ul>
      <div className="w-full bg-gray-300 h-2 rounded-lg overflow-hidden my-2">
        <div className={`h-full transition-width duration-500 ${passwordStrength === 4 ? 'bg-green-500' : passwordStrength >= 2 ? 'bg-yellow-500' : 'bg-red-500'}`}
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
  
};

export default PasswordInput;
