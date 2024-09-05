import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDtaB8k2axO5TytP6gVYz5DbVdIbWEY5Sk",
  authDomain: "shopweb-d385c.firebaseapp.com",
  projectId: "shopweb-d385c",
  storageBucket: "shopweb-d385c.appspot.com",
  messagingSenderId: "379710793558",
  appId: "1:379710793558:web:f23e0564afd236ec2ed8f7",
  measurementId: "G-TNQX1VZBFK",
};

// Initialize Firebase
const firebaseAppConfig = initializeApp(firebaseConfig);
export default firebaseAppConfig;
