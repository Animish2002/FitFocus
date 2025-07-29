// public/service-worker.js

// Version 1.2 - Added a comment to force update
// This is the service worker file. It should be placed in the `public` directory
// and registered in your main React app entry point (e.g., index.js).

self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "FitFocus Notification";
  const options = {
    body: data.body || "You have a new update from FitFocus!",
    icon:
      data.icon ||
      "https://res.cloudinary.com/dkv3bx51z/image/upload/v1753765682/FitFocus_da7uvi.png", // Default icon
    badge:
      data.badge ||
      "https://res.cloudinary.com/dkv3bx51z/image/upload/v1753765772/bell_l81cml.png", // Small icon for notification tray on some OS
    data: {
      url: data.url || "/", // URL to open when notification is clicked
    },
    vibrate: [200, 100, 200], // Vibration pattern
    actions: [
      // Optional actions
      { action: "open_url", title: "Go to App" },
      // { action: 'mark_as_read', title: 'Mark as Read' }, // Example
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close(); // Close the notification

  const clickedNotification = event.notification.data;
  const urlToOpen = clickedNotification.url || "/";

  event.waitUntil(
    clients.openWindow(urlToOpen) // Open the URL when clicked
  );
});

// Optional: Add a basic fetch handler if you want to cache assets (for PWA)
// self.addEventListener('fetch', function(event) {
//   // Example: Cache-first strategy
//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//       return response || fetch(event.request);
//     })
//   );
// });
