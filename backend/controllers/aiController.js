export const askAI = async (req, res) => {
  const { question } = req.body;
  // For now, return dummy response
  res.json({ reply: `AI Assistant Response to: ${question}` });
};
