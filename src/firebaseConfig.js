import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD2Q6G3joQ15SMED35sJ--Yr4QiXc4LRko",
    authDomain: "whatsbot-e670a.firebaseapp.com",
    projectId: "whatsbot-e670a",
    storageBucket: "whatsbot-e670a.firebasestorage.app",
    messagingSenderId: "78686841353",
    appId: "1:78686841353:web:40e27ae280d071f446e6d8",
    measurementId: "G-775330VX1Z"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig)

const firestore = firebase.firestore()

const storage = getStorage(firebaseApp);

export { firestore, storage };