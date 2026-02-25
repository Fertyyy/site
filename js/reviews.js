import { db } from './firebase.js';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const COLLECTION_NAME = 'reviews';

export async function getReviews() {
    if (!db) return [];
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.error("Error getting reviews:", e);
        return [];
    }
}

export async function addReview(userId, userName, text, rating) {
    if (!db) throw new Error("Firebase not configured");
    const review = {
        userId,
        userName: userName || 'Пользователь',
        text,
        rating: Number(rating),
        createdAt: new Date()
    };
    return await addDoc(collection(db, COLLECTION_NAME), review);
}

export async function deleteReview(id) {
    if (!db) throw new Error("Firebase not configured");
    return await deleteDoc(doc(db, COLLECTION_NAME, id));
}
