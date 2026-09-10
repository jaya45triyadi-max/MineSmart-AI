import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Safe fallback config
const defaultFirebaseConfig = {
  apiKey: "AIzaSyDemoConfigForMineSmartAIAppletKey",
  authDomain: "mine-smart-ai.firebaseapp.com",
  projectId: "mine-smart-ai",
  storageBucket: "mine-smart-ai.appspot.com",
  messagingSenderId: "744412228963",
  appId: "1:744412228963:web:minesmartai",
  firestoreDatabaseId: "(default)",
};

let appletConfig = defaultFirebaseConfig;

try {
  // Dynamically import or check config if injected
  const importedConfig = (window as any).__FIREBASE_CONFIG__;
  if (importedConfig) {
    appletConfig = importedConfig;
  }
} catch (e) {
  console.warn("Using default Firebase config for initial boot.");
}

const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(appletConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp, appletConfig.firestoreDatabaseId || "(default)");

export default firebaseApp;
