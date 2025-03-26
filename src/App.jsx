import { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Pinata API credentials from .env
  const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
  const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY;
  const PINATA_API_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  // Handle file selection (restrict to images)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please select a valid image file (e.g., .jpg, .png)');
    }
  };

  // Upload image to Pinata/IPFS
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(PINATA_API_URL, {
        method: 'POST',
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed: ' + response.statusText);

      const data = await response.json();
      const newCid = data.IpfsHash;
      setCid(newCid);
      setImageUrl(`https://gateway.pinata.cloud/ipfs/${newCid}`);
      console.log('Image uploaded with CID:', newCid);
    } catch (err) {
      setError('Upload failed: ' + err.message);
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the form
  const handleReset = () => {
    setFile(null);
    setCid('');
    setImageUrl('');
    setError('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>IPFS Image Sharing with Pinata</h1>

      {/* Upload Form */}
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button type="submit" disabled={!file || isLoading}>
          {isLoading ? 'Uploading...' : 'Upload Image'}
        </button>
        <button type="button" onClick={handleReset} style={{ marginLeft: '10px' }}>
          Reset
        </button>
      </form>

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display CID and Image */}
      {cid && (
        <div style={{ marginTop: '20px' }}>
          <p>
            <strong>CID:</strong> {cid}
          </p>
          {imageUrl && (
            <>
              <h3>Uploaded Image:</h3>
              <img
                src={imageUrl}
                alt="Uploaded content"
                style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }}
              />
              <p>
                <a href={imageUrl} download={file?.name || 'ipfs-image'}>
                  Download Image
                </a>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;