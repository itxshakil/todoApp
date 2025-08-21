const cacheName = 'todoApp-v1.8.13';

const filesToCache = [
    '/',
    '/index.html',
    'index.html?source=pwa',
    'index.html?source=shortcut',
    '/css/style.css',
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

self.addEventListener('notificationclick', (event) => {
    const action = event.action || 'default';
    const tag = event.notification.tag || 'general';

    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            clientList.forEach((client) => {
                client.postMessage({
                    type: 'notification_clicked',
                    tag,
                    action,
                    timestamp: Date.now(),
                });
            });

            if (action !== 'close') {
                return clients.openWindow(event.notification.data?.url || '/');
            }
        })
    );
});


self.addEventListener('periodicsync', async (event) => {
    if (event.tag === 'notificationSync') {
        if (Notification.permission === 'granted') {
            registerNotification();
        }
    }
});

function registerNotification() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const SUNDAY = 0;
    const SATURDAY = 6;
    const isWeekend = day === SUNDAY || day === SATURDAY;

    const messages = {
        earlyMorning: isWeekend
            ? [
                "Weekend boost! Add something fun or relaxing to your list 🎉",
                "Slow and steady — any small plans for today?",
            ]
            : [
                "Rise and shine! What's the game plan today? ☀️",
                "Good morning! Take 60 seconds to set your priorities 📝",
                "Let's set a positive tone — update your tasks for today ✅"
            ],
        midMorning: isWeekend
            ? [
                "What’s your vibe today? Organize it in your list ✨",
                "Quick note: add anything exciting to your plans?",
            ]
            : [
                "How’s your day shaping up? Need to refocus?",
                "Quick check-in: knock out those tasks 💪",
                "Feeling productive? Your list is waiting!"
            ],
        afternoon: isWeekend
            ? [
                "Got something halfway done? Wrap it up like a pro 🎯",
                "Afternoon feels — make sure your plans are on track 🧘",
            ]
            : [
                "Keep the momentum going — review your task list ✅",
                "Midday check-in: what’s still pending?",
                "You’re crushing it! Just a few things left to tackle 💥"
            ],
        evening: isWeekend
            ? [
                "Evening already? A quick review won’t hurt 😌",
                "Wanna get ahead for tomorrow? Start now 👣",
            ]
            : [
                "Evening calm? Time to wrap up and reflect 🌇",
                "Set yourself up for a smooth tomorrow 🎯",
                "A quick list update before bed can do wonders 💤"
            ],
        night: [
            "Before bed: anything to plan for tomorrow? 🌙",
            "Tomorrow’s peace starts with tonight’s plan 🧠",
            "Wind down with clarity — prep your next move 🛏️"
        ]
    };

    function getRandomMessage(group) {
        return group[Math.floor(Math.random() * group.length)];
    }

    let selectedGroup = messages.night; // default

    if (hour >= 6 && hour < 9) {
        selectedGroup = messages.earlyMorning;
    } else if (hour >= 9 && hour < 12) {
        selectedGroup = messages.midMorning;
    } else if (hour >= 12 && hour < 16) {
        selectedGroup = messages.afternoon;
    } else if (hour >= 16 && hour < 21) {
        selectedGroup = messages.evening;
    }

    const message = getRandomMessage(selectedGroup);

    self.registration.showNotification('📝 Todo App Reminder', {
        tag: 'alert',
        body: message,
        badge: '/images/apple-icon-152x152.png',
        icon: '/images/apple-icon-152x152.png',
        actions: [
            {
                action: 'open',
                title: 'Open App',
            },
            {
                action: 'close',
                title: 'Maybe Later',
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

