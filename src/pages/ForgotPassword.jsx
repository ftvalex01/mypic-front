import { useState } from "react"
import useAuthContext from "../context/AuthContext";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const { forgotPassword, errors } = useAuthContext(); 
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await forgotPassword(email);
            setStatus(data.status); 
        } catch (error) {
            console.error("Error al enviar solicitud de restablecimiento de contraseña", error);
        }
    };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
      {
        status && <div className="bg-green-700 m-2 p-2 rounded text-white">
        {status}
        </div>
      }

        <h3 className="text-2xl font-bold text-center">Recuperar contraseña</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="email">Correo electrónico</label>
              <input type="email" placeholder="Email" id="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
              {errors.email && <div className="text-red-500">{errors.email[0]}</div>}
            </div>
          </div>
          <button  className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Recuperar contraseña</button>
        </form>
      </div>
    </section>
  )
}

export default ForgotPassword