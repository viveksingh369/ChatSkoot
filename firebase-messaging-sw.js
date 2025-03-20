importScripts('https://www.gstatic.com/firebasejs/7.14.0/firebase.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.0/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.0/init.js');

// importScripts('https://www.gstatic.com/firebasejs/7.14.0/init.js');

// {
//   "permissions": ["notifications"],
//   "background": {
//     "scripts": ["firebase-messaging-sw.js"]
//   }
// }

// chrome://flags/#cross-origin-opener-policy


var firebaseConfig = {
  apiKey: "AIzaSyA5iIDK9NIuAQ3bLXs8FSxVMJv9GHb06K4",
  authDomain: "chatskoot-fb294.firebaseapp.com",
  databaseURL: "https://chatskoot-fb294-default-rtdb.firebaseio.com",
  projectId: "chatskoot-fb294",
  storageBucket: "chatskoot-fb294.appspot.com",
  messagingSenderId: "688133918379",
  appId: "1:688133918379:web:80fee1ea0c19ce934f31ee"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// alert('hello service worker');

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('Received background message ', payload);
  const notificationTitle = 'You have new text message';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});

// const initializeFirebase = () => {
//   firebase.initializeApp(firebaseConfig);

//   const messaging = firebase.messaging();

//   alert('hello service worker');

//   messaging.setBackgroundMessageHandler(function(payload) {
//     console.log('Received background message ', payload);
//     const notificationTitle = 'You have new text message';
//     const notificationOptions = {
//       body: 'Background Message body.',
//       icon: '/firebase-logo.png'
//     };

//     return self.registration.showNotification(notificationTitle,
//         notificationOptions);
//   });
// }



  
