import React, { useEffect, useState } from 'react';
import './App.css';

function parseContinuation() {
  const params = new URLSearchParams(window.location.search);
  let cont = params.get('continue') || '';
  return cont.replace(/^\/+/, '');
}

function attemptOpen(url, onFail) {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = url;
  document.body.appendChild(iframe);
  const timeout = setTimeout(() => {
    document.body.removeChild(iframe);
    onFail();
  }, 2200);

  const onVisibility = () => {
    if (document.hidden) {
      clearTimeout(timeout);
      document.removeEventListener('visibilitychange', onVisibility);
    }
  };
  document.addEventListener('visibilitychange', onVisibility);
}

export default function App() {
  const [fallback, setFallback] = useState(false);
  const continuation = parseContinuation();

  const schemeURL = `slush://${continuation}`;
  const webURL = `https://my.slush.app/${continuation}`;

  useEffect(() => {
    const hasExtension = typeof window.suiWallet !== 'undefined' &&
      (window.suiWallet.isSlush || (window.suiWallet.name || '').toLowerCase() === 'slush');

    if (hasExtension) {
      window.open(webURL, '_blank');
    } else {
      attemptOpen(schemeURL, () => setFallback(true));
    }
  }, []);

  if (fallback) {
    return (
      <div className="container">
        <h2>Open in Slush</h2>
        <button className="logo-btn" onClick={() => window.location.href = schemeURL} aria-label="Open in Slush" />
        <p className="small">
          <a href="https://apps.apple.com/us/app/slush-a-sui-wallet/id6476572140" target="_blank" rel="noreferrer">App Store</a>
          {' | '}
          <a href="https://play.google.com/store/apps/details?id=com.mystenlabs.slush" target="_blank" rel="noreferrer">Google Play</a>
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Opening Slush…</h2>
      <p className="small">If nothing happens, you’ll see options shortly.</p>
    </div>
  );
}
