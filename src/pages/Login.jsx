import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthContext from "../context/AuthContext"; // Asegúrate de que la ruta sea correcta
import Logo from "../components/Logo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, errors } = useAuthContext(); // Asume que este hook devuelve correctamente el contexto

  const handleLogin = async (event) => {
    event.preventDefault();
    // Intenta el login y maneja internamente los errores y redirecciones
    login({ email, password });
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-teal-green">
      <div className="w-full max-w-xs mx-auto bg-white/50 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <Logo />
          <h3 className="text-xl font-bold text-center text-burgundy mb-4">Iniciar sesión</h3>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="Correo Electrónico" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-amber-orange focus:outline-none"
              style={{ backgroundColor: '#faa531' }} 
            />
            {/* Manejo de errores de email */}
            {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-amber-orange focus:outline-none"
              style={{ backgroundColor: '#faa531' }}
            />
            {/* Manejo de errores de contraseña */}
            {errors.password && <div className="text-red-500 text-xs">{errors.password}</div>}
          </div>
          <button 
            className="w-full py-2 text-white rounded-md bg-amber-orange hover:bg-peach-yellow focus:outline-none focus:ring-2 focus:ring-amber-orange-hover focus:ring-opacity-50"
            style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
          >
            Iniciar sesión
          </button>
        </form>
        <div className="flex flex-col items-center mt-6">
          <Link to="/forgot-password" className="text-xs text-amber-600 hover:underline">¿Olvidaste tu contraseña?</Link>
          <Link to="/register" className="mt-4 text-xs text-amber-600 hover:underline">Crear cuenta nueva</Link>
        </div>
        <div className="mt-4 text-center">
          <span className="text-xs text-burgundy">MyPic</span>
        </div>
      </div>
    </section>
  );
};

export default Login;
