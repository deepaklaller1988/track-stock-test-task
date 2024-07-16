// adminconfig.ts
import admin from "firebase-admin";
import ServiceAccount from "./firebaseAdminKey.json";
admin.initializeApp({
  credential: admin.credential.cert(ServiceAccount),
});

export default admin;