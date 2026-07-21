import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FileUploadButton from '../components/FileUploadButton';
import './AdminCMS.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Known editable fields the site currently reads from. New keys can also be
// added ad-hoc via the "Add new field" form below for fields not listed yet.
const KNOWN_FIELDS = [
  { key: 'home_hero_subtext', label: 'Home Hero Subtext', type: 'text' },
  { key: 'mission_statement', label: 'Mission Statement', type: 'text' },
  { key: 'coach_tessa_bio', label: "Tessa's Bio (separate paragraphs with a blank line)", type: 'text' },
  { key: 'coach_tessa_photo', label: "Tessa's Photo URL", type: 'image' },
  { key: 'coach_dani_bio', label: "Dani's Bio (separate paragraphs with a blank line)", type: 'text' },
  { key: 'coach_dani_photo', label: "Dani's Photo URL", type: 'image' },
  { key: 'coach_nicole_bio', label: "Nicole's Bio (separate paragraphs with a blank line)", type: 'text' },
  { key: 'coach_nicole_photo', label: "Nicole's Photo URL", type: 'image' },
  { key: 'hero_image_1', label: 'Homepage Hero Slide 1', type: 'image' },
  { key: 'hero_image_2', label: 'Homepage Hero Slide 2', type: 'image' },
  { key: 'hero_image_3', label: 'Homepage Hero Slide 3', type: 'image' },
  { key: 'hero_image_4', label: 'Homepage Hero Slide 4', type: 'image' },
  { key: 'hero_image_5', label: 'Homepage Hero Slide 5', type: 'image' },
];

export default function AdminSiteContentPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savingKey, setSavingKey] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newField, setNewField] = useState({ key: '', label: '', type: 'text', value: '' });

  const fetchContent = async () => {
    try {
      const res = await fetch(`${API_URL}/api/site-content/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to load content.'); return; }

      // Merge known fields (so they show up even if never saved yet) with saved rows
      const savedKeys = new Set(data.content.map(r => r.contentKey));
      const missingKnown = KNOWN_FIELDS
        .filter(f => !savedKeys.has(f.key))
        .map(f => ({ contentKey: f.key, label: f.label, type: f.type, value: '' }));

      setRows([...data.content, ...missingKnown]);
    } catch (err) {
      setError('Failed to load content.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContent(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleValueChange = (key, value) => {
    setRows(prev => prev.map(r => (r.contentKey === key ? { ...r, value } : r)));
  };

  const handleSave = async (row) => {
    setError(''); setSuccess(''); setSavingKey(row.contentKey);
    try {
      const res = await fetch(`${API_URL}/api/site-content/${row.contentKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ value: row.value, label: row.label, type: row.type }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to save.'); return; }
      setSuccess(`Saved "${row.label}".`);
    } catch (err) {
      setError('Failed to save.');
    } finally {
      setSavingKey('');
    }
  };

  const handleNewFieldChange = (e) => setNewField(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddField = async (e) => {
    e.preventDefault();
    if (!newField.key || !newField.label) return;
    setError(''); setSuccess('');
    try {
      const res = await fetch(`${API_URL}/api/site-content/${newField.key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newField),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to add field.'); return; }
      setNewField({ key: '', label: '', type: 'text', value: '' });
      setSuccess('New field added.');
      fetchContent();
    } catch (err) {
      setError('Failed to add field.');
    }
  };

  return (
    <div className="admin-cms">
      <div className="admin-cms-header">
        <h2>Site Content</h2>
        <p className="admin-cms-sub">
          Edit text and image links used across the public site. Leave blank to use the
          site's default wording.
        </p>
      </div>

      {error && <p className="admin-cms-error">{error}</p>}
      {success && <p className="admin-cms-success">{success}</p>}

      {loading ? (
        <p className="admin-cms-empty">Loading...</p>
      ) : (
        <div className="admin-cms-table-wrap" style={{ marginBottom: 24 }}>
          <table className="admin-cms-table">
            <thead>
              <tr><th>Field</th><th>Value</th><th></th></tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.contentKey}>
                  <td>{row.label}</td>
                  <td style={{ minWidth: 320 }}>
                    {row.type === 'image' ? (
                      <>
                        <input
                          type="text"
                          value={row.value || ''}
                          placeholder="Image URL"
                          onChange={(e) => handleValueChange(row.contentKey, e.target.value)}
                          style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 6, marginBottom: 6 }}
                        />
                        <FileUploadButton accept="image/*" onUploaded={(url) => handleValueChange(row.contentKey, url)} />
                      </>
                    ) : (
                      <textarea
                        value={row.value || ''}
                        placeholder="Leave blank for default"
                        onChange={(e) => handleValueChange(row.contentKey, e.target.value)}
                        rows={2}
                        style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 6, fontFamily: 'inherit' }}
                      />
                    )}
                  </td>
                  <td>
                    <button
                      className="admin-cms-submit"
                      onClick={() => handleSave(row)}
                      disabled={savingKey === row.contentKey}
                    >
                      {savingKey === row.contentKey ? 'Saving...' : 'Save'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={() => setShowAdvanced(prev => !prev)}
        style={{ background: 'none', border: 'none', color: '#6c3baa', fontSize: '0.85rem', cursor: 'pointer', padding: 0, marginBottom: 12 }}
      >
        {showAdvanced ? '− Hide advanced options' : '+ Advanced: register a new content field (developer use)'}
      </button>

      {showAdvanced && (
        <>
          <div className="admin-cms-header">
            <h2 style={{ fontSize: '1.1rem' }}>Add a New Field</h2>
            <p className="admin-cms-sub">
              For content not listed above yet (a developer needs to wire the corresponding
              page to read it — this just registers the value).
            </p>
          </div>
          <form className="admin-cms-form" onSubmit={handleAddField}>
            <div className="admin-cms-field">
              <label>Key</label>
              <input name="key" value={newField.key} onChange={handleNewFieldChange} placeholder="e.g. coach_dani_bio" required />
            </div>
            <div className="admin-cms-field">
              <label>Label</label>
              <input name="label" value={newField.label} onChange={handleNewFieldChange} placeholder="e.g. Dani's Bio" required />
            </div>
            <div className="admin-cms-field">
              <label>Type</label>
              <select name="type" value={newField.type} onChange={handleNewFieldChange}>
                <option value="text">Text</option>
                <option value="image">Image URL</option>
              </select>
            </div>
            <div className="admin-cms-field admin-cms-form-full">
              <label>Value</label>
              <textarea name="value" value={newField.value} onChange={handleNewFieldChange} placeholder="Content..." />
            </div>
            <button className="admin-cms-submit">Add Field</button>
          </form>
        </>
      )}
    </div>
  );
}
