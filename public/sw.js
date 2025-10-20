const CACHE_NAME = 'cours-app-v1';
const STATIC_CACHE_NAME = 'cours-app-static-v1';
const DYNAMIC_CACHE_NAME = 'cours-app-dynamic-v1';

// Fichiers à mettre en cache pour le fonctionnement hors ligne
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/_next/static/css/app/layout.css',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/main-app.js',
  '/_next/static/chunks/app/page.js',
  '/_next/static/chunks/app/layout.js'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Mise en cache des fichiers statiques');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Suppression de l\'ancien cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ne pas intercepter les requêtes API pour avoir les données les plus récentes
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .catch(() => {
          // En cas d'erreur réseau, essayer de récupérer depuis le cache
          return caches.match(request);
        })
    );
    return;
  }

  // Stratégie de cache : Cache First pour les assets statiques
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'image' ||
      request.destination === 'font') {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          
          return fetch(request)
            .then((response) => {
              // Mettre en cache la nouvelle réponse
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
              return response;
            });
        })
    );
    return;
  }

  // Stratégie : Network First pour les pages HTML
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Mettre en cache la réponse
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseClone);
            });
          return response;
        })
        .catch(() => {
          // Si le réseau échoue, essayer le cache
          return caches.match(request)
            .then((response) => {
              if (response) {
                return response;
              }
              // Fallback à la page offline
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // Pour les autres requêtes, utiliser la stratégie Network First
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Mettre en cache les réponses réussies
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // En cas d'erreur, essayer le cache
        return caches.match(request);
      })
  );
});

// Gestion des messages (pour la communication avec l'application)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    // Forcer la mise à jour du cache
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }
});

// Synchronisation en arrière-plan (pour les futures fonctionnalités)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Logique de synchronisation des données
      console.log('Service Worker: Synchronisation en arrière-plan')
    );
  }
});

// Gestion des notifications push (pour les futures fonctionnalités)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Voir',
          icon: '/icons/checkmark.png'
        },
        {
          action: 'close',
          title: 'Fermer',
          icon: '/icons/xmark.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Gestion du clic sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});