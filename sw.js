const CACHE_NAME = 'ncs-stat-v2';
const assets = [
  './',
  './index.html',
  './no_agrupados.html',
  './agrupados.html',
  './manifest.json',
'./icono_Calculadora.jpg',
'./gestion_datos.html',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});