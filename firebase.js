import firebase from "firebase/app"
import "firebase/firebase-firestore.memory"

const firebaseConfig = {

}

firebase.initializeApp(firebaseConfig)

export const db=firebase.firestore()
