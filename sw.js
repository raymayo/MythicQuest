self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('static').then(cache => {
            return cache.addAll(['./index.html', './style.css', './script.js', './img/120.png', './img/192.png', './img/512.png','./img/favicon.png','./img/Pattern.svg','./img/ScoreBg.svg'])
        })
    )
})

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(response =>{
            return response || fetch(e.request);
        })
    )
});