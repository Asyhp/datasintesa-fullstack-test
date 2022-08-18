import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyA9sV6JRQvaN7gEfKrJ9guoHWlaz35vJWA",
    authDomain: "testing-e5e3f.firebaseapp.com",
    projectId: "testing-e5e3f",
    storageBucket: "testing-e5e3f.appspot.com",
    messagingSenderId: "991118253566",
    appId: "1:991118253566:web:3ce5662396ba3c3405f4af"
  };

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  export {app, storage}