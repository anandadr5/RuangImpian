import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDuJ3l7es1WjV0TZwmNkKyIOYFk7han4NI",
  authDomain: "furniture-ecommerce-9c482.firebaseapp.com",
  projectId: "furniture-ecommerce-9c482",
  storageBucket: "furniture-ecommerce-9c482.appspot.com",
  messagingSenderId: "274204905955",
  appId: "1:274204905955:web:cb42a00afc4559438e90d6",
  measurementId: "G-43QEGN2ZPT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

export default app;
