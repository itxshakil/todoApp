var cacheName =  'todoApp-v3';
// Change main js file name
var filesToCache = [
    '/todo/',
    '/todo/index.html',
    '/todo/css/style.min.css',
    '/todo/js/app.js',
    '/todo/js/classes/ListTemplate.js',
    '/todo/js/classes/Storage.js',
    '/todo/js/classes/Task.js',
    '/todo/js/classes/TaskManager.js',
    '/todo/sw.js'
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