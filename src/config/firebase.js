import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

console.log("Initializing Firebase with config:", {
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
});

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

console.log("Firebase app initialized");

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase persistence enabled successfully");
    const currentUser = auth.currentUser;
    console.log(
      "Current user after persistence setup:",
      currentUser
        ? {
            email: currentUser.email,
            uid: currentUser.uid,
          }
        : "No user"
    );
  })
  .catch((error) => {
    console.error("Firebase persistence error:", {
      code: error.code,
      message: error.message,
    });
  });

export { auth, storage };
