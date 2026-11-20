/**
 * Service Worker Oficial — COMUNIDADE EM AÇÃO (Amazonas)
 * Focado no cacheamento de estilos, fontes, imagens e shell estático
 * para garantir o carregamento do portal em áreas com instabilidade de rede (rios, ramais e interior).
 */

const CACHE_NAME = 'comunidade-em-acao-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Instalação do Service Worker & Precache do Shell Básico
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// Ativação e Limpeza de Caches Antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Interceptação de Requisições com Estratégia Híbrida Inteligente
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Ignorar requisições não-GET ou extensões do navegador
  if (request.method !== 'GET') return;
  if (!request.url.startsWith('http')) return;

  const url = new URL(request.url);

  // 1. Navegação de Página (HTML): Network-First com Fallback para Cache
  // Garante que atualizações do portal cheguem de imediato, mas se cair a rede, abre a casca offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('/index.html') || caches.match('/');
          });
        })
    );
    return;
  }

  // 2. Estilos, Scripts, Imagens e Fontes: Stale-While-Revalidate / Cache-First
  const isStaticAsset =
    url.pathname.match(/\.(css|js|png|jpg|jpeg|svg|webp|ico|woff|woff2|ttf|eot)$/i) ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        // Retorna o cache imediatamente se houver, ou espera a rede
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. Demais requisições: Rede com fallback para cache se disponível
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// Escuta mensagem para pular espera quando houver atualização
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
