import { useState, useEffect } from 'react';
import './NewsPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function NewsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/announcements`).then(res => res.json()),
      fetch(`${API_URL}/api/resources`).then(res => res.json()),
    ])
      .then(([annData, resData]) => {
        setAnnouncements(annData.announcements || []);
        setDocuments((resData.resources || []).filter(r => r.type !== 'photo' && r.visibility !== 'members'));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="news-page">
      <div className="news-hero">
        <span className="news-eyebrow">NEWS &amp; UPDATES</span>
        <h1 className="news-title">Club News</h1>
        <p className="news-subtitle">
          Stay up to date with the latest news, meet results, and club updates.
        </p>
      </div>

      {loading ? (
        <p className="news-empty">Loading...</p>
      ) : announcements.length === 0 ? (
        <p className="news-empty">No news posted yet. Check back soon.</p>
      ) : (
        <div className="news-list">
          {announcements.map((a) => (
            <div className="news-card" key={a.id}>
              <h2>{a.title}</h2>
              {a.imageUrl && <img src={a.imageUrl} alt="" className="news-card-img" />}
              <p>{a.body}</p>
              <span className="news-meta">
                {a.postedBy ? `${a.postedBy} · ` : ''}
                {new Date(a.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {!loading && documents.length > 0 && (
        <div className="news-documents">
          <h2 className="news-documents-heading">Documents &amp; Links</h2>
          {documents.map((d) => (
            <a href={d.url} target="_blank" rel="noreferrer" className="news-document-item" key={d.id}>
              <span className="news-document-type">{d.type}</span>
              <span>{d.title}</span>
            </a>
          ))}
        </div>
      )}

      <div className="news-instagram">
        <p>
          For meet results, training highlights, and athlete achievements, follow us on{' '}
          <a href="https://www.instagram.com/calgaryinternational/?hl=en" target="_blank" rel="noreferrer">
            Instagram
          </a>.
        </p>
      </div>
    </div>
  );
}
