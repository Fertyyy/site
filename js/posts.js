import { db } from './firebase.js';
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, where, increment } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const COLLECTION_NAME = 'posts';

export async function getPosts(limitCount = 10, tag = null, searchQuery = '') {
    if (!db) return [];
    try {
        let q = collection(db, COLLECTION_NAME);
        let constraints = [orderBy('createdAt', 'desc')];
        
        if (tag) {
            constraints.push(where('tags', 'array-contains', tag));
        }
        if (limitCount) {
            constraints.push(limit(limitCount));
        }
        
        q = query(q, ...constraints);
        const snapshot = await getDocs(q);
        let posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            posts = posts.filter(p => 
                p.title.toLowerCase().includes(lowerQuery) || 
                p.content.toLowerCase().includes(lowerQuery)
            );
        }
        
        return posts;
    } catch (e) {
        console.error("Error getting posts:", e);
        return [];
    }
}

export async function getPost(id) {
    if (!db) return null;
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (e) {
        console.error("Error getting post:", e);
        return null;
    }
}

export async function incrementViews(id) {
    if (!db) return;
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            views: increment(1)
        });
    } catch (e) {
        console.error("Error incrementing views:", e);
    }
}

export async function toggleLike(id, userId) {
    if (!db) return false;
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const likes = data.likes || [];
            const hasLiked = likes.includes(userId);
            
            if (hasLiked) {
                await updateDoc(docRef, { likes: likes.filter(uid => uid !== userId) });
                return false;
            } else {
                await updateDoc(docRef, { likes: [...likes, userId] });
                return true;
            }
        }
    } catch (e) {
        console.error("Error toggling like:", e);
    }
    return false;
}

export async function createPost(postData) {
    if (!db) throw new Error("Firebase not configured");
    postData.createdAt = new Date();
    postData.views = 0;
    postData.likes = [];
    return await addDoc(collection(db, COLLECTION_NAME), postData);
}

export async function updatePost(id, postData) {
    if (!db) throw new Error("Firebase not configured");
    postData.updatedAt = new Date();
    const docRef = doc(db, COLLECTION_NAME, id);
    return await updateDoc(docRef, postData);
}

export async function deletePost(id) {
    if (!db) throw new Error("Firebase not configured");
    const docRef = doc(db, COLLECTION_NAME, id);
    return await deleteDoc(docRef);
}
