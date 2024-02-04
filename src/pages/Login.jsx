import { useState } from "react";
import { Link} from "react-router-dom";
import useAuthContext from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, errors } = useAuthContext();
  const handleLogin = async (event) => {
    event.preventDefault();
    login({email, password})
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Iniciar sesión</h3>
        <form onSubmit={handleLogin}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="email">Correo electrónico</label>
              <input type="email" placeholder="Email" id="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
              {errors.email && <div className="text-red-500">{errors.email[0]}</div>}
            </div>
            <div className="mt-4">
              <label className="block">Contraseña</label>
              <input type="password" placeholder="Contraseña" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
              {errors.password && <div className="text-red-500">{errors.password[0]}</div>}
            </div>
            <div className="flex items-baseline justify-between">
              <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Iniciar sesión</button>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">¿Olvidaste tu contraseña?</Link>
            </div>
          </div>
        </form>
        <div className="mt-6 text-grey-dark">
          ¿No tienes una cuenta?
          <Link to="/register" className="text-blue-600 hover:underline"> Regístrate</Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
