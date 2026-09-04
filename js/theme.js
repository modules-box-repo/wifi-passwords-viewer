// .. theme switching
const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');

export function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem('wpv-theme', theme);
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
}

export function initTheme() {
  setTheme(localStorage.getItem('wpv-theme') === 'light' ? 'light' : 'dark');
  themeToggle.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
}
