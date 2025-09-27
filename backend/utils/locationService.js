export const checkZoneSafety = (location) => {
  // Demo logic: If lat/lng is odd → risk zone, even → safe zone
  if (Math.floor(location.lat) % 2 === 0) {
    return "Safe Zone";
  }
  return "Risk Zone";
};
