
/* eslint-disable no-unused-vars */

/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthContext from "../context/AuthContext";
import NameInput from "../components/NameInput.jsx";
import UserNameInput from "../components/UsernameInput";
import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";
import BirthDateInput from "../components/BirthDateInput";
import TwoFactorOption from "../components/TwoFactorOption.jsx";
import Swal from 'sweetalert2'; // Asumiendo que quieres usar Swal para la retroalimentación

const Register = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birth_date: "",
    enable2FA: false, // Nuevo campo para 2FA
  });

  const navigate = useNavigate();
  const { register, errors } = useAuthContext();

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Mostrar un mensaje de error si hay errores
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, corrige los errores antes de continuar.',
      });
    }
  }, [errors, step]);

  const nextStep = () => {
    if (step < 6) { // Ajustar el número máximo de pasos
      setStep((prevStep) => prevStep + 1);
    } else {
      handleRegister();
    }
  };

  const updateField = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };


   const handleRegister = async () => {
    // Verificar si las contraseñas coinciden
    if (userData.password !== userData.confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
      return; // Detener la ejecución si las contraseñas no coinciden
    }
  
    const { confirmPassword, birth_date, ...formData } = userData; 
    formData.birth_date = new Date(birth_date).toISOString(); // Convertir la fecha de nacimiento al formato ISO
    formData.password_confirmation = confirmPassword; // Asegurarte de incluir esto
  
    try {
      await register(formData);
      Swal.fire('Registro exitoso', 'Bienvenido a la plataforma.', 'success');
      navigate("/");
    } catch (error) {
      console.error("Error durante el registro:", error);
      Swal.fire('Error en el registro', 'No se pudo completar tu registro.', 'error');
    }
  };

  const stepComponents = [
      <NameInput onNext={nextStep} value={userData.name} onChange={(value) => updateField("name", value)} error={errors.name} />,
      <UserNameInput onNext={nextStep} value={userData.username} onChange={(value) => updateField("username", value)} error={errors.username} />,
      <EmailInput onNext={nextStep} value={userData.email} onChange={(value) => updateField("email", value)} error={errors.email} />,
      <PasswordInput onNext={nextStep} password={userData.password} confirmPassword={userData.confirmPassword} onPasswordChange={(value) => updateField("password", value)} onConfirmPasswordChange={(value) => updateField("confirmPassword", value)} error={errors.password} />,
      <BirthDateInput onNext={nextStep} birthDate={userData.birth_date} onChange={(value) => updateField("birth_date", value)} error={errors.birth_date} />,
      <TwoFactorOption onNext={nextStep} onToggle2FA={(isChecked) => updateField("enable2FA", isChecked)} isChecked={userData.enable2FA} />
  ];


  });


  return (
    <section className="flex items-center justify-center w-full h-screen bg-teal-green">
      <div className="w-full max-w-md p-8 bg-white/50 rounded-lg shadow-md">
        <h3 className="text-2xl my-3 font-bold text-center text-burgundy">Registrarse</h3>
        {stepComponents[step - 1]}
        <div className="mt-6 text-center text-burgundy">
          ¿Ya tienes una cuenta?
          <Link to="/login" className="text-amber-600 hover:underline"> Inicia sesión</Link>
        </div>
      </div>
    </section>
  );
};

export default Register;
