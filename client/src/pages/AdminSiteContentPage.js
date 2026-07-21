import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FileUploadButton from '../components/FileUploadButton';
import './AdminCMS.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Every known editable field, grouped by where it appears on the site.
// New keys can also be added ad-hoc via the "Advanced" form for anything
// not listed here yet (requires a developer to wire the page to read it).
const CATEGORIES = [
  {
    name: 'Home Page',
    fields: [
      { key: 'home_hero_subtext', label: 'Hero Subtext', type: 'text' },
      { key: 'hero_image_1', label: 'Hero Slide 1', type: 'image' },
      { key: 'hero_image_2', label: 'Hero Slide 2', type: 'image' },
      { key: 'hero_image_3', label: 'Hero Slide 3', type: 'image' },
      { key: 'hero_image_4', label: 'Hero Slide 4', type: 'image' },
      { key: 'hero_image_5', label: 'Hero Slide 5', type: 'image' },
      { key: 'home_about_image', label: 'About Section Photo', type: 'image' },
      { key: 'home_program_sprint_image', label: 'Sprint Program Card Photo', type: 'image' },
      { key: 'home_program_hurdles_image', label: 'Hurdles Program Card Photo', type: 'image' },
      { key: 'home_program_middledistance_image', label: 'Middle Distance Program Card Photo', type: 'image' },
    ],
  },
  {
    name: 'The Club — Coaches',
    fields: [
      { key: 'coach_tessa_bio', label: "Tessa's Bio", type: 'text' },
      { key: 'coach_tessa_photo', label: "Tessa's Photo", type: 'image' },
      { key: 'coach_dani_bio', label: "Dani's Bio", type: 'text' },
      { key: 'coach_dani_photo', label: "Dani's Photo", type: 'image' },
      { key: 'coach_nicole_bio', label: "Nicole's Bio", type: 'text' },
      { key: 'coach_nicole_photo', label: "Nicole's Photo", type: 'image' },
    ],
  },
  {
    name: 'The Club — Mission Statement',
    fields: [
      { key: 'mission_statement', label: 'Main Mission Statement', type: 'text' },
      { key: 'mission_dei_text', label: 'Full DEI Section (heading, list, and closing — replaces the whole section below the quote)', type: 'text' },
    ],
  },
  {
    name: 'The Club — Training Programs',
    fields: [
      { key: 'training_sprint_title', label: 'Sprint Program — Title', type: 'text' },
      { key: 'training_sprint_text', label: 'Sprint Program — Body Text', type: 'text' },
      { key: 'training_sprint_image', label: 'Sprint Program Photo', type: 'image' },
      { key: 'training_hurdles_title', label: 'Hurdles Program — Title', type: 'text' },
      { key: 'training_hurdles_text', label: 'Hurdles Program — Body Text', type: 'text' },
      { key: 'training_hurdles_image', label: 'Hurdles Program Photo', type: 'image' },
      { key: 'training_middledistance_title', label: 'Middle Distance Program — Title', type: 'text' },
      { key: 'training_middledistance_text', label: 'Middle Distance Program — Body Text', type: 'text' },
      { key: 'training_middledistance_image', label: 'Middle Distance Program Photo', type: 'image' },
      { key: 'training_strength_title', label: 'Strength & Weight Training — Title', type: 'text' },
      { key: 'training_strength_text', label: 'Strength & Weight Training — Body Text', type: 'text' },
      { key: 'training_strength_image', label: 'Strength & Weight Training Photo', type: 'image' },
    ],
  },
  {
    name: 'The Club — Track Meets',
    fields: [
      { key: 'track_meets_indoor', label: 'Indoor Season Meets List', type: 'text' },
      { key: 'track_meets_outdoor', label: 'Outdoor Season Meets List', type: 'text' },
    ],
  },
  {
    name: 'The Club — Code of Conduct',
    fields: [
      { key: 'code_of_conduct_full', label: 'Full Code of Conduct Text', type: 'text' },
    ],
  },
  {
    name: 'Membership — Fees',
    fields: [
      { key: 'fees_text', label: 'Fees Page Text', type: 'text' },
    ],
  },
  {
    name: 'Contact Page',
    fields: [
      { key: 'contact_email', label: 'Direct Contact Email', type: 'text' },
    ],
  },
];

const KNOWN_FIELDS = CATEGORIES.flatMap(cat => cat.fields);

export default function AdminSiteContentPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savingKey, setSavingKey] = useState('');
  const [openCategory, setOpenCategory] = useState(CATEGORIES[0].name);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newField, setNewField] = useState({ key: '', label: '', type: 'text', value: '' });

  const fetchContent = async () => {
    try {
      const res = await fetch(`${API_URL}/api/site-content/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to load content.'); return; }

      const byKey = {};
      KNOWN_FIELDS.forEach(f => { byKey[f.key] = { contentKey: f.key, label: f.label, type: f.type, value: '' }; });
      data.content.forEach(row => { byKey[row.contentKey] = row; });

      setRows(byKey);
    } catch (err) {
      setError('Failed to load content.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContent(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleValueChange = (key, value) => {
    setRows(prev => ({ ...prev, [key]: { ...prev[key], value } }));
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
          Edit text and images used across the public site, organized by where they appear.
          Leave a field blank to use the site's default wording. Press Enter to start a new
          line — it will show exactly as typed.
        </p>
      </div>

      {error && <p className="admin-cms-error">{error}</p>}
      {success && <p className="admin-cms-success">{success}</p>}

      {loading ? (
        <p className="admin-cms-empty">Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {CATEGORIES.map((cat) => {
            const isOpen = openCategory === cat.name;
            return (
              <div key={cat.name} style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
                <button
                  onClick={() => setOpenCategory(isOpen ? null : cat.name)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '14px 18px', background: isOpen ? '#f3eafd' : '#f9fafb',
                    border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem', color: '#1a1a2e',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  <span>{cat.name}</span>
                  <span style={{ color: '#6c3baa', fontSize: '0.8rem' }}>{isOpen ? '− Collapse' : '+ Expand'}</span>
                </button>

                {isOpen && (
                  <div className="admin-cms-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
                    <table className="admin-cms-table">
                      <thead>
                        <tr><th>Field</th><th>Value</th><th></th></tr>
                      </thead>
                      <tbody>
                        {cat.fields.map((f) => {
                          const row = rows[f.key] || { contentKey: f.key, label: f.label, type: f.type, value: '' };
                          return (
                            <tr key={f.key}>
                              <td>{row.label}</td>
                              <td style={{ minWidth: 320 }}>
                                {row.type === 'image' ? (
                                  <>
                                    <input
                                      type="text"
                                      value={row.value || ''}
                                      placeholder="Image URL"
                                      onChange={(e) => handleValueChange(f.key, e.target.value)}
                                      style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 6, marginBottom: 6 }}
                                    />
                                    <FileUploadButton accept="image/*" onUploaded={(url) => handleValueChange(f.key, url)} />
                                  </>
                                ) : (
                                  <textarea
                                    value={row.value || ''}
                                    placeholder="Leave blank for default"
                                    onChange={(e) => handleValueChange(f.key, e.target.value)}
                                    rows={4}
                                    style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 6, fontFamily: 'inherit' }}
                                  />
                                )}
                              </td>
                              <td>
                                <button
                                  className="admin-cms-submit"
                                  onClick={() => handleSave(row)}
                                  disabled={savingKey === f.key}
                                >
                                  {savingKey === f.key ? 'Saving...' : 'Save'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
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