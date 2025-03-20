import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "chatskoot-fb294.firebaseapp.com",
  databaseURL: "https://chatskoot-fb294-default-rtdb.firebaseio.com",
  projectId: "chatskoot-fb294",
  storageBucket: "chatskoot-fb294.appspot.com",
  messagingSenderId: "688133918379",
  appId: process.env.APP_KEY,
};


// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// var messaging = firebase.messaging();

// firebase.auth().onAuthStateChanged(function (user) {
//   if (user) {
//     var userInfo = { email: "", name: "", photoURL: "" };
//     var userData = "";

//     userInfo.email = user.email;
//     userInfo.name = user.displayName;
//     userInfo.photoURL = user.photoURL;

//     var db = firebase.database().ref("users");
//     var flag = false;

//     db.on("value", function (users) {
//       users.forEach(function (data) {
//         userData = data.val();
//         if (userData.email === userInfo.email) {
//           currentUser = data.key;
//           flag = true;
//           document.getElementById("user_profile").src = user.photoURL;
//           document.getElementById("user_profile").title = user.displayName;

//           document.getElementById("signInBtn").style = "display:none";
//           document.getElementById("signOutBtn").style = "display:block";
//         }
//       });

//       if (flag === false) {
//         firebase.database().ref("users").push(userInfo, function(error){
//           if (error) {
//             alert(error);
//           }else{
//             document.getElementById("user_profile").src = user.photoURL;
//             document.getElementById("user_profile").title = user.displayName;
    
//             document.getElementById("signInBtn").style = "display:none";
//             document.getElementById("signOutBtn").style = "display:block";
//           }
//         });
//       }

//       // const messaging = firebase.messaging();
//       // messaging.usePublicVapidKey("BKC-AqXTH9LC2J2AF3eWlD3GyRjY8eWNjPYDSUTNeCNvO0yXwqTrs-eI0SO4Y0uJQ_X1AxEJ8-qSFcb4N0mfo4k");
      
//       messaging.requestPermission().then(function() {
//        return messaging.getToken();
//       }).then(function(token) {
//         console.log(token);
//         firebase.database().ref('fcmTokens').child(currentUser).set({token_id:token});
//       }).catch(function() {
//         console.log('Access Denied!');
//       })
  
//       loadFrndList();
//       notificationCounter();
//       // loadMessage();
//     });
//   } else {
//     document.getElementById("signInBtn").style = "display:block";
//     document.getElementById("signOutBtn").style = "display:none";
//   }
// });


const initializeFirebase = () => {
  firebase.initializeApp(firebaseConfig);

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var userInfo = { email: "", name: "", photoURL: "" };
      var userData = "";
  
      userInfo.email = user.email;
      userInfo.name = user.displayName;
      userInfo.photoURL = user.photoURL;
  
      var db = firebase.database().ref("users");
      var flag = false;
  
      db.on("value", function (users) {
        users.forEach(function (data) {
          userData = data.val();
          if (userData.email === userInfo.email) {
            currentUser = data.key;
            flag = true;
            document.getElementById("user_profile").src = user.photoURL;
            document.getElementById("user_profile").title = user.displayName;
  
            document.getElementById("signInBtn").style = "display:none";
            document.getElementById("signOutBtn").style = "display:block";
          }
        });
  
        if (flag === false) {
          firebase.database().ref("users").push(userInfo, function(error){
            if (error) {
              alert(error);
            }else{
              document.getElementById("user_profile").src = user.photoURL;
              document.getElementById("user_profile").title = user.displayName;
      
              document.getElementById("signInBtn").style = "display:none";
              document.getElementById("signOutBtn").style = "display:block";
            }
          });
        }

        var messaging = firebase.messaging();
        // messaging.usePublicVapidKey("BKC-AqXTH9LC2J2AF3eWlD3GyRjY8eWNjPYDSUTNeCNvO0yXwqTrs-eI0SO4Y0uJQ_X1AxEJ8-qSFcb4N0mfo4k");
        
        messaging.requestPermission().then(function() {
         return messaging.getToken();
        }).then(function(token) {
          console.log(token);
          firebase.database().ref('fcmTokens').child(currentUser).set({token_id:token});
        });
    
        loadFrndList();
        notificationCounter();
        // loadMessage();
      });
    } else {
      document.getElementById("signInBtn").style = "display:block";
      document.getElementById("signOutBtn").style = "display:none";
    }
  });
}
