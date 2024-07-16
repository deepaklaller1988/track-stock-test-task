import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC2Fn_DrETK5baP7lbuql2XBdQRAt6n-4g",
  authDomain: "track-stock-f99e2.firebaseapp.com",
  projectId: "track-stock-f99e2",
  storageBucket: "track-stock-f99e2.appspot.com",
  messagingSenderId: "402558066639",
  appId: "1:402558066639:web:21a064ba961031d0343cba",
  measurementId: "G-BG5N4XGN6J"
};

const app = initializeApp(firebaseConfig);
 export {app}