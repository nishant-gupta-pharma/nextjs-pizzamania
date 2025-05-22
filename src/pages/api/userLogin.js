import Users from "@/models/Users";
import db from "@/utils/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const jwtSecret = "$2a$10$Q8rs45.";
export default async function handler(req, res) {
  let success = false;
  if (req.method === "POST") {
    await db.connect();

    const { email, password } = req.body;
    try {
      let user = await Users.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Try logging in with correct credentials!" });
      }
      const pwdCompare = await bcrypt.compare(password, user.password);
      if (!pwdCompare) {
        return res
          .status(400)
          .json({ success, error: "Try logging in with correct credentials!" });
      }

      const data = {
        user: {
          id: user["_id"],
        },
      };

      const authToken = jwt.sign(data, jwtSecret);
      const isAdmin = await user.isAdmin;
      success = true;
      res.json({
        success: success,
        authToken: authToken,
        isAdmin: isAdmin,
        name: user.name,
      });
    } catch (error) {
      console.error("Login error:", error.message);
      res.status(500).json({ success, error: "Server error" });
    }
  } else {
    res.status(405).json({ success, error: "Method not allowed" });
  }
}
