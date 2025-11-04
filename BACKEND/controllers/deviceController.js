import User from "../models/User.js";

// Controller to get all user emails - requires API key for security
export const getUserEmails = async (req, res) => {
  try {
    // Verify API key from request header
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || apiKey !== process.env.DEVICE_API_KEY) {
      return res.status(401).json({ message: "Unauthorized: Invalid API key" });
    }

    // Get email for a specific empId if provided
    const { empId } = req.query;
    if (empId) {
      const user = await User.findOne({ empId }, "email");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({ email: user.email });
    }

    // Otherwise return all user emails
    const users = await User.find({}, "email");
    const emails = users.map(user => user.email);
    res.json({ emails });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};