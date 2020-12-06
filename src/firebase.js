import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDGHR7Vrx9vR8HixovrZdofRPAorSbVc_I",
  authDomain: "moongram-c8f23.firebaseapp.com",
  projectId: "moongram-c8f23",
  storageBucket: "moongram-c8f23.appspot.com",
  messagingSenderId: "514311233750",
  appId: "1:514311233750:web:5d973dc800a037b599e977"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage, firebase };
