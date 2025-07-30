// public/service-worker.js

// Version 1.6 - Added self.skipWaiting() for immediate Service Worker updates
// This is the service worker file. It should be placed in the `public` directory
// and registered in your main React app entry point (e.g., main.tsx).

// Listen for the 'install' event to force immediate activation
self.addEventListener("install", function (event) {
  console.log(
    "[Service Worker] Installing Service Worker. Skipping waiting phase."
  );
  self.skipWaiting(); // Forces the new Service Worker to activate immediately
});

self.addEventListener("push", function (event) {
  console.log("[Service Worker] Push event received.");

  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
      console.log("[Service Worker] Successfully parsed push data:", data);
    } catch (e) {
      console.error("[Service Worker] Error parsing push data to JSON:", e);
      try {
        data.body = event.data.text();
        console.log(
          "[Service Worker] Push data as text (JSON parsing failed):",
          data.body
        );
      } catch (textError) {
        console.error(
          "[Service Worker] Also failed to get push data as text:",
          textError
        );
      }
      data = {};
    }
  } else {
    console.log("[Service Worker] Push event received with no data payload.");
  }

  const title = data.title || "FitFocus Notification";
  const body = data.body || "You have a new update from FitFocus!";
  const icon =
    data.icon ||
    "https://res.cloudinary.com/dkv3bx51z/image/upload/v1753765682/FitFocus_da7uvi.png";
  const badge =
    data.badge ||
    "https://res.cloudinary.com/dkv3bx51z/image/upload/v1753765772/bell_l81cml.png";
  const url = data.url || "/";

  const options = {
    body: body,
    icon: icon,
    badge: badge,
    data: {
      url: url,
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    vibrate: [200, 100, 200],
    actions: [{ action: "open_url", title: "Go to App" }],
  };

  console.log(
    "[Service Worker] Preparing to show notification with title:",
    title
  );
  console.log("[Service Worker] Notification options being used:", options);

  event.waitUntil(
    self.registration
      .showNotification(title, options)
      .then(() => {
        console.log("[Service Worker] Notification shown successfully!");
      })
      .catch((error) => {
        console.error(
          "[Service Worker] ERROR: Failed to show notification:",
          error
        );
        if (error.name === "TypeError") {
          console.error(
            "[Service Worker] Possible issue: Invalid URL for icon/badge, or other malformed option."
          );
        } else if (error.name === "DOMException") {
          console.error(
            "[Service Worker] DOMException: Check browser/OS permissions, notification limits, or if notification content is too large."
          );
        } else {
          console.error(
            "[Service Worker] Unhandled error during showNotification:",
            error.message
          );
        }
      })
  );
});

self.addEventListener("notificationclick", function (event) {
  console.log("[Service Worker] Notification clicked:", event.notification.tag);

  event.notification.close();

  const clickedNotification = event.notification.data;
  const urlToOpen = clickedNotification.url || "/";

  console.log("[Service Worker] Opening URL:", urlToOpen);

  event.waitUntil(
    clients
      .openWindow(urlToOpen)
      .then(() => {
        console.log("[Service Worker] Window opened successfully.");
      })
      .catch((error) => {
        console.error(
          "[Service Worker] Error opening window from click:",
          error
        );
      })
  );
});

// Optional: Add a basic fetch handler if you want to cache assets (for PWA)
// self.addEventListener('fetch', function(event) {
//   // Example: Cache-first strategy
//   event.respondWith(
//   //   caches.match(event.request).then(function(response) {
//   //     return response || fetch(event.request);
//   //   })
//   );
// });
