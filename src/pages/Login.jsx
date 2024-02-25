import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthContext from "../context/AuthContext";
import validator from 'validator';
import Logo from "../components/Logo";
import SocialLogin from "../components/SocialLogin";
import TwoFactorVerification from "../components/TwoFactorVerification";
import './login.css';

const Login = () => {
  // Estados locales para manejar el correo electrónico, contraseña, errores y si está habilitado el 2FA.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false); 
  const [frontErrors, setFrontErrors] = useState({});
  const navigate = useNavigate();
  
  // Extrae funciones y datos de autenticación del contexto de autenticación
  const { login, verify2FA, errors: contextErrors } = useAuthContext();

  // Función para manejar el inicio de sesión
  const handleLogin = async (event) => {
    event.preventDefault();
    setFrontErrors({}); // Limpia los errores previos al intento de inicio de sesión
  
    let isValid = true;
    let validationErrors = {};
    // Validación del correo electrónico
    if (!validator.isEmail(email)) {
      isValid = false;
      validationErrors.email = ["El correo electrónico no es válido."];
    }
  
    // Validación de la longitud de la contraseña
    if (!validator.isLength(password, { min: 8 })) {
      isValid = false;
      validationErrors.password = ["La contraseña debe tener al menos 8 caracteres."];
    }
  
    // Si no es válido, muestra errores y limpia después de 2 segundos
    if (!isValid) {
      setFrontErrors(validationErrors);
      setTimeout(() => setFrontErrors({}), 2000); // Limpia los errores después de 2 segundos
      return;
    }

    // Intenta iniciar sesión
    try {
      const response = await login({ email, password });
      if (response.requires_2fa_verification) {
        setIs2FAEnabled(true);
      } else {
        navigate('/'); // Redirecciona a la página de inicio después del inicio de sesión exitoso
      }
    } catch (error) {
      console.error("Error en el inicio de sesión", error);
    }
  };

  // Función para manejar la verificación de 2FA
  const handleVerify2FA = async (code) => {
    await verify2FA(code, email); // Llama a la función de verificación de 2FA con el código y el correo electrónico
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-eerieBlack">
      <div className="login-box w-full max-w-xs mx-auto p-6 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <Logo />
          <h3 className="text-xl font-bold text-center text-fireEngineRed mb-4">Iniciar sesión</h3>
        </div>

        {!is2FAEnabled ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Correo electrónico"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-darkSienna focus:outline-none"
              />
              {frontErrors.email && <div className="text-rosewood text-xs">{frontErrors.email[0]}</div>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Contraseña"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-darkSienna focus:outline-none"
              />
              {frontErrors.password && <div className="text-rosewood text-xs">{frontErrors.password[0]}</div>}
            </div>
            {contextErrors.general && <div className="text-rosewood text-xs">{contextErrors.general[0]}</div>}
            <button
              className="button-primary w-full py-2 rounded-md hover:bg-darkSienna focus:outline-none focus:ring-2 focus:ring-darkSienna-hover focus:ring-opacity-50"
            >
              Iniciar sesión
            </button>
          </form>
        ) : (
          <TwoFactorVerification onVerify={handleVerify2FA} />
        )}

        <div className="flex flex-col items-center mt-6">
          <Link to="/forgot-password" className="text-xs hover:underline">¿Olvidaste tu contraseña?</Link>
          <Link to="/register" className="text-xs hover:underline mt-4">Crear cuenta nueva</Link>
          <SocialLogin provider="github" />
          <SocialLogin provider="google" />
        </div>
        <div className="mt-4 text-center">
          <span className="text-xs text-bulgarianRose">MyPic</span>
        </div>
      </div>
    </section>
  );
};

export default Login;
