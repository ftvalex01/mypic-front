// Login.js
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin"; // Ajusta la ruta de importación según sea necesario
import Logo from "../components/Logo";
import SocialLogin from "../components/SocialLogin";
import TwoFactorVerification from "../components/TwoFactorVerification";
import './login.css';

const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    is2FAEnabled,
    frontErrors,
    handleLogin,
    handleVerify2FA
  } = useLogin();

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
              {frontErrors.email && <div className="text-rosewood text-xs">{frontErrors.email}</div>}
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
              {frontErrors.password && <div className="text-rosewood text-xs">{frontErrors.password}</div>}
            </div>
            <button
              type="submit"
              className="bg-fireEngineRed w-full py-2 rounded-md hover:bg-darkSienna focus:outline-none focus:ring-2 focus:ring-darkSienna-hover focus:ring-opacity-50"
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
