import firebase from "firebase";;

var firebaseConfig = {
    // add your firebase configuration
  };
  const fire=firebase.initializeApp(firebaseConfig);
  const db=fire.firestore();
  const storage=firebase.storage();
  export {storage};
  export default db;
  

