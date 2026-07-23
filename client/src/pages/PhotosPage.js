import { useState, useEffect } from 'react';
import './PhotosPage.css';
import ClosingCTA from '../components/ClosingCTA';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function PhotosPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/resources`)
      .then(res => res.json())
      .then(data => setPhotos((data.resources || []).filter(r => r.type === 'photo' && r.visibility !== 'members')))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
    <div className="photos-page">
      <div className="photos-hero">
        <span className="photos-eyebrow">NEWS &amp; UPDATES</span>
        <h1 className="photos-title">Photos</h1>
        <p className="photos-subtitle">Moments from CITC practices, meets, and events.</p>
      </div>

      {loading ? (
        <p className="photos-empty">Loading...</p>
      ) : photos.length === 0 ? (
        <p className="photos-empty">No photos added yet. Check back soon.</p>
      ) : (
        <div className="photos-grid">
          {photos.map((p) => (
            <a href={p.url} target="_blank" rel="noreferrer" className="photos-item" key={p.id}>
              <img src={p.url} alt={p.title} />
              <span>{p.title}</span>
            </a>
          ))}
        </div>
      )}
    </div>
    <ClosingCTA />
    </>
  );
}
