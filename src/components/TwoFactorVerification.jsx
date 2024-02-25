/* eslint-disable react/prop-types */
import { useState } from "react";

const TwoFactorVerification = ({ onVerify }) => {
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(code);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Ingrese su código 2FA"
          required
          className="input-field w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
        />
        <button  className="button-primary w-full py-2 rounded-md hover:bg-darkSienna focus:outline-none focus:ring-2 focus:ring-darkSienna-hover focus:ring-opacity-50">Verificar</button>
      </form>
    </div>
  );
};

export default TwoFactorVerification;
