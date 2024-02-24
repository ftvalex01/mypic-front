import { useState } from "react";
import useAuthContext from "../context/AuthContext";
import Swal from 'sweetalert2'; // Para mensajes de retroalimentación
import validator from 'validator'; // Importar la biblioteca validator

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const { forgotPassword } = useAuthContext();
    const [error, setError] = useState(''); // Usar un estado simple para el error
    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
      }
      
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        if (!validator.isEmail(email)) {
            setError("Por favor ingresa un email válido.");
            return;
        }
    
        try {
            const data = await forgotPassword(email);
            await delay(1000); 
         
            Swal.fire({
                icon: 'success',
                title: '¡Correo enviado!',
                text: data.status,
            });
        } catch (error) {
            console.error("Error al enviar solicitud de restablecimiento de contraseña", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.status || "Ocurrió un error al intentar recuperar la contraseña.",
            });
        }
    };

    return (
        <section className="flex items-center justify-center w-full h-screen bg-teal-green">
            <div className="w-full max-w-md p-8 bg-white/50 rounded-lg shadow-md">
                <h3 className="text-2xl my-3 font-bold text-center text-burgundy">Recuperar contraseña</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-orange bg-corn-yellow"
                        />
                        {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
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

export default ForgotPassword;
