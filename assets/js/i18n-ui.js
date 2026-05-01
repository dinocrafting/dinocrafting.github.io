document.addEventListener('DOMContentLoaded', () => {
  const i18nScript = document.getElementById('site-i18n');
  let ui = {};
  if (i18nScript) {
    try {
      ui = JSON.parse(i18nScript.textContent || '{}');
    } catch (error) {
      console.warn('Failed to parse i18n JSON:', error);
    }
  }
  const lang = localStorage.getItem('preferredLang') || 'ma';
  const dict = (ui[lang] && ui[lang].ui) ? ui[lang].ui : ((ui.ma && ui.ma.ui) ? ui.ma.ui : null);
  if (!dict) return;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
});
