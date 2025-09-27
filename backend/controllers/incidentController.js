import Incident from "../models/Incident.js";

export const getIncidents = async (req, res) => {
  const incidents = await Incident.find().sort({ reportedAt: -1 });
  res.json(incidents);
};

export const reportIncident = async (req, res) => {
  try {
    const { type, location, description } = req.body;
    const incident = await Incident.create({ type, location, description });
    res.status(201).json(incident);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
