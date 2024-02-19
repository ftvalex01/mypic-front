import React, { useState } from 'react';

const TwoFactorVerification = ({ onVerify }) => {
    const [code, setCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onVerify(code); // Llama a la función onVerify con el código 2FA
    };

    return (
        <div>
            <h2>Verificación de Dos Factores</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ingrese su código 2FA"
                    required
                />
                <button type="submit">Verificar</button>
            </form>
        </div>
    );
};

export default TwoFactorVerification;
