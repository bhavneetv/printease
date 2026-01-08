import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDhzCf4vNgVYsyLSJqpKy1MQA75TkR8HxI",
  authDomain: "unicart-35704.firebaseapp.com",
  projectId: "unicart-35704",
  storageBucket: "unicart-35704.firebasestorage.app",
  messagingSenderId: "648353652276",
  appId: "1:648353652276:web:f0388a7f2932069208f461",
  measurementId: "G-D3PZVMH4T8"
};

// 👇 ADD "export" HERE
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BL_Z4ITImhLa2zIAe8spJowdwoSZHxbG566eEK4jfVjmwtnoDs4wtbSDZkYvNN_rlsAcUyZAAs5SuBICXXzCai4"
      });
      return token;
    } else {
      console.log("Permission denied");
      return null;
    }
  } catch (error) {
    console.log("Error getting token", error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });