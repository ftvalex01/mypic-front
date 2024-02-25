import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useAuthContext from "../context/AuthContext";
import Swal from 'sweetalert2';
import Logo from "../components/Logo"; // Importar el componente Logo

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSymbol: false,
  });
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const { resetPassword } = useAuthContext();
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword || passwordStrength < 4) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Asegúrate de que la contraseña cumple con todos los criterios y que las contraseñas coincidan.',
      });
      return;
    }

    try {
      await resetPassword({
        email,
        token,
        password,
        password_confirmation: confirmPassword,
      });
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Tu contraseña ha sido cambiada correctamente.',
      }).then(() => navigate("/login", { replace: true }));
    } catch (error) {
      console.error("Error al restablecer la contraseña", error);
      setStatus("Error al restablecer la contraseña. Por favor, intenta de nuevo.");
    }
  };

  // Funciones auxiliares, igual que en el componente PasswordInput
  const criteriaText = (key) => {
    switch (key) {
      case 'minLength': return "Mínimo 8 caracteres";
      case 'hasUppercase': return "Al menos una mayúscula";
      case 'hasNumber': return "Incluye un número";
      case 'hasSymbol': return "Contiene un símbolo";
      default: return "";
    }
  };

  const passwordStrengthColor = (strength) => {
    return strength === 4 ? 'bg-green-500' : strength >= 2 ? 'bg-yellow-500' : 'bg-red-500';
  };

  return (
    <section className="flex items-center justify-center w-full h-screen bg-eerieBlack">
      <div className="login-box w-full max-w-md p-8 rounded-lg shadow-md">
        <Logo /> {/* Incorpora el componente Logo */}
        {status && <div className="bg-green-700 m-2 p-2 rounded text-white">{status}</div>}
        <h3 className="text-2xl my-3 font-bold text-center text-burgundy">Escribe tu nueva contraseña</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-field relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          <div className="form-field relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 "
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {Object.entries(passwordCriteria).map(([key, isMet]) => (
              <li key={key} className={`${isMet ? 'text-green-500' : 'text-red-500'}`}>
                {isMet ? "✅" : "🔴"} {criteriaText(key)}
              </li>
            ))}
          </ul>
          <div className="w-full bg-gray-300 h-2 rounded-lg overflow-hidden my-2">
            <div className={`h-full ${passwordStrengthColor(passwordStrength)}`} style={{ width: `${passwordStrength * 25}%` }}></div>
          </div>
          <button
                                   className="w-full py-2 text-white rounded-md bg-burgundy hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600-hover focus:ring-opacity-50"
          >
            Recuperar contraseña
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
