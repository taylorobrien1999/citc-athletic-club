import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function FileUploadButton({ onUploaded, accept }) {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Upload failed.');
        return;
      }
      onUploaded(data.url);
    } catch (err) {
      setError('Upload failed.');
    } finally {
      setUploading(false);
      e.target.value = ''; // allow re-selecting the same file later
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: '0.75rem', color: '#6b7280' }}>Or upload a file:</label>
      <input type="file" accept={accept} onChange={handleFileChange} disabled={uploading} />
      {uploading && <span style={{ fontSize: '0.75rem', color: '#6c3baa' }}>Uploading...</span>}
      {error && <span style={{ fontSize: '0.75rem', color: '#b91c1c' }}>{error}</span>}
    </div>
  );
}
