// controllers/authController.ts
import admin from "../../config/adminConfig";
import  bcrypt from 'bcrypt';
const saltRounds = 10;

const signup = async (req: any, res: any) => {
  const { email, password, username } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userRecord: any = await admin.auth().createUser({
      email,
      password: hashedPassword, 
    });

    await admin.firestore().collection("users").doc(userRecord.uid).set({
      email: userRecord.email,
      username,
      password: hashedPassword 
    });

    return res.status(201).json({ message: "User created", uid: userRecord.uid });
  } catch (error: any) {
    console.error("Error signing up:", error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: "Email already exists" });
    } else {
      return res.status(500).json({ error: "Signup failed" });
    }
  }
};

const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    const userDoc = await admin.firestore().collection('users').doc(userRecord.uid).get();
    const storedHashedPassword = userDoc.data()?.password;

    const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Password Incorrect" });
    }

    return res.status(200).json({ message: "Login successful", uid: userRecord.uid });
  } catch (error: any) {
    console.error("Error logging in:", error);
    if (error.code === "auth/user-not-found") {
      return res.status(404).json({ error: "Email not found" });
    } else {
      return res.status(500).json({ error: "Login failed" });
    }
  }
};


export { signup, login };
