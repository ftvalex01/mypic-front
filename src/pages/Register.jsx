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
    console.log("Datos actuales del formulario:", userData);
  }, [userData]);

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
    const { confirmPassword, ...formData } = userData;
    formData.password_confirmation = userData.confirmPassword;

    try {
      await register(formData);
      console.log(formData);

      navigate("/");
    } catch (error) {
      console.error("Error durante el registro:", error.response.data);

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
