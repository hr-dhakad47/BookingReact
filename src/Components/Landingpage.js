import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function Landingpage() {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Reset form fields and messages
    setName('');
    setImage(null);
    setError(null);
    setResponseMessage(null);
  };

  const compressImage = (file, maxSize) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const scale = maxSize / Math.max(img.width, img.height);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => resolve(blob), file.type, 0.8);
        };
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setResponseMessage(null);

    if (image) {
      const compressedImage = await compressImage(image, 1000);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result.split(',')[1];
        try {
          // Save the name and base64 image to local storage
          localStorage.setItem('name', name);
          localStorage.setItem('image', base64Image);

          setResponseMessage('Data saved successfully to local storage');
          // Close the modal after successful submission
          closeModal();
        } catch (error) {
          setError(`Failed to save data: ${error.message}`);
          console.error('Failed to save data:', error);
        }
      };
      reader.readAsDataURL(compressedImage);
    }
  };

  return (
    <div className="App">
      <h1>Landing Page</h1>
      <button onClick={openModal}>Open Popup</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '80%', // Adjust the width as needed
            maxWidth: '500px' // Adjust the maximum width as needed
          }
        }}
      >
        <h2>Enter Name and Image</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
          <button type="submit">Submit</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {responseMessage && <p style={{ color: 'green' }}>{responseMessage}</p>}
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
}

export default Landingpage;
