const cacheName = 'todoApp-v1.8.6';

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
    e.waitUntil(caches.keys()
        .then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        }).then(function () {
            // `claim()` sets this worker as the active worker for all clients that
            // match the workers scope and triggers an `oncontrollerchange` event for
            // the clients.
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(caches.match(e.request).then((response) => {
        if (response) {
            return response;
        }

        return fetch(e.request).then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic' || e.request.method !== 'GET' || e.request.url.indexOf('chrome-extension') !== -1) {
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

// on notificationclick event. if event action is close then close either open the home url
self.addEventListener('notificationclick', (event) => {
    if (event.action === 'close') {
        event.notification.close();
    } else {
        event.waitUntil(clients.matchAll({
            type: 'window',
        }).then((clientList) => {
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        }));
    }
});

self.addEventListener('periodicsync', async (event) => {
    if (event.tag === 'notificationSync') {
        const now = new Date();
        const startHour = 6; // Start hour (6 AM)
        const endHour = 23; // End hour (11 PM)

        if (now.getHours() >= startHour && now.getHours() < endHour) {
            if (Notification.permission === 'granted') {
                registerNotification();
            } else {
                // try {
                //     const permission = await Notification.requestPermission();
                //     if (permission === 'granted') {
                //         registerNotification();
                //     } else {
                //         alert('You need to allow push notifications.');
                //     }
                // } catch (e) {
                //     console.log(e);
                // }
            }
        }
    }
});

function registerNotification() {
    let message = "Good Morning, Time to plan your day";

    const now = new Date();
    if (now.getHours() >= 12 && now.getHours() < 16) {
        message = "Good Afternoon, Please update your tasks";
    } else if (now.getHours() >= 16 && now.getHours() < 20) {
        message = "Good Evening, Please update your tasks";
    } else {
        message = "Good Night, Time to plan your tomorrow and sleep";
    }

    self.registration.showNotification('Todo App', {
        tag: 'alert',
        body: message,
        badge: '/images/apple-icon-152x152.png',
        icon: '/images/apple-icon-152x152.png',
        actions: [
            {
                action: 'open',
                title: 'Open app',
            },
            {
                action: 'close',
                title: 'Close notification',
            }
        ],
        data: {
            url: '/',
        },
        requireInteraction: true,
        vibrate: [200, 100, 200],
        renotify: true,
    });
}