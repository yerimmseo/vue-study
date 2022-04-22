self.addEventListener('install', pEvent => {  // 서비스 워커 설치
  console.log('(install)서비스워커 설치 중');

  pEvent.waitUntil(
    caches.open('cacheName1').then(cache => cache.addAll(['/test.png', '/test.ico'])) // 서비스워커 설치가 완료되면 waitUntil안의 코드가 실행
    // 캐시 변수를 지정하고 해당 캐시에 저장할 데이터를 입력
  );
});

self.addEventListener('activate', pEvent => {
  console.log('(activation)서비스워커 동작');
});

self.addEventListener('fetch', pEvent => {
  console.log('(fetch)데이터 요청', pEvent.request);
});

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (r) {
      console.log('[Service Worker] Fetching resource: ' + e.request.url);
      return r || fetch(e.request).then(function (response) {
        return caches.open('cacheName1').then(function (cache) {
          console.log('[Service Worker] Caching new resource: ' + e.cache.put(e.request, response.clone()));
          return response;
        });
      });
    })
  );
});