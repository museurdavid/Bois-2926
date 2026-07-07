/* Plateforme LENAXIS — cache hors connexion — version 2.0 */
var CACHE = "lenaxis-v2-0";
var CORE = [
  "./", "index.html", "manifest.webmanifest",
  "img/hero_bois.jpg", "img/bande_sciages.jpg",
  "img/logo_secure.jpg", "img/logo_aacf.jpg", "img/video_poster.jpg",
  "docs/CR_Reunion_12_mai_2026_v3.pdf",
  "docs/Courriel_recapitulatif_D_Cassagne_12_mai_2026.pdf",
  "docs/Tableau_garanties_premier_jet_AACFRANCE.pdf",
  "docs/Programme_assurance_filiere_bois_presentation.pdf",
  "docs/Piece_reference_AACFRANCE_projet_SYMETRI.pdf",
  "video/lenaxis_demonstration.mp4",
  "icons/icon-192.png", "icons/icon-512.png"
];
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(CORE); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch", function(e){
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, {ignoreSearch:true}).then(function(hit){
      return hit || fetch(e.request).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
        return res;
      });
    }).catch(function(){ return caches.match("index.html"); })
  );
});
