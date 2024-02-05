/* eslint-disable react/prop-types */
import { useState } from 'react';
import useAuthContext from '../../context/AuthContext'; 
import './modal.css'; 

const UploadModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const { uploadMedia } = useAuthContext(); 

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    setUploading(true);

    try {

      await uploadMedia(formData);
      alert('File uploaded successfully.');
      setUploading(false);
      onClose();
    } catch (error) {
      alert('Error uploading file.');
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
        <form onSubmit={handleUpload}>
          <input type="file" onChange={handleFileChange} />
          <input
            type="text"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Add a description..."
          />
          <div className="modal-footer">
            <button type="button" onClick={onClose} disabled={uploading} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" disabled={uploading} className="submit-button">
              {uploading ? 'Subiendo...' : 'Subir Foto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
