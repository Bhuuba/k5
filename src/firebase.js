import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDBXHrKbgQPcP-f8AJaZSVYIQ3v7Jw2tVQ",
  authDomain: "auth-dc43a.firebaseapp.com",
  projectId: "auth-dc43a",
  storageBucket: "auth-dc43a.firebasestorage.app",
  messagingSenderId: "1041672064480",
  appId: "1:1041672064480:web:9c6163c387d04e6242af85",
  measurementId: "G-3VGS8XQ6YV",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Firebase persistence enabled"))
  .catch((error) => console.error("Firebase persistence error:", error));

export { auth, storage };
