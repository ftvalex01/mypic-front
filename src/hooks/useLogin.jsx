// useLogin.js
import { useState } from 'react';
import validator from 'validator';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../context/AuthContext';
import Swal from 'sweetalert2';

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [frontErrors, setFrontErrors] = useState({});
  const navigate = useNavigate();
  const { login, verify2FA } = useAuthContext();

  const handleLogin = async (event) => {
    event.preventDefault();
    setFrontErrors({});

    let isValid = true;
    let validationErrors = {};

    if (!validator.isEmail(email)) {
      isValid = false;
      validationErrors.email = "El correo electrónico no es válido.";
    }

    if (!validator.isLength(password, { min: 8 })) {
      isValid = false;
      validationErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    }

    if (!isValid) {
      setFrontErrors(validationErrors);
      setTimeout(() => setFrontErrors({}), 2000);
      return;
    }

    try {
      const response = await login({ email, password });
      if (response.requires_2fa_verification) {
        setIs2FAEnabled(true);
      } else {
        navigate('/'); // Asumiendo que quieres redirigir al usuario a la página principal
      }
    } catch (error) {
      Swal.fire("Error en el inicio de sesión", error.message, "error");
    }
  };

  const handleVerify2FA = async (code) => {
    try {
      await verify2FA(code, email);
      navigate('/'); // Nuevamente, redirigiendo al usuario después de la verificación exitosa
    } catch (error) {
      Swal.fire("Error en la verificación 2FA", error.message, "error");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    is2FAEnabled,
    setIs2FAEnabled,
    frontErrors,
    handleLogin,
    handleVerify2FA
  };
};
