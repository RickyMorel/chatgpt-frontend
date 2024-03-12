import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyB_GeaQ091OEgoi3pQURwpLNBB1r0JJMyc",
    authDomain: "fir-test-f2f77.firebaseapp.com",
    databaseURL: "https://fir-test-f2f77.firebaseio.com",
    projectId: "fir-test-f2f77",
    storageBucket: "fir-test-f2f77.appspot.com",
    messagingSenderId: "1052201920246",
    appId: "1:1052201920246:web:31dd35d7e1d16ec7beeed7",
    measurementId: "G-9CVWYCRLQQ"
  };

  firebase.initializeApp(firebaseConfig)
  const firestore = firebase.firestore()

  export default firestore