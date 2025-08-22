const cacheName = 'todoApp-v1.8.14';

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

// ---- Simple IndexedDB key-value helpers (for SW only) ----
const DB_NAME = 'todo-app-sw';
const DB_VERSION = 1;
const STORE = 'meta';

function openDb() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE)) {
                db.createObjectStore(STORE);
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function idbSet(key, value) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(value, key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
    });
}

async function idbGet(key) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readonly');
        const req = tx.objectStore(STORE).get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

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

// Receive pending summary and last-notify updates from the page
self.addEventListener('message', (event) => {
    const data = event.data || {};
    if (data && data.type === 'tasks_summary_update') {
        // {count:number, sample:string}
        idbSet('pendingCount', data.count);
        idbSet('pendingSample', data.sample || '');
    } else if (data && data.type === 'last_notify_update') {
        idbSet('lastNotifyAt', Date.now());
    }
});

const MIN_NOTIFY_INTERVAL_MS = 5 * 60 * 60 * 1000; // align with periodic min interval (5h)

async function maybeShowPendingReminder(trigger) {
    try {
        const permission = Notification.permission;
        if (permission !== 'granted') return;

        const last = parseInt((await idbGet('lastNotifyAt')) || '0', 10) || 0;
        const now = Date.now();
        if (now - last < MIN_NOTIFY_INTERVAL_MS) return;

        const count = parseInt((await idbGet('pendingCount')) || '0', 10) || 0;
        const sample = (await idbGet('pendingSample')) || '';
        if (!count || count <= 0) return; // nothing pending, don't ping

        const title = `📝 ${count} pending task${count === 1 ? '' : 's'}`;
        const body = pickMotivationMessage(count, sample);

        await self.registration.showNotification(title, {
            tag: 'pending-tasks',
            body,
            badge: '/images/apple-icon-152x152.png',
            icon: '/images/apple-icon-152x152.png',
            actions: [
                { action: 'open', title: 'Open App' },
                { action: 'close', title: 'Later' },
            ],
            data: { url: '/' },
            requireInteraction: false,
            renotify: true,
        });
        await idbSet('lastNotifyAt', now);
    } catch (err) {
        console.warn('[SW] maybeShowPendingReminder error:', err);
    }
}

// Periodic Background Sync handler
self.addEventListener('periodicsync', async (event) => {
    if (event.tag === 'notificationSync') {
        event.waitUntil(maybeShowPendingReminder('periodic'));
    }
});

// One-off Background Sync fallback
self.addEventListener('sync', (event) => {
    if (event.tag === 'notificationSync') {
        event.waitUntil(maybeShowPendingReminder('sync'));
    }
});

// Lightweight message-based motivation (utility reused for SW)
function pickMotivationMessage(count, sample) {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const isWeekend = day === 0 || day === 6;

    const withCount = [
        `You have ${count} task${count === 1 ? '' : 's'} waiting. Let's clear one now!`,
        `${count} pending — small steps, big wins. Try: "${sample || 'your top task'}"`,
        `${count} to go. Future you will thank you!`,
        `Quick win time: ${count} pending. Pick one and crush it 💪`,
    ];

    const earlyMorning = isWeekend ? [
        `Weekend boost! Got ${count} pending? Plan one and relax 🎉`,
        `Slow and steady — ${count} to lightly tackle today.`,
    ] : [
        `Morning focus: ${count} pending. Start with "${sample || 'a 2‑minute task'}" ☀️`,
        `Set the tone — ${count} pending. Choose your one big thing.`,
    ];

    const midMorning = isWeekend ? [
        `What’s your vibe? ${count} pending — line up one easy win ✨`,
        `Quick note: add or clear one — ${count} waiting.`,
    ] : [
        `How’s it going? ${count} pending. One step now beats ten later.`,
        `Momentum check: ${count} left. Try: "${sample || 'the next smallest step'}"`,
    ];

    const afternoon = isWeekend ? [
        `Halfway there? ${count} pending — wrap one up 🎯`,
        `Afternoon flow — clear one and enjoy the rest 🧘`,
    ] : [
        `Midday nudge: ${count} pending. Chip away at one ✅`,
        `You’re doing great. ${count} left — keep the streak!`,
    ];

    const evening = isWeekend ? [
        `Evening check: ${count} pending. Set up an easy win 😌`,
        `Get ahead for tomorrow — clear one of ${count} 👣`,
    ] : [
        `Evening calm: ${count} pending. One last tidy-up 🌇`,
        `Set tomorrow up right — reduce ${count} to ${Math.max(0, count - 1)} 🎯`,
    ];

    const night = [
        `Before bed: ${count} pending. Park the next step for tomorrow 🌙`,
        `Wind down with clarity — ${count} left. Note one tiny action 🛏️`,
    ];

    let pool = withCount;
    if (hour >= 6 && hour < 9) pool = earlyMorning;
    else if (hour >= 9 && hour < 12) pool = midMorning;
    else if (hour >= 12 && hour < 16) pool = afternoon;
    else if (hour >= 16 && hour < 21) pool = evening;
    else pool = night;

    const all = withCount.concat(pool);
    return all[Math.floor(Math.random() * all.length)];
}

