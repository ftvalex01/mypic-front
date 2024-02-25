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
      Swal.fire("Espera...", "Por favor selecciona un archivo a subir.", "warning");
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
            {step === 1 ? "Select Photo" : step === 2 ? "Add Details" : "Confirm Upload"}
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
                placeholder="Add a description... #hashtags (max 5)"
                className="description-input"
              />
              <button
                className="back-button"
                onClick={() => setStep(1)}
                disabled={uploading}
              >
                Back
              </button>
              <button className="next-button" onClick={() => setStep(3)}>
                Next
              </button>
            </>
          )}
          {step === 3 && (
            <div className="confirmation">
              <img src={previewUrl} alt="Preview" className="preview-image" />
              <p>{description}</p>
              <button
                className="back-button"
                onClick={() => setStep(2)}
                disabled={uploading}
              >
                Back
              </button>
              <button
                className="confirm-button"
                onClick={handleConfirm}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Confirm"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;




