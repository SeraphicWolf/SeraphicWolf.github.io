---
layout: none
---
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, StaleWhileRevalidate } = workbox.strategies;
const { CacheableResponse } = workbox.cacheableResponse;

workbox.core.setCacheNameDetails({
  prefix: 'seraphicwolf.github.io',
  suffix: '{{ site.time | date: "%Y-%m" }}'
});

registerRoute(
  '/',
  new NetworkFirst()
);

registerRoute(
  /page[0-99]/,
  new NetworkFirst()
)

registerRoute(
  new RegExp('/\\d{4}/\\d{2}/\\d{2}/.+'),
  new StaleWhileRevalidate()
)

workbox.precaching.precacheAndRoute([
  {% for post in site.posts limit:12 -%}
  { url: '{{ post.url }}', revision: '{{ post.date | date: "%Y-%m-%d"}}' },
  {% endfor -%}
  { url: '/', revision: '{{ site.time | date: "%Y%m%d%H%M" }}' },
  { url: '/aboutme', revision: '{{ site.time | date: "%Y%m%d%H%M" }}' },
  { url: '', revision: '{{ site.time | date: "%Y%m%d%H%M" }}' },
  { url: '/assets/css/index.css', revision: '{{ site.time | date: "%Y%m%d%H%M" }}' }
])

registerRoute(
  ({request}) => request.destination === 'image' ,
  new CacheFirst({
    plugins: [
      new CacheableResponse({statuses: [0, 200]})
    ],
  })
);

registerRoute(
  /assets\/(images|icons|css)/,
  new CacheFirst())
);

if ("serviceWorker" in navigator) {
  // register service worker
  navigator.serviceWorker.register("sw.js");
  navigator.serviceWorker && navigator.serviceWorker.register(‘./sw.js’).then(function(registration) {  console.log(‘Excellent, registered with scope: ‘, registration.scope);});
  }
);

