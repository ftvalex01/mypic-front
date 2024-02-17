/* eslint-disable react/prop-types */
import { useState} from 'react';
import { usePostContext } from '../../context/PostContext'; // Asume que esta es la ruta correcta a tu contexto
import './uploadmodal.css';
import Swal from 'sweetalert2';

const UploadModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const { uploadPost } = usePostContext(); // Cambiado a usePostContext

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && ['image/png', 'image/jpeg', 'image/jpg'].includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      Swal.fire('Invalid file type', 'Please select a PNG, JPG, or JPEG image.', 'error');
      e.target.value = ''; // Limpiar el input
    }
  };

  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      Swal.fire('Wait...', 'Please select a file to upload.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    setUploading(true);

    try {
      await uploadPost(formData);
      Swal.fire('Success!', 'File uploaded successfully.', 'success');
      setUploading(false);
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error('Error uploading file:', error);
      Swal.fire('Oops...', 'Error uploading file.', 'error');
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-backdrop ${isOpen ? 'show' : ''}`}>
      <div className={`modal-content ${isOpen ? 'show' : ''}`}>
        <div className="modal-header">
          <span className="modal-title">Upload Photo</span>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleUpload} className="modal-body">
          <input type="file" accept=".png, .jpg, .jpeg" onChange={handleFileChange} />
          <input
            type="text"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Add a description..."
            className="description-input"
          />
          <div className="modal-footer">
            <button type="button" onClick={onClose} disabled={uploading} className="cancel-button">
              Cancel
            </button>
            <button type="submit" disabled={uploading} className="submit-button">
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
