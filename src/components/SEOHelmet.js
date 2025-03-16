import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

function SEOHelmet({ 
  title, 
  description, 
  gameData = null, 
  noindex = false,
  canonicalUrl = null
}) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const currentUrl = window.location.origin + location.pathname;
  const canonical = canonicalUrl || currentUrl;

  // Default meta data based on current route
  const getDefaultMeta = () => {
    const path = location.pathname;
    
    if (path === '/') {
      return {
        title: `${t('appName')} - ${t('tagline')}`,
        description: t('homeMetaDesc')
      };
    }
    if (path === '/history') {
      return {
        title: `${t('history')} | ${t('appName')}`,
        description: t('historyMetaDesc')
      };
    }
    if (path.startsWith('/game/')) {
      return {
        title: `${gameData?.title || t('results')} | ${t('appName')}`,
        description: t('gameMetaDesc')
      };
    }
    if (path === '/admin') {
      return {
        title: `${t('appName')} Admin`,
        description: t('adminMetaDesc')
      };
    }
    
    return {
      title: `${t('appName')} - ${t('tagline')}`,
      description: t('homeMetaDesc')
    };
  };

  const defaultMeta = getDefaultMeta();
  const metaTitle = title || defaultMeta.title;
  const metaDescription = description || defaultMeta.description;

  // Generate structured data for game pages
  const getStructuredData = () => {
    if (!gameData) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'Game',
      'name': gameData.title,
      'description': `Poker game results with total pot ${gameData.potValue}`,
      'numberOfPlayers': gameData.results.length,
      'dateCreated': gameData.date,
      'gameLocation': 'Online',
      'potValue': {
        '@type': 'MonetaryAmount',
        'value': gameData.potValue,
        'currency': gameData.currency.code
      }
    };
  };

  const structuredData = getStructuredData();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={i18n.language} />
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex" />}

      {/* Open Graph */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={gameData ? 'article' : 'website'} />

      {/* Twitter */}
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />

      {/* Alternate Language Links */}
      {Object.keys(i18n.options.resources).map((lang) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`${window.location.origin}${location.pathname}?lang=${lang}`}
        />
      ))}

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

export default SEOHelmet; 