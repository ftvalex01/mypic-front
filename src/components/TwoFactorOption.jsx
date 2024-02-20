import React from 'react';
import Swal from 'sweetalert2';

const TwoFactorOption = ({ onNext, onToggle2FA, isChecked }) => {
    const handleContinue = () => {
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
                    'La Verificación en Dos Pasos (2FA) ha sido habilitada. Serás redireccionado automáticamente',
                    'success'
                )
                onNext(); // Procede al siguiente paso solo si el usuario confirma
            }
        });
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