import React, { useEffect } from 'react';

const GoogleAd = () => {
  useEffect(() => {
    try {
      // Load the ad script
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2844231577806386';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);

      // Initialize the ad
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Error loading ad:', error);
    }

    // Cleanup
    return () => {
      const script = document.querySelector('script[src*="adsbygoogle.js"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', margin: '20px 0' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2844231577806386"
        data-ad-slot="5585269099"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default GoogleAd; 