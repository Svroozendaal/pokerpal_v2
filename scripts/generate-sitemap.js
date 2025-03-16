const fs = require('fs');
const path = require('path');

const baseUrl = 'https://pokerpal.online'; // Replace with your actual domain
const languages = ['en', 'es']; // Add more languages as needed

const routes = [
  {
    path: '/',
    changefreq: 'weekly',
    priority: 1.0
  },
  {
    path: '/login',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    path: '/signup',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    path: '/account',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    path: '/history',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    path: '/terms',
    changefreq: 'monthly',
    priority: 0.5
  }
];

const generateSitemap = () => {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  sitemap += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  routes.forEach(route => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}${route.path}</loc>\n`;
    
    // Add language alternates
    languages.forEach(lang => {
      sitemap += `    <xhtml:link\n`;
      sitemap += `       rel="alternate"\n`;
      sitemap += `       hreflang="${lang}"\n`;
      sitemap += `       href="${baseUrl}${route.path}?lang=${lang}"/>\n`;
    });

    sitemap += `    <changefreq>${route.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${route.priority}</priority>\n`;
    sitemap += '  </url>\n';
  });

  sitemap += '</urlset>';

  // Write the sitemap file
  fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
};

generateSitemap(); 