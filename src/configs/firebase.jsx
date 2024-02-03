import firebase from "firebase/compat";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCeGLMzwzCl3BXAc2uX5NtNiX-y3wBt4sc",
  authDomain: "flexhunt-3f1d2.firebaseapp.com",
  projectId: "flexhunt-3f1d2",
  storageBucket: "flexhunt-3f1d2.appspot.com",
  messagingSenderId: "611312032024",
  appId: "1:611312032024:web:7573f026a876d69b5e666d"
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = app.auth();

export { db, auth };
