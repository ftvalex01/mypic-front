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
    <section className="flex items-center justify-center w-full h-screen bg-teal-green">
      <div className="w-full max-w-md p-8 bg-white/50 rounded-lg shadow-md">
        {status && (
          <div className="bg-green-700 m-2 p-2 rounded text-white">
            {status}
          </div>
        )}
        <h3 className="text-2xl my-3 font-bold text-center text-burgundy">
          Escribe tu nueva contraseña
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-orange bg-corn-yellow"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div className="text-red-500 text-xs mt-2">{errors.password[0]}</div>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirmar contraseña"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-orange bg-corn-yellow"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <div className="text-red-500 text-xs mt-2">{errors.confirmPassword[0]}</div>
            )}
          </div>
          <button
            className="w-full py-2 text-white rounded-md bg-amber-orange hover:bg-peach-yellow focus:outline-none focus:ring-2 focus:ring-amber-orange-hover focus:ring-opacity-50"
          >
            Recuperar contraseña
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
