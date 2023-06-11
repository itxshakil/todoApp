const cacheName = 'todoApp-v1.7.2';

const filesToCache = [
    '/',
    '/index.html',
    'index.html?source=pwa',
    'index.html?source=shortcut',
    '/css/style.min.css',
    '/js/app.js',
    '/js/classes/ListTemplate.js',
    '/js/classes/Storage.js',
    '/js/classes/Task.js',
    '/js/classes/TaskManager.js',
    '/app.webmanifest',
    '/about.html',
    '/faq.html',
    '/share.html',
    '/js/share.js',
];

// Start the service worker and cache all of the app's content
self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(filesToCache)));
});

self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
            if (key !== cacheName) {
                return caches.delete(key);
            }
        }));
    }));
});

self.addEventListener('fetch', (e) => {
    e.respondWith(caches.match(e.request).then((response) => {
        if (response) {
            return response;
        }

        return fetch(e.request).then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }

            const responseToCache = response.clone();
            caches.open(cacheName).then((cache) => {
                cache.put(e.request, responseToCache);
            });

            return response;
        }).catch((e) => {
            console.error(e);
            return new Response();
        });
    }));
});
