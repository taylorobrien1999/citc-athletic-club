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
  let cleaned = html.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');

  // Strip any inline background-color, which is what actually caused the
  // "white highlight" on pasted text (Word/Google Docs/browsers often bake
  // a background style into copied HTML). This is a retroactive safety net
  // for content pasted before the editor's paste-fix existed — new pastes
  // are already cleaned at paste time, but old saved content needs this
  // to be cleaned the next time it's edited and saved.
  const temp = document.createElement('div');
  temp.innerHTML = cleaned;
  temp.querySelectorAll('[style]').forEach((el) => {
    el.style.removeProperty('background');
    el.style.removeProperty('background-color');
    if (!el.getAttribute('style')) el.removeAttribute('style');
  });
  return temp.innerHTML;
}
