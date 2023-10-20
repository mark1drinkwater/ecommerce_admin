// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtkaIhYJODcW9c-fK2wpiNvxcVq1CDbuU",
  authDomain: "shop-5c6db.firebaseapp.com",
  projectId: "shop-5c6db",
  storageBucket: "shop-5c6db.appspot.com",
  messagingSenderId: "572871806695",
  appId: "1:572871806695:web:b03a1282c6be940e079c42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;