import firebase from "firebase";;

var firebaseConfig = {
    apiKey: "AIzaSyCgWduqXEmmFoOTzKV4GFJd_aIEvYX_8Dk",
    authDomain: "fleet-point-311715.firebaseapp.com",
    projectId: "fleet-point-311715",
    storageBucket: "fleet-point-311715.appspot.com",
    messagingSenderId: "1042119208019",
    appId: "1:1042119208019:web:6a4d4bf9037475854d2aa6",
    measurementId: "G-138W173KNJ"
  };
  const fire=firebase.initializeApp(firebaseConfig);
  const db=fire.firestore();
  const storage=firebase.storage();
  export {storage};
  export default db;
  

