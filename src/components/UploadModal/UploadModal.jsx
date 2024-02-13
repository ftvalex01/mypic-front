/* eslint-disable react/prop-types */
import { useState } from 'react';
import useAuthContext from '../../context/AuthContext';
import './uploadmodal.css';
import Swal from 'sweetalert2';

const UploadModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const { uploadPost } = useAuthContext();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid file type',
        text: 'Please select a PNG, JPG, or JPEG image.',
      });
      e.target.value = ''; // Clear the input
    }
  };

  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      Swal.fire({
        icon: 'warning',
        title: 'Wait...',
        text: 'Please select a file to upload.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('type', 'photo');

    setUploading(true);

    try {
      await uploadPost(formData);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'File uploaded successfully.',
        showConfirmButton: false,
        timer: 1500,
      });
      setUploading(false);
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error uploading file:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error uploading file.',
      });
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
          <input type="file" accept=".png, .jpg, .jpeg" onChange={handleFileChange} />
          <input
            type="text"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Add a description..."
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
