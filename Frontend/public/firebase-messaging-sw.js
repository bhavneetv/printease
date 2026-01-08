importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDhzCf4vNgVYsyLSJqpKy1MQA75TkR8HxI",
  authDomain: "unicart-35704.firebaseapp.com",
  projectId: "unicart-35704",
  storageBucket: "unicart-35704.firebasestorage.app",
  messagingSenderId: "648353652276",
  appId: "1:648353652276:web:f0388a7f2932069208f461",
  measurementId: "G-D3PZVMH4T8"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// This handles notifications when the app is completely closed or in the background
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png' // Change this to your app icon path if you have one
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});