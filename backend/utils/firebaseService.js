import admin from "../config/firebase.js";

export const sendAdminNotification = async (title, body) => {
  try {
    const message = {
      notification: { title, body },
      topic: "admins", // all admins subscribed to this topic will get it
    };

    const response = await admin.messaging().send(message);
    console.log("✅ Firebase notification sent:", response);
    return response;
  } catch (error) {
    console.error("❌ Firebase notification error:", error);
    throw error;
  }
};
