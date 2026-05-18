import { db } from './firebase';
import { doc, setDoc, getDoc, collection, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

export const getStoredUsers = async () => {
  if (!db) return [];
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const saveUser = async (user) => {
  if (!db) return null;
  try {
    const userRef = doc(db, 'users', user.uid);
    const existingDoc = await getDoc(userRef);
    const existingData = existingDoc.exists() ? existingDoc.data() : {};
    
    // Convert serverTimestamp to a Date string for local sorting fallback if needed, but Firestore Timestamp is better.
    // For simplicity, we use ISO strings so it's compatible with the old logic.
    const now = new Date().toISOString();
    
    const updatedUser = {
      ...existingData,
      ...user,
      timestamp: existingData.timestamp || now,
      lastUpdated: now
    };
    
    await setDoc(userRef, updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("Error saving user:", error);
    return null;
  }
};

export const getUser = async (uid) => {
  if (!db) return null;
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const hasPlayed = async (uid) => {
  const user = await getUser(uid);
  return user && user.alreadyPlayed === true;
};

export const isPhoneUsedByAnotherUser = async (uid, phone) => {
  if (!db) return false;
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('phone', '==', phone));
    const querySnapshot = await getDocs(q);
    
    let isUsed = false;
    querySnapshot.forEach((docSnap) => {
      // If we found the phone number under a different uid, it's a duplicate
      if (docSnap.id !== uid) {
        isUsed = true;
      }
    });
    return isUsed;
  } catch (error) {
    console.error("Error checking phone usage:", error);
    return false;
  }
};

// Rewards logic
const rewards = [
  { label: "10% OFF", value: "10%", type: "discount", weight: 30, discount: 0.1 },
  { label: "20% OFF", value: "20%", type: "discount", weight: 25, discount: 0.2 },
  { label: "30% OFF", value: "30%", type: "discount", weight: 15, discount: 0.3 },
  { label: "40% OFF", value: "40%", type: "discount", weight: 10, discount: 0.4 },
  { label: "50% OFF", value: "50%", type: "discount", weight: 5, discount: 0.5 },
  { label: "3 Months Free", value: "3_months_free", type: "special", weight: 5 },
  { label: "Better Luck Next Time", value: "none", type: "none", weight: 10 },
];

export const generateReward = () => {
  const totalWeight = rewards.reduce((sum, reward) => sum + reward.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const reward of rewards) {
    if (random < reward.weight) {
      return reward;
    }
    random -= reward.weight;
  }
  
  return rewards[0];
};

export const calculateFees = (reward) => {
  const originalAdmission = 1200; // New admission fee as per requirements
  const originalMonthly = 500;
  
  if (reward.type === "discount") {
    const newAdmission = originalAdmission * (1 - reward.discount);
    // Discount ONLY applies to admission fee. Monthly fee remains the same.
    return {
      admission: newAdmission,
      monthly: originalMonthly,
      savings: originalAdmission - newAdmission, 
      originalAdmission,
      originalMonthly
    };
  } else if (reward.type === "special" && reward.value === "3_months_free") {
    return {
      admission: 0, // Admission fee is waived completely
      monthly: 0,   // First 3 months are free
      monthlyFreeMonths: 3,
      savings: originalAdmission + (originalMonthly * 3),
      originalAdmission,
      originalMonthly
    };
  } else {
    // None
    return {
      admission: originalAdmission,
      monthly: originalMonthly,
      savings: 0,
      originalAdmission,
      originalMonthly
    };
  }
};
