(() => {
  const deepLink = 'buapt://offer?campaign=xtreme-waterford';
  const apple = 'https://apps.apple.com/app/id6786478501';
  const google = 'https://play.google.com/store/apps/details?id=com.bua.pt';
  const android = /Android/i.test(navigator.userAgent);
  const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const open = document.getElementById('open');
  const install = document.getElementById('install');
  const title = document.getElementById('title');
  if (Date.now() >= Date.parse('2027-05-21T00:00:00Z')) {
    title.textContent = 'This offer has ended';
    document.getElementById('message').textContent = 'You can still find BUA in your app store.';
    open.hidden = true;
    return;
  }
  if (!ios && !android) {
    document.getElementById('message').textContent = 'Scan this QR with your phone. After installing BUA, scan again to open your offer.';
    return;
  }
  document.getElementById('stores').hidden = true;
  install.hidden = false;
  install.href = android ? google : apple;
  install.textContent = android ? 'Get BUA on Google Play' : 'Get BUA on the App Store';
  if (android) {
    // Chrome requires a user gesture. Its native intent resolver selects the
    // installed app or Play Store fallback without guessing installation state.
    open.href = 'intent://offer?campaign=xtreme-waterford#Intent;scheme=buapt;package=com.bua.pt;S.browser_fallback_url=' + encodeURIComponent(google) + ';end';
    return;
  }
  let timer;
  let left = false;
  function cancelFallback() { left = true; clearTimeout(timer); }
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelFallback(); });
  window.addEventListener('pagehide', cancelFallback);
  // Do not send someone to the store when they return from the opened app.
  window.addEventListener('blur', () => clearTimeout(timer));
  function launch(event) {
    if (event) event.preventDefault();
    clearTimeout(timer); left = false;
    title.textContent = 'Opening BUA…';
    timer = setTimeout(() => {
      if (!left && !document.hidden) window.location.replace(apple);
    }, 2500);
    window.location.href = deepLink;
  }
  open.addEventListener('click', launch);
  launch();
})();
