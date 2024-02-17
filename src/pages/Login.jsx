
import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthContext from "../context/AuthContext"; // Asegúrate de que la ruta sea correcta
import Logo from "../components/Logo";
import SocialLogin from "../components/SocialLogin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const { login, errors } = useAuthContext();

  const handleLogin = async (event) => {
    event.preventDefault();
    // Simulación de la respuesta del backend al intentar iniciar sesión
    const response = await login({ email, password });
    if (response.is2FAEnabled) {
      setIs2FAEnabled(true); // Mostrar formulario 2FA si está habilitado
    } else {
      // Proceder con el flujo normal si 2FA no está habilitado
    }
  };

  const verify2FA = async (event) => {
    event.preventDefault();
    // Aquí deberías enviar el código 2FA al backend para su verificación
    // y manejar la respuesta adecuadamente
    console.log("Verificando código 2FA:", twoFactorCode);
    // Simulación de la verificación exitosa del código 2FA
    // setIs2FAEnabled(false); // Si la verificación es exitosa, deshabilitar 2FA
  }

  return (
    <section className="flex items-center justify-center min-h-screen bg-teal-green">
      <div className="w-full max-w-xs mx-auto bg-white/50 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <Logo />
          <h3 className="text-xl font-bold text-center text-burgundy mb-4">Iniciar sesión</h3>
        </div>

        {!is2FAEnabled ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Usuario, correo electrónico o móvil"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-amber-orange focus:outline-none"
                style={{ backgroundColor: '#faa531' }}
              />
              {errors.email && <div className="text-red-500 text-xs">{errors.email[0]}</div>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Contraseña"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-amber-orange focus:outline-none"
                style={{ backgroundColor: '#faa531' }}
              />
              {errors.password && <div className="text-red-500 text-xs">{errors.password[0]}</div>}
            </div>
            <button
              className="w-full py-2 text-white rounded-md bg-amber-orange hover:bg-peach-yellow focus:outline-none focus:ring-2 focus:ring-amber-orange-hover focus:ring-opacity-50"
              style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
            >
              Iniciar sesión
            </button>
          </form>
        ) : (
          <form onSubmit={verify2FA} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Código 2FA"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                className="w-full px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-amber-orange focus:outline-none"
                style={{ backgroundColor: '#faa531' }}
                required
              />
            </div>
            <button
              className="w-full py-2 text-white rounded-md bg-amber-orange hover:bg-peach-yellow focus:outline-none focus:ring-2 focus:ring-amber-orange-hover focus:ring-opacity-50"
            >
              Verificar 2FA
            </button>
          </form>
        )}
        <div className="flex flex-col items-center mt-6">
          <Link to="/forgot-password" className="text-xs text-amber-600 hover:underline">¿Olvidaste tu contraseña?</Link>
          <Link to="/register" className="text-xs text-amber-600 hover:underline mt-4">Crear cuenta nueva</Link>
          <SocialLogin provider="github" />
          <SocialLogin provider="google" />


        </div>
        <div className="mt-4 text-center">
          <span className="text-xs text-burgundy">MyPic</span>
        </div>
      </div>
    </section>
  );
};

export default Login;
