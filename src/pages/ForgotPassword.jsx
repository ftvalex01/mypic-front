import { useState } from "react";
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
        <section className="flex items-center justify-center w-full h-screen bg-teal-green">
            <div className="w-full max-w-md p-8 bg-white/50 rounded-lg shadow-md">
                <h3 className="text-2xl my-3 font-bold text-center text-burgundy">Recuperar contraseña</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {
                        status && <div className="bg-green-700 m-2 p-2 rounded text-white">
                        {status}
                        </div>
                    }
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-orange bg-corn-yellow"
                        />
                        {errors.email && <div className="text-red-500 text-xs mt-2">{errors.email[0]}</div>}
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
