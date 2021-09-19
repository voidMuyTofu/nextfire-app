import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import "firebase/compat/firestore"
import "firebase/compat/storage"


const firebaseConfig = {
    apiKey: "AIzaSyDB9ZZSc2gji_SValUdVeomaY38sTsyGT4",
    authDomain: "nextfire-tofu.firebaseapp.com",
    projectId: "nextfire-tofu",
    storageBucket: "nextfire-tofu.appspot.com",
    messagingSenderId: "448771437959",
    appId: "1:448771437959:web:31dc5b9d65fcae91598f22",
    measurementId: "G-MFY7BRKLEW"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();