window.addEventListener('load', function () {
  var banner = document.createElement('div');
  banner.id = 'iosAppBanner';
  banner.style.cssText =
    'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);padding:1rem';

  var card = document.createElement('div');
  card.style.cssText =
    'position:relative;display:flex;flex-direction:column;align-items:center;gap:1rem;background:#fff;border-radius:1.25rem;padding:1.5rem;max-width:340px;width:100%;box-shadow:0 25px 50px rgba(0,0,0,0.3);text-align:center';

  function dismiss() {
    banner.style.display = 'none';
  }

  var closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.style.cssText =
    'position:absolute;top:0.75rem;right:0.75rem;background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1.25rem;line-height:1';
  closeBtn.onclick = dismiss;

  var logo = document.createElement('img');
  logo.src = 'logo.png';
  logo.alt = 'Munch Sprouts logo';
  logo.style.width = '4rem';

  var heading = document.createElement('h2');
  heading.textContent = 'Get the App!';
  heading.style.cssText = 'margin:0;font-size:1.25rem;font-weight:700';

  var para = document.createElement('p');
  para.style.cssText = 'margin:0;font-size:0.875rem;color:#4b5563';
  para.innerHTML =
    'For the best experience, download the <strong>Munch Sprouts</strong> app on your iPhone — track foods, log reactions, and more, all in one place.';

  var link = document.createElement('a');
  link.href =
    'https://apps.apple.com/gb/app/munch-sprouts-weaning-tracker/id6763142582';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  var badge = document.createElement('img');
  badge.src =
    'https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg';
  badge.alt = 'Download on the App Store';
  badge.style.height = '3rem';
  link.appendChild(badge);

  var continueBtn = document.createElement('button');
  continueBtn.textContent = 'Continue to web tracker';
  continueBtn.style.cssText =
    'background:none;border:none;cursor:pointer;font-size:0.8rem;color:#9ca3af;text-decoration:underline';
  continueBtn.onclick = dismiss;

  card.appendChild(closeBtn);
  card.appendChild(logo);
  card.appendChild(heading);
  card.appendChild(para);
  card.appendChild(link);
  card.appendChild(continueBtn);
  banner.appendChild(card);
  document.body.appendChild(banner);
});
