// controllers/authController.ts
import admin from "../../config/adminConfig"

const signup = async (req: any, res: any) => {
  const { email, password, username } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    await admin.firestore().collection("users").doc(userRecord.uid).set({
      email: userRecord.email,
      username: username,
    });

    return res
      .status(201)
      .json({ message: "User created", uid: userRecord.uid });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Error creating user" });
  }
};

const login = async (req: any, res: any) => {
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

export { signup, login };
