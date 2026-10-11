// The app never forces a reload while someone is editing. Content refreshes in the
// background and is used on a subsequent clean launch, or after explicit update.
const CACHE='project-pan-app-v1';
const CORE=['./','./index.html','./styles.css','./app.mjs','./model.mjs','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const names=await caches.keys();await Promise.all(names.filter(name=>name.startsWith('project-pan-app-')&&name!==CACHE).map(name=>caches.delete(name)));await self.clients.claim()})()));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET'||new URL(request.url).origin!==location.origin)return;
 if(!CORE.some(path=>new URL(path,self.registration.scope).pathname===new URL(request.url).pathname))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);const cached=await cache.match(request);
  const update=fetch(request).then(response=>{if(response.ok)cache.put(request,response.clone());return response});
  if(cached){event.waitUntil(update.catch(()=>{}));return cached}
  try{return await update}catch{if(request.mode==='navigate')return cache.match('./index.html');return Response.error()}
 })());
});
