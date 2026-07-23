import { useMemo, useRef, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useAuth } from '../context/AuthContext';
import './RichTextEditor.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Register a small, curated set of fonts (rather than every system font —
// keeps output consistent with the site's actual design language).
const Font = Quill.import('formats/font');
Font.whitelist = ['inter', 'barlow', 'georgia', 'monospace'];
Quill.register(Font, true);

// Drop this in anywhere a plain <textarea> currently holds description/body/
// bio-style content. value/onChange work the same way a controlled textarea
// would — onChange receives the new HTML string directly, no event object.
export default function RichTextEditor({ value, onChange, placeholder }) {
  const { token } = useAuth();
  const quillRef = useRef(null);

  // Sanitize pasted content using Quill's public, stable clipboard matcher
  // API (not an internal method override, which broke on this Quill
  // version's different method signature). Converts non-breaking spaces
  // to normal breakable spaces, so pasted text — from Word, Google Docs,
  // or anywhere else — never locks up line-wrapping.
  useEffect(() => {
    if (!quillRef.current) return;
    const editor = quillRef.current.getEditor();
    editor.clipboard.addMatcher(Node.TEXT_NODE, (node, delta) => {
      delta.ops.forEach((op) => {
        if (typeof op.insert === 'string') {
          op.insert = op.insert.replace(/\u00A0/g, ' ');
        }
      });
      return delta;
    });
  }, []);

  // Custom image handler — uploads through the same /api/upload endpoint the
  // rest of the admin dashboard already uses, then inserts the resulting URL
  // directly into the editor at the cursor position.
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) return;

        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, 'image', data.url);
        editor.setSelection(range.index + 1);
      } catch (err) {
        // Upload failed — silently no-op, admin can try again
      }
    };
  };

  // Custom link handler — auto-adds https:// if the admin types a bare
  // domain like "youtube.com", which browsers otherwise treat as a relative
  // path on our own site (and silently redirect to the homepage instead).
  const linkHandler = () => {
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection(true);
    const existingFormat = editor.getFormat(range);

    const currentUrl = existingFormat.link || '';
    // eslint-disable-next-line no-alert
    const input = window.prompt('Enter the link URL:', currentUrl);
    if (input === null) return; // cancelled

    const trimmed = input.trim();
    if (!trimmed) {
      editor.format('link', false);
      return;
    }

    const hasProtocol = /^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed) || /^\//.test(trimmed);
    const safeUrl = hasProtocol ? trimmed : `https://${trimmed}`;

    editor.format('link', safeUrl);
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ font: Font.whitelist }],
        [{ header: [false, 2, 3, 4] }],
        ['bold', 'italic', 'underline'],
        [{ color: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: { image: imageHandler, link: linkHandler },
    },
  }), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
    </div>
  );
}
