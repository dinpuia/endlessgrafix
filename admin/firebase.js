// firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyDeXPI59Y1t3EqcS11_05Qyc-i16o5iriQ",
  authDomain: "endless-grafix-admin-5fff7.firebaseapp.com",
  projectId: "endless-grafix-admin-5fff7",
  storageBucket: "endless-grafix-admin-5fff7.appspot.com",
  messagingSenderId: "685694239178",
  appId: "1:685694239178:web:e3bbe47e8c32a0df4f8f33"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
