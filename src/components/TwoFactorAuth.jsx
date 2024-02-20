import React, { useState, useContext } from 'react';
import useAuthContext from "../context/AuthContext"; // Asegúrate de que la ruta sea correcta

const TwoFactorAuth = () => {
    const [code, setCode] = useState('');
    const { verify2FA } = useContext(useAuthContext); // Asume que este método existe en tu AuthContext

    const handleSubmit = async (e) => {
        e.preventDefault();
        verify2FA(code).then(() => {
            // Si la verificación es exitosa, puedes limpiar el estado y navegar al dashboard
            setRequires2FA(false);
            navigate('/');
        }).catch((error) => {
            // Manejar error si la verificación falla
        });
    };

    return (
        <div className="two-factor-auth">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="2faCode">Código 2FA</label>
                    <input
                        type="text"
                        className="form-control"
                        id="2faCode"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Ingresa tu código 2FA"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Verificar Código</button>
            </form>
        </div>
    );
};

export default TwoFactorAuth;
