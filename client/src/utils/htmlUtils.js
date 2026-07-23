// Strips HTML tags AND decodes entities (like &nbsp;) properly — a regex
// alone only strips tags, leaving literal "&nbsp;" text visible in previews.
export function stripHtml(html) {
  if (!html) return '';
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return (temp.textContent || temp.innerText || '').replace(/\s+/g, ' ').trim();
}

// Cleans non-breaking spaces from saved rich-text HTML. Call this ONCE,
// right before sending content to the server (e.g. in handleSubmit) — never
// on every keystroke, which fights React-Quill's internal state and causes
// the editor to freeze on paste.
export function cleanRichText(html) {
  if (!html) return html;
  return html.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');
}
