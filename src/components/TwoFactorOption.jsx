import React from 'react';
import Swal from 'sweetalert2';

const TwoFactorOption = ({ onNext, onToggle2FA, isChecked }) => {

    const handleContinue = () => {
        // Verifica si isChecked es true o false para cambiar el contenido del Swal
        if (isChecked) {
            // Contenido para cuando isChecked es true (2FA será habilitado)
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Vas a habilitar la Verificación en Dos Pasos (2FA).",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, habilitar',
                cancelButtonText: 'No, cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        'Habilitado!',
                        'La Verificación en Dos Pasos (2FA) ha sido habilitada. Serás redireccionado automáticamente.',
                        'success'
                    )
                    // Aquí llama a la función que efectivamente habilita 2FA
                    onNext(); // Procede al siguiente paso solo si el usuario confirma
                }
            });
        } else {
            // Contenido para cuando isChecked es false (2FA no será habilitado)
            Swal.fire({
                title: '¿Estás seguro?',
                text: "No has seleccionado habilitar la Verificación en Dos Pasos (2FA).",
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continuar sin 2FA',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        'Continuando',
                        'No has habilitado la Verificación en Dos Pasos (2FA). Serás redireccionado automáticamente.',
                        'info'
                    )
                    // Aquí puedes llamar a una función que maneje el flujo de no habilitar 2FA
                    onNext(); // Procede al siguiente paso solo si el usuario confirma
                }
            });
        }
    };

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => onToggle2FA(e.target.checked)}
                />
                Habilitar Verificación en Dos Pasos (2FA)
            </label>
            <button onClick={handleContinue}>Continuar</button>
        </div>
    );
};

export default TwoFactorOption;