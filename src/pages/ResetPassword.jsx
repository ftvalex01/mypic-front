import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useAuthContext from "../context/AuthContext";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, errors } = useAuthContext();
  const { token } = useParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      console.log("Email no proporcionado en la URL.");
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(
        {
          email,
          token,
          password,
          password_confirmation: confirmPassword,
        },
        () => {
          setStatus(
            "Cambio de contraseña exitoso. Serás redirigido al inicio de sesión..."
          );
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 2000);
        }
      );
    } catch (error) {
      console.error("Error al restablecer la contraseña", error);
      setStatus(
        "Error al restablecer la contraseña. Por favor, intenta de nuevo."
      );
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        {status && (
          <div className="bg-green-700 m-2 p-2 rounded text-white">
            {status}
          </div>
        )}
        <h3 className="text-2xl font-bold text-center">
          Escribe tu nueva contraseña
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block">Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div className="text-red-500">{errors.password[0]}</div>
            )}
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
            {errors.confirmPassword && (
              <div className="text-red-500">{errors.confirmPassword[0]}</div>
            )}
          </div>
          <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
            Recuperar contraseña
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
