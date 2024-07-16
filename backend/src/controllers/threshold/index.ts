// controllers/authController.ts
import {admin} from "../../config/adminConfig"

const createThreshold = async (req: any, res: any) => {
    const { id, stock, price, symbol } = req.body;
  
    try {
      const userRecord = await admin.auth().getUser(id);
  
      await admin.firestore().collection("users").doc(userRecord.uid).set({
        email: userRecord.email,
        username: userRecord.displayName || "Unknown",
        stockName: symbol,
        price: price,
        symbol: stock,
      }, { merge: true }); // Use merge to update existing document instead of overwriting
  
      return res.status(201).json({ message: "User updated with threshold", uid: userRecord.uid });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ error: "Error updating user" });
    }
  };
  
const getThreshold = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    return res
      .status(200)
      .json({ message: "Login successful", uid: userRecord.uid });
  } catch (error: any) {
    console.error("Error logging in:", error);
    if (error.code === "auth/user-not-found") {
      return res.status(404).json({ error: "Email not found" });
    } else if (error.code === "auth/wrong-password") {
      return res.status(401).json({ error: "Password incorrect" });
    } else {
      return res.status(500).json({ error: "Login failed" });
    }
  }
};

export { createThreshold,getThreshold };
