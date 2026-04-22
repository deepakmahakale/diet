/**
 * Service Worker for Diet App
 * Handles offline caching and PWA functionality
 */

// ============================================================================
// Configuration
// ============================================================================

const CACHE_NAME = 'diet-app-cache-v3';

// Files to cache for offline functionality
const ASSETS_TO_CACHE = [
    // Root paths
    '/',
    './',

    // HTML pages
    'index.html',
    './index.html',
    '/index.html',
    'recipes.html',
    './recipes.html',
    '/recipes.html',
    'recipe-detail.html',
    './recipe-detail.html',
    '/recipe-detail.html',

    // Shared resources
    'styles.css',
    './styles.css',
    '/styles.css',
    'app.js',
    './app.js',
    '/app.js',
    'recipes.js',
    './recipes.js',
    '/recipes.js',
    'settings.html',
    './settings.html',
    '/settings.html',
    'settings.js',
    './settings.js',
    '/settings.js',
    'notifications.js',
    './notifications.js',
    '/notifications.js',

    // Manifest and Icons
    'site.webmanifest',
    'icon-192.png',
    'icon-512.png',
    'favicon.ico',
    'apple-touch-icon.png'
];

// ============================================================================
// Install Event
// ============================================================================

/**
 * Fired when service worker is first installed
 * Pre-cache all essential assets
 */
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[ServiceWorker] Caching app assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[ServiceWorker] All assets cached successfully');
                // Force the waiting service worker to become the active service worker
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[ServiceWorker] Failed to cache assets:', error);
            })
    );
});

// ============================================================================
// Activate Event
// ============================================================================

/**
 * Fired when service worker becomes active
 * Clean up old caches
 */
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Delete old caches
                        if (cacheName !== CACHE_NAME) {
                            console.log('[ServiceWorker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[ServiceWorker] Activated successfully');
                // Take control of all clients immediately
                return self.clients.claim();
            })
    );
});

// ============================================================================
// Fetch Event
// ============================================================================

/**
 * Intercept all network requests
 * Strategy: Cache first, fall back to network
 */
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached response if available
                if (cachedResponse) {
                    console.log('[ServiceWorker] Serving from cache:', event.request.url);
                    return cachedResponse;
                }

                // Otherwise, fetch from network
                console.log('[ServiceWorker] Fetching from network:', event.request.url);
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Cache successful responses for future use
                        if (networkResponse && networkResponse.status === 200) {
                            const responseToCache = networkResponse.clone();

                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache);
                                    console.log('[ServiceWorker] Cached new resource:', event.request.url);
                                });
                        }

                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('[ServiceWorker] Fetch failed:', error);

                        // For navigation requests, try to return index.html as fallback
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }

                        // For other requests, just let them fail
                        throw error;
                    });
            })
    );
});

// ============================================================================
// Message Event
// ============================================================================

/**
 * Handle messages from clients
 * Allows clients to communicate with the service worker
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('[ServiceWorker] Received SKIP_WAITING message');
        self.skipWaiting();
    }
});

// ============================================================================
// Notification Click Handling
// ============================================================================

/**
 * Handle notification clicks
 * Opens the app when user clicks a notification
 */
self.addEventListener('notificationclick', (event) => {
    console.log('[ServiceWorker] Notification clicked:', event.notification.tag);

    event.notification.close();

    // Get the URL to open (from notification data or default to index)
    const urlToOpen = event.notification.data?.url || '/index.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if app is already open
                for (const client of clientList) {
                    if (client.url.includes(urlToOpen) && 'focus' in client) {
                        return client.focus();
                    }
                }

                // If not open, open new window
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
            .catch((error) => {
                console.error('[ServiceWorker] Error handling notification click:', error);
            })
    );
});
