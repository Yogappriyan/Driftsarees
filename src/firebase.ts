import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';
import { Product, AtelierOrder } from './types';
import { PRODUCTS, INITIAL_ORDERS } from './data/products';
import { normalizeImageUrl } from './utils/imageFallback';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with configured databaseId
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Auth & Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Persist user record to Firestore under `users/{uid}`
  if (user) {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          displayName: user.displayName || 'Maison Patron',
          email: user.email || '',
          photoURL: user.photoURL || '',
          lastLoginAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('[Firebase] Could not sync user record:', err);
    }
  }

  return user;
}

/**
 * Sign out current user
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribe to Auth State changes in Realtime
 */
export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Subscribe to Products collection in Realtime from Firestore
 * Automatically seeds the curated catalog if the database is initially empty.
 */
export function subscribeToProducts(
  callback: (products: Product[]) => void,
  onError?: (err: Error) => void
) {
  const productsCol = collection(db, 'products');

  return onSnapshot(
    productsCol,
    async (snapshot) => {
      if (snapshot.empty) {
        console.log('[Firestore] Products collection empty. Auto-seeding initial catalog...');
        try {
          await seedInitialProducts();
        } catch (err) {
          console.warn('[Firestore] Error during initial product seed:', err);
        }
        return;
      }

      const prods: Product[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Product;
        prods.push({
          ...data,
          id: docSnap.id,
          primaryImage: normalizeImageUrl(data.primaryImage),
          secondaryImage: normalizeImageUrl(data.secondaryImage || data.primaryImage),
          altLooks: (data.altLooks || []).map((look) => ({
            ...look,
            image: normalizeImageUrl(look.image),
          })),
        });
      });

      // Sort by rating or id to keep stable luxurious presentation
      prods.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      callback(prods);
    },
    (err) => {
      console.error('[Firestore] Products subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Seed initial catalog into Firestore
 */
export async function seedInitialProducts() {
  const productsCol = collection(db, 'products');
  for (const prod of PRODUCTS) {
    const docRef = doc(productsCol, prod.id);
    await setDoc(docRef, {
      ...prod,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

/**
 * Subscribe to Orders collection in Realtime from Firestore
 */
export function subscribeToOrders(
  callback: (orders: AtelierOrder[]) => void,
  onError?: (err: Error) => void
) {
  const ordersCol = collection(db, 'orders');

  return onSnapshot(
    ordersCol,
    async (snapshot) => {
      if (snapshot.empty) {
        console.log('[Firestore] Orders collection empty. Seeding initial atelier orders...');
        try {
          await seedInitialOrders();
        } catch (err) {
          console.warn('[Firestore] Error during initial order seed:', err);
        }
        return;
      }

      const ords: AtelierOrder[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        ords.push({
          ...(data as AtelierOrder),
          id: docSnap.id,
        });
      });

      // Sort by date newest first
      ords.sort((a, b) => new Date(b.date || b.createdAt || 0).getTime() - new Date(a.date || a.createdAt || 0).getTime());
      callback(ords);
    },
    (err) => {
      console.error('[Firestore] Orders subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Seed initial orders for atelier showcase
 */
export async function seedInitialOrders() {
  const ordersCol = collection(db, 'orders');
  for (const ord of INITIAL_ORDERS) {
    const docRef = doc(ordersCol, ord.id);
    await setDoc(docRef, {
      ...ord,
      updatedAt: serverTimestamp(),
    });
  }
}

/**
 * Add a new product to Firestore
 */
export async function addProductToFirestore(product: Product): Promise<string> {
  const productsCol = collection(db, 'products');
  const docRef = product.id ? doc(productsCol, product.id) : doc(productsCol);
  const productId = docRef.id;

  await setDoc(docRef, {
    ...product,
    id: productId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return productId;
}

/**
 * Update an existing product in Firestore
 */
export async function updateProductInFirestore(product: Product): Promise<void> {
  const docRef = doc(db, 'products', product.id);
  await updateDoc(docRef, {
    ...product,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a product from Firestore
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const docRef = doc(db, 'products', productId);
  await deleteDoc(docRef);
}

/**
 * Toggle product flags (bestseller, isNew) in Firestore
 */
export async function toggleProductFlagInFirestore(
  productId: string,
  field: 'isBestseller' | 'isNew',
  currentVal: boolean
): Promise<void> {
  const docRef = doc(db, 'products', productId);
  await updateDoc(docRef, {
    [field]: !currentVal,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Save a new order to Firestore
 */
export async function saveOrderToFirestore(order: AtelierOrder): Promise<void> {
  const docRef = doc(db, 'orders', order.id);
  await setDoc(docRef, {
    ...order,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update order status in Firestore (e.g. In Loom -> QC Hallmark -> Dispatched)
 */
export async function updateOrderStatusInFirestore(
  orderId: string,
  status: AtelierOrder['status']
): Promise<void> {
  const docRef = doc(db, 'orders', orderId);
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}
