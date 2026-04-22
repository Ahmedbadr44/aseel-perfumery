import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let adminApp: App | null = null;

function getServiceAccount() {
  // Strategy 1: Individual env vars (most reliable for Vercel)
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (clientEmail && privateKey && projectId) {
    return {
      projectId,
      clientEmail,
      privateKey: privateKey.trim().replace(/^["']|["']$/g, "").replace(/\\n/g, "\n"),
    };
  }

  // Strategy 2: Single JSON env var (legacy / local dev)
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) {
    throw new Error(
      "Missing Firebase service account credentials. " +
        "Set FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY + FIREBASE_PROJECT_ID, " +
        "or set FIREBASE_SERVICE_ACCOUNT_KEY as a JSON string."
    );
  }

  try {
    const cleanedJson = serviceAccountJson.trim().replace(/^['"]|['"]$/g, "");
    const parsed = JSON.parse(cleanedJson) as {
      project_id: string;
      client_email: string;
      private_key: string;
    };

    return {
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key.replace(/\\n/g, "\n"),
    };
  } catch (parseError) {
    console.error(
      "❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:",
      parseError
    );
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON. " +
        "Consider using individual env vars instead: " +
        "FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID"
    );
  }
}

function getAdminApp() {
  if (adminApp) return adminApp;
  if (getApps().length) {
    adminApp = getApps()[0]!;
    return adminApp;
  }

  const serviceAccount = getServiceAccount();
  adminApp = initializeApp({
    credential: cert(serviceAccount),
  });
  return adminApp;
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}
