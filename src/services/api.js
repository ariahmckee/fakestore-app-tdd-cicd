import axios from "axios";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const API = axios.create({
  baseURL: "https://fakestoreapi.com",
});

const PRODUCT_STORAGE_KEY = "local-products";
const USER_STORAGE_KEY = "local-users";
const ORDER_STORAGE_KEY = "local-orders";

const seedProducts = [
  {
    id: "seed-1",
    title: "Vintage Backpack",
    price: 79.99,
    description: "A rugged backpack for everyday carry.",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "seed-2",
    title: "Wireless Headphones",
    price: 129.5,
    description: "Immersive sound with noise-canceling support.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "seed-3",
    title: "Minimalist Sneakers",
    price: 89.0,
    description: "Lightweight sneakers made for all-day comfort.",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
  },
];

const isPermissionError = (error) => {
  const message = error?.message || "";
  return (
    error?.code === "permission-denied" ||
    message.toLowerCase().includes("permission") ||
    message.toLowerCase().includes("insufficient permissions")
  );
};

const readLocalProducts = () => {
  try {
    const stored = localStorage.getItem(PRODUCT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fall back to seeded catalog
  }

  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(seedProducts));
  return seedProducts;
};

const writeLocalProducts = (products) => {
  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
  return products;
};

const readLocalUsers = () => {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed && typeof parsed === "object" ? parsed : {};
    }
  } catch {
    // ignore
  }

  return {};
};

const writeLocalUsers = (users) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
  return users;
};

const getLocalUserProfile = (uid) => {
  const users = readLocalUsers();
  const profile = users[uid];

  if (!profile) {
    return { data: null };
  }

  return {
    data: {
      id: uid,
      ...(profile.profile || {}),
      email: profile.email,
    },
  };
};

const saveLocalUserProfile = (uid, profileData) => {
  const users = readLocalUsers();
  const current = users[uid] || {};

  users[uid] = {
    ...current,
    profile: {
      ...(current.profile || {}),
      ...profileData,
    },
    updatedAt: new Date().toISOString(),
  };

  writeLocalUsers(users);
  return { success: true };
};

const readLocalOrders = () => {
  try {
    const stored = localStorage.getItem(ORDER_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {
    // ignore
  }

  return [];
};

const writeLocalOrders = (orders) => {
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
  return orders;
};

const toProduct = (snapshot) => ({ id: snapshot.id, ...snapshot.data() });

export const getProducts = async () => {
  if (!db) {
    return { data: readLocalProducts() };
  }

  try {
    const snapshot = await getDocs(collection(db, "products"));
    const products = snapshot.docs.map(toProduct);
    return { data: products.length > 0 ? products : readLocalProducts() };
  } catch (error) {
    if (isPermissionError(error)) {
      return { data: readLocalProducts() };
    }
    throw error;
  }
};

export const getCategories = async () => {
  const response = await getProducts();
  const categories = [...new Set(response.data.map((product) => product.category))];
  return { data: categories.filter(Boolean) };
};

export const getProductsByCategory = async (category) => {
  if (!db) {
    return { data: readLocalProducts().filter((product) => product.category === category) };
  }

  try {
    const q = query(collection(db, "products"), where("category", "==", category));
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(toProduct);
    return {
      data: products.length > 0
        ? products
        : readLocalProducts().filter((product) => product.category === category),
    };
  } catch (error) {
    if (isPermissionError(error)) {
      return { data: readLocalProducts().filter((product) => product.category === category) };
    }
    throw error;
  }
};

export const getProduct = async (id) => {
  if (!db) {
    return { data: readLocalProducts().find((product) => product.id === id) || null };
  }

  try {
    const snapshot = await getDoc(doc(db, "products", id));
    return {
      data: snapshot.exists()
        ? toProduct(snapshot)
        : readLocalProducts().find((product) => product.id === id) || null,
    };
  } catch (error) {
    if (isPermissionError(error)) {
      return { data: readLocalProducts().find((product) => product.id === id) || null };
    }
    throw error;
  }
};

export const addProduct = async (data) => {
  const payload = {
    ...data,
    price: Number(data.price),
    image: data.image || "https://via.placeholder.com/300x300?text=Product",
    createdAt: new Date().toISOString(),
  };

  if (!db) {
    const created = { id: `local-${Date.now()}`, ...payload };
    const products = writeLocalProducts([...readLocalProducts(), created]);
    return { success: true, data: created, products };
  }

  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return { success: true, data: { id: docRef.id, ...payload } };
  } catch (error) {
    if (isPermissionError(error)) {
      const created = { id: `local-${Date.now()}`, ...payload };
      const products = writeLocalProducts([...readLocalProducts(), created]);
      return { success: true, data: created, products };
    }
    throw error;
  }
};

export const updateProduct = async (id, data) => {
  if (!db) {
    const products = readLocalProducts().map((product) => (product.id === id ? { ...product, ...data, price: Number(data.price) } : product));
    writeLocalProducts(products);
    return { success: true };
  }

  try {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, { ...data, price: Number(data.price) });
    return { success: true };
  } catch (error) {
    if (isPermissionError(error)) {
      const products = readLocalProducts().map((product) => (product.id === id ? { ...product, ...data, price: Number(data.price) } : product));
      writeLocalProducts(products);
      return { success: true };
    }
    throw error;
  }
};

export const deleteProduct = async (id) => {
  if (!db) {
    writeLocalProducts(readLocalProducts().filter((product) => product.id !== id));
    return { success: true };
  }

  try {
    await deleteDoc(doc(db, "products", id));
    return { success: true };
  } catch (error) {
    if (isPermissionError(error)) {
      writeLocalProducts(readLocalProducts().filter((product) => product.id !== id));
      return { success: true };
    }
    throw error;
  }
};

export const getUserProfile = async (uid) => {
  if (!db) {
    return getLocalUserProfile(uid);
  }

  try {
    const snapshot = await getDoc(doc(db, "users", uid));
    return { data: snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null };
  } catch (error) {
    if (isPermissionError(error)) {
      return getLocalUserProfile(uid);
    }
    throw error;
  }
};

export const saveUserProfile = async (uid, profileData) => {
  if (!db) {
    return saveLocalUserProfile(uid, profileData);
  }

  try {
    await setDoc(doc(db, "users", uid), { ...profileData, updatedAt: serverTimestamp() }, { merge: true });
    return { success: true };
  } catch (error) {
    if (isPermissionError(error)) {
      return saveLocalUserProfile(uid, profileData);
    }
    throw error;
  }
};

export const createOrder = async (uid, orderData) => {
  if (!uid) {
    return { success: false, error: "Please sign in to place an order." };
  }

  const payload = {
    userId: uid,
    items: orderData.items || [],
    total: Number(orderData.total || 0),
    totalProducts: Number(orderData.totalProducts || 0),
    customerName: orderData.customerName || "",
    customerEmail: orderData.customerEmail || "",
    status: "placed",
    createdAt: new Date().toISOString(),
  };

  if (!db) {
    const orders = writeLocalOrders([...readLocalOrders(), { id: `local-order-${Date.now()}`, ...payload }]);
    return { success: true, data: orders[orders.length - 1] };
  }

  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return { success: true, data: { id: docRef.id, ...payload } };
  } catch (error) {
    if (isPermissionError(error)) {
      const orders = writeLocalOrders([...readLocalOrders(), { id: `local-order-${Date.now()}`, ...payload }]);
      return { success: true, data: orders[orders.length - 1] };
    }
    throw error;
  }
};

export const getOrdersByUser = async (uid) => {
  if (!uid) {
    return { data: [] };
  }

  if (!db) {
    return { data: readLocalOrders().filter((order) => order.userId === uid) };
  }

  try {
    const q = query(collection(db, "orders"), where("userId", "==", uid));
    const snapshot = await getDocs(q);

    const data = snapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

    return { data };
  } catch (error) {
    if (isPermissionError(error)) {
      return { data: readLocalOrders().filter((order) => order.userId === uid) };
    }
    throw error;
  }
};
