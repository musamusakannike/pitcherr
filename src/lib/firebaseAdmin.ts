import * as admin from "firebase-admin";

function getFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    });
  }

  // Fallback: application default credentials (works on GCP/Firebase hosting)
  return admin.initializeApp({
    projectId,
  });
}

export const firebaseAdmin = getFirebaseAdmin();
