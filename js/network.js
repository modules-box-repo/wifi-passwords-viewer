// .. network data loading and rendering
const list = document.querySelector('#network-list');
const dialog = document.querySelector('#error-dialog');

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);
}

function parseLine(line) {
  let value = line.trim();
  if (!value) return null;
  value = value.replace(/\s*\(not stored\)\s*$/i, '');
  const parts = value.split(/\s+/);
  const name = parts.shift() || '—';
  const password = parts.join(' ') || '—';
  return { name, password };
}

function render(rows) {
  list.replaceChildren();
  rows.forEach(({ name, password }) => {
    const card = document.createElement('div');
    card.className = 'network-card';
    card.setAttribute('role', 'row');
    card.innerHTML = `
      <svg class="wifi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/></svg>
      <div class="network-info">
        <span class="network-name" title="${escapeHtml(name)}">${escapeHtml(name)}</span>
        <span class="network-password" data-visible="0" data-real="${escapeHtml(password)}">********</span>
      </div>
      <button class="eye-toggle" type="button" aria-label="Toggle password visibility" title="Show/hide password">
        <svg class="eye-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        <svg class="eye-closed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
      </button>`;
    list.append(card);
    const pwEl = card.querySelector('.network-password');
    const btn = card.querySelector('.eye-toggle');
    btn.addEventListener('click', () => {
      const visible = pwEl.dataset.visible === '1';
      pwEl.dataset.visible = visible ? '0' : '1';
      pwEl.textContent = visible ? '********' : pwEl.dataset.real;
      card.classList.toggle('revealed', !visible);
    });
  });
}

export async function loadNetworks() {
  try {
    const response = await fetch('/api/networks', { headers: { Accept: 'application/json' } });
    const data = await response.json();
    const rows = String(data.output || '').split(/\r?\n/).map(parseLine).filter(Boolean);
    if (!response.ok || !rows.length) throw new Error('No network data');
    render(rows);
  } catch {
    list.replaceChildren();
    dialog.showModal();
  }
}
