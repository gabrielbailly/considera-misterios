// --- Service Worker para la PWA del Santo Rosario ---

// Versión del caché. Cambia este valor si actualizas los archivos para forzar la actualización.
const CACHE_NAME = 'santo-rosario-cache-v1';

// Archivos que se guardarán en el caché para que la app funcione sin conexión.
const urlsToCache = [
  './', // La página principal
  './manifest.json', // El manifiesto de la app
  // Los audios son cruciales para la experiencia sin conexión
  'https://gabrielbailly-25.github.io/considera-misterios/audios/gozosos.m4a',
  'https://gabrielbailly-25.github.io/considera-misterios/audios/luminosos.m4a',
  'https://gabrielbailly-25.github.io/considera-misterios/audios/dolorosos.m4a',
  'https://gabrielbailly-25.github.io/considera-misterios/audios/gloriosos.m4a'
];

// Evento 'install': Se dispara cuando el Service Worker se instala.
// Aquí abrimos el caché y guardamos nuestros archivos.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto y listo para guardar archivos.');
        // Es importante usar addAll para que si uno falla, falle toda la operación.
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'activate': Se dispara después de la instalación.
// Aquí se suelen limpiar los cachés antiguos que ya no se usan.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Si el nombre del caché no está en nuestra lista blanca, lo borramos.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento 'fetch': Se dispara cada vez que la página pide un recurso (una imagen, un script, etc.).
// Aquí interceptamos la petición y decidimos si la servimos desde el caché o desde la red.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si encontramos el recurso en el caché, lo devolvemos.
        if (response) {
          return response;
        }

        // Si no está en el caché, lo pedimos a la red.
        return fetch(event.request);
      }
    )
  );
});
