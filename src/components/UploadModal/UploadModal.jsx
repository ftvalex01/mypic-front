/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { usePostContext } from "../../context/PostContext";
import "./uploadmodal.css";
import Swal from "sweetalert2";

const UploadModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);
  const { uploadPost } = usePostContext();
  const fileInputRef = useRef();

  useEffect(() => {
    if (!isOpen) {
      // Limpieza cuando el modal se cierra
      setFile(null);
      setPreviewUrl("");
      setDescription("");
      setUploading(false);
      setStep(1);
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      ["image/png", "image/jpeg", "image/jpg"].includes(selectedFile.type)
    ) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      setStep(2); // Avanza a la etapa de descripción
    } else {
      Swal.fire(
        "Archivo inválido",
        "Por favor selecciona un archivo PNG, JPG o JPEG.",
        "error"
      );
      fileInputRef.current.value = ""; // Limpiar el input
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleConfirm = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quiéres subir este post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, ¡súbelo!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpload();
      }
    });
  };

  const handleUpload = async () => {
    if (!file) {
      Swal.fire(
        "Espera...",
        "Por favor selecciona un archivo a subir.",
        "warning"
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);

    setUploading(true);

    try {
      await uploadPost(formData);

      Swal.fire("¡Subido!", "Tu post ha sido subido con éxito.", "success");
      // Reset states after successful upload
      setFile(null);
      setDescription("");
      setPreviewUrl("");
      setStep(1);
      setUploading(false);
      onClose(); // Close modal
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire("Oops...", "Error subiendo el archivo.", "error");
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-backdrop ${isOpen ? "show" : ""}`}>
      <div className={`modal-content ${isOpen ? "show" : ""}`}>
        <div className="modal-header">
          <span className="modal-title">
            {step === 1
              ? "Selecciona una foto"
              : step === 2
              ? "Añade una descripción"
              : "Confirmar"}
          </span>
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>
        <div className="modal-body">
          {step === 1 && (
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          )}
          {step === 2 && (
            <>
              <input
                type="text"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Añade una descripción... #hashtags (max 5)"
                className="description-input"
              />
              <button className="button-primary mb-4 w-full py-2 rounded-md hover:bg-darkSienna focus:outline-none focus:ring-2 focus:ring-darkSienna-hover focus:ring-opacity-50"
              onClick={() => setStep(3)}>
                Siguiente
              </button>

              <button
                className="button-primary w-full  file:py-2 rounded-md hover:bg-darkSienna focus:outline-none focus:ring-2 focus:ring-darkSienna-hover focus:ring-opacity-50"
                onClick={() => setStep(1)}
                disabled={uploading}
              >
                Atrás
              </button>
              
            </>
          )}
          {step === 3 && (
            <div className="confirmation">
              <img src={previewUrl} alt="Preview" className="preview-image" />
              <p>{description}</p>
              <button
                className="button-primary w-full mb-4 py-2 rounded-md hover:bg-darkSienna focus:outline-none focus:ring-2 focus:ring-darkSienna-hover focus:ring-opacity-50"
                onClick={handleConfirm}
                disabled={uploading}
              >
                {uploading ? "Subiendo..." : "Confirmar"}
              </button>
              <button
                className="button-primary w-full  py-2 rounded-md hover:bg-darkSienna focus:outline-none focus:ring-2 focus:ring-darkSienna-hover focus:ring-opacity-50"
                onClick={() => setStep(2)}
                disabled={uploading}
              >
                Atrás
              </button>
             
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
