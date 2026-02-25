import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
import { firebaseConfig } from '../firebase-config.js';

let app, db, auth, storage;

try {
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        storage = getStorage(app);
    } else {
        console.warn("Firebase is not configured. Please update firebase-config.js");
    }
} catch (error) {
    console.error("Error initializing Firebase:", error);
}

export { app, db, auth, storage };
