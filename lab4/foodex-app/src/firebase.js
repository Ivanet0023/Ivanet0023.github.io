import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBaZOMqpJknfqgsKS_4oDqHLd4fqe0bHz0",
    authDomain: "fooodex-app.firebaseapp.com",
    projectId: "fooodex-app",
    storageBucket: "fooodex-app.firebasestorage.app",
    messagingSenderId: "525877916145",
    appId: "1:525877916145:web:3d61e3b19634693104d450",
    measurementId: "G-HD6CBF7EFS"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);