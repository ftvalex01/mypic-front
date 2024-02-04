import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthContext from "../context/AuthContext";

const Register = () => {

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const { register, errors } = useAuthContext();

  

  const handleRegister = async (event) => {
    event.preventDefault();
    register({name, username, email, password, password_confirmation: confirmPassword, birth_date:birthDate})
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Registrarse</h3>
        <form onSubmit={handleRegister}>

          <div className="mt-4">
            <label className="block">Nombre</label>
            <input
              type="text"
              placeholder="Nombre"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
      
            {errors.name && <div className="text-red-500">{errors.name[0]}</div>}
          </div>
          <div className="mt-4">
            <label className="block">Usuario</label>
            <input
              type="text"
              placeholder="Usuario"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            
            {errors.username && <div className="text-red-500">{errors.username[0]}</div>}
          </div>
          <div className="mt-4">
            <label className="block" htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              placeholder="Email"
              id="email"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            {errors.email && <div className="text-red-500">{errors.email[0]}</div>}
          </div>
          <div className="mt-4">
            <label className="block">Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
   
            {errors.password && <div className="text-red-500">{errors.password[0]}</div>}
          </div>
          <div className="mt-4">
            <label className="block">Confirmar contraseña</label>
            <input
              type="password"
              placeholder="Confirmar contraseña"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
           
            {errors.confirmPassword && <div className="text-red-500">{errors.confirmPassword[0]}</div>}
          </div>
          <div className="mt-4">
            <label className="block">Fecha de Nacimiento</label>
            <input
              type="date"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
     
            {errors.birth_date && <div className="text-red-500">{errors.birth_date[0]}</div>}
          </div>
          <div className="flex items-center justify-between mt-4">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
            >
              Registrarse
            </button>
          </div>
        </form>
        <div className="mt-6 text-grey-dark">
          ¿Ya tienes una cuenta?
          <Link to="/login" className="text-blue-600 hover:underline">Inicia sesión</Link>
        </div>
      </div>
    </section>
  );
};

export default Register;