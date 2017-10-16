(function(self:any) {
	const CACHENAMES = {
		CODE: 'v1.2'
	};

	self.addEventListener('install', (event:any) => {
		event.waitUntil(
			caches.open(CACHENAMES.CODE)
				.then(cache => {
					return cache.addAll([
						'/',
						'/game.js'
					])
					.then(() => self.skipWaiting());
				})
		);
	});	

	self.addEventListener('activate',  (event:any) => {
		event.waitUntil(Promise.all([self.clients.claim(),
			caches.keys().then((keyList:any[]) => {
				return Promise.all(keyList.map(function(key) {
					if (Object.values(CACHENAMES).indexOf(key) == -1) {
						return caches.delete(key);
					}
					return true;
				}));
			})
		]));
	});

	self.addEventListener('fetch', (event:any) => {
		event.respondWith(
			caches.match(event.request).then(r => r || fetch(event.request))
		);
	});

})(self);