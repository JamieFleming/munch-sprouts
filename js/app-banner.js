(function () {
  if (localStorage.getItem('appBannerDismissed') === '1') return;

  var style = document.createElement('style');
  style.textContent = [
    '#floatingAppBanner {',
    '  position: fixed;',
    '  bottom: 1.5rem;',
    '  left: 1rem;',
    '  z-index: 9000;',
    '  background: #fff;',
    '  border-radius: 1.25rem;',
    '  border: 2px solid #e0c5fa;',
    '  box-shadow: 0 8px 30px rgba(0,0,0,0.15);',
    '  padding: 0.875rem 0.875rem 0.75rem;',
    '  max-width: 260px;',
    '  width: calc(100vw - 2rem);',
    '  display: flex;',
    '  flex-direction: column;',
    '  gap: 0.625rem;',
    '  animation: appBannerSlideUp 0.3s ease-out;',
    '}',
    '#floatingAppBanner::before {',
    '  content: "";',
    '  position: absolute;',
    '  bottom: -13px;',
    '  left: 1.25rem;',
    '  border-left: 12px solid transparent;',
    '  border-right: 12px solid transparent;',
    '  border-top: 13px solid #e0c5fa;',
    '}',
    '#floatingAppBanner::after {',
    '  content: "";',
    '  position: absolute;',
    '  bottom: -10px;',
    '  left: 1.375rem;',
    '  border-left: 10px solid transparent;',
    '  border-right: 10px solid transparent;',
    '  border-top: 10px solid #fff;',
    '}',
    '#floatingBannerClose {',
    '  position: absolute;',
    '  top: 0.5rem;',
    '  right: 0.5rem;',
    '  background: #f3e8ff;',
    '  border: none;',
    '  cursor: pointer;',
    '  color: #9ca3af;',
    '  font-size: 0.7rem;',
    '  font-weight: bold;',
    '  line-height: 1;',
    '  padding: 0.25rem 0.4rem;',
    '  border-radius: 999px;',
    '}',
    '#floatingBannerClose:hover { background: #e9d5ff; color: #374151; }',
    '@keyframes appBannerSlideUp {',
    '  from { transform: translateY(0.75rem); opacity: 0; }',
    '  to   { transform: translateY(0);       opacity: 1; }',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  var banner = document.createElement('div');
  banner.id = 'floatingAppBanner';
  banner.innerHTML =
    '<button id="floatingBannerClose" aria-label="Close">✕</button>' +
    '<div style="display:flex;align-items:center;gap:0.5rem;padding-right:1.5rem">' +
      '<img src="images/logo.png" alt="Munch Sprouts" style="width:2.25rem;flex-shrink:0" />' +
      '<div>' +
        '<p style="margin:0;font-weight:700;font-size:0.8rem;line-height:1.2">Munch Sprouts App</p>' +
        '<p style="margin:0;font-size:0.7rem;color:#666;line-height:1.3">Track your baby\'s weaning journey</p>' +
      '</div>' +
    '</div>' +
    '<a href="https://apps.apple.com/gb/app/munch-sprouts-weaning-tracker/id6763142582"' +
    '   target="_blank" rel="noopener noreferrer">' +
      '<img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"' +
      '     alt="Download on the App Store" style="height:2.25rem" />' +
    '</a>';

  document.body.appendChild(banner);

  document.getElementById('floatingBannerClose').addEventListener('click', function () {
    banner.style.display = 'none';
    localStorage.setItem('appBannerDismissed', '1');
  });
})();
