'use strict';

const STATIC_CACHE_KEY = "memezr-static";

const STATIC_FILES_LIST = [
    '/vendor/bootstrap/bootstrap.min.css',
    '/vendor/bootstrap/bootstrap.bundle.min.js',
    
    '/css/memezr.css',
    '/js/memezr.js',

    '/icons/favicon.ico',
    '/icons/152.png',
];

self.addEventListener('install', (evt) => {
    console.log("sw instalation");

    evt.waitUntil(
        caches.open(STATIC_CACHE_KEY).then((cache) =>{
            return cache.addAll(STATIC_FILES_LIST);
        })
    );
    
    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    console.log("sw activation");
    
    evt.waitUntil(
        caches.keys().then((keylist) => {
            return Promise.all(keylist.map((key) => {
                if(STATIC_CACHE_KEY.indexOf(key) == -1)
                    return caches.delete(key);
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
    if(evt.request.mode !== 'navigate')
        return;
    
    evt.respondWith(
        fetch(evt.request).catch(() => {
            return caches.open(STATIC_CACHE_KEY).then((cache) => {
                return cache.match('index.html');
            });
        })
    );
});