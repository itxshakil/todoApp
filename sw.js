var cacheName =  'todoApp-v4';
// Change main js file name
var filesToCache = [
    '/',
    '/index.html',
    '/css/style.min.css',
    '/js/app.js',
    '/js/classes/ListTemplate.js',
    '/js/classes/Storage.js',
    '/js/classes/Task.js',
    '/js/classes/TaskManager.js',
    '/sw.js'
];

// Start the service worker and cache all of the app's content
self.addEventListener('install' , function(e){
    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            return cache.addAll(filesToCache);
        })
    );
});

// Serve Cache content when offline

self.addEventListener('fetch', function(e){
    e.respondWith(
        caches.match(e.request).then(function(response){
            return response || fetch(e.request);
        })
    );
});