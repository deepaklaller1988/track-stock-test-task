import admin from "firebase-admin";
import * as serviceAccount from './firebaseAdminKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),

});

const db = admin.firestore();
console.log(db,"db===");

export {admin,db};