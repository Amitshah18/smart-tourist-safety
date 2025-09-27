import SOS from "../models/SOS.js";
import User from "../models/User.js";
import { notifyAdmin, notifyFamily } from "../utils/notificationService.js";
import { sendSMS } from "../utils/smsService.js";
import { checkZoneSafety } from "../utils/locationService.js";
import { sendAdminNotification } from "../utils/firebaseService.js";

export const triggerSOS = async (req, res) => {
  try {
    const { userId, location } = req.body;

    // Save SOS request
    const sos = await SOS.create({
      user: userId,
      location,
      contactsNotified: [],
    });

    // Fetch user & emergency contacts
    const user = await User.findById(userId);
    const contacts = user?.emergencyContacts || [];

    const smsMessage = `🚨 SOS Alert from ${user?.name || "User"}! Location: https://maps.google.com/?q=${location.lat},${location.lng}`;

    // ------------------------------
    // 🔹 Step 1: Notify Admin
    // ------------------------------
    try {
      await sendAdminNotification("SOS Triggered!", `Location: ${location.lat}, ${location.lng}`);
      await notifyAdmin("SOS Triggered!", location);
    } catch (err) {
      console.log("⚠️ Firebase notification failed, sending SMS fallback to Admin...");
      const adminNumber = user?.adminNumber || "6299486245"; // replace with real admin no.
      await sendSMS(adminNumber, smsMessage);
    }

    // ------------------------------
    // 🔹 Step 2: Notify Family (SMS always)
    // ------------------------------
    await notifyFamily(userId, "SOS Alert! Check immediately.", location);

    for (let contact of contacts) {
      await sendSMS(contact, smsMessage);
    }

    // ------------------------------
    // 🔹 Step 3: Safety Zone Check
    // ------------------------------
    const zoneStatus = checkZoneSafety(location);

    res.status(200).json({
      success: true,
      message: "✅ SOS triggered successfully",
      zoneStatus,
      sos,
    });
  } catch (error) {
    console.error("❌ SOS Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to trigger SOS",
      error: error.message,
    });
  }
};
