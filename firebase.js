import firebase from "firebase/app"
import "firebase/firebase-firestore.memory"

const firebaseConfig = {
    apiKey: "AIzaSyCtqLWgpfGA7wC9wEesatP8ltNoTg1-HH0",
    authDomain: "erguderzm-e0e93.firebaseapp.com",
    projectId: "erguderzm-e0e93",
    storageBucket: "erguderzm-e0e93.appspot.com",
    messagingSenderId: "53669379620",
    appId: "1:53669379620:web:8f20c83148b58cb89be2b1",
    measurementId: "G-BS49JJYZJW"
}

firebase.initializeApp(firebaseConfig)

export const db=firebase.firestore()