export const notifyAdmin = async (message, location) => {
  console.log("📢 Admin notified:", message, "Location:", location);
  return true;
};

export const notifyFamily = async (userId, message, location) => {
  console.log(`📢 Family of user ${userId} notified:`, message, "Location:", location);
  return true;
};