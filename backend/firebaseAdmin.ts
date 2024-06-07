import admin from "firebase-admin";
import serviceAccount from "./firebaseServiceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export { admin };
