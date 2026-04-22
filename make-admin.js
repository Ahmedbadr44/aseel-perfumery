const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const fs = require('fs');
const path = require('path');

function getServiceAccount() {
  // Strategy 1: JSON string from env
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountJson) {
    try {
      const cleanedJson = serviceAccountJson.trim().replace(/^['"]|['"]$/g, "");
      return JSON.parse(cleanedJson);
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY from env");
    }
  }

  // Strategy 2: File path from env
  const pathFromEnv = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (pathFromEnv) {
    const absolutePath = path.resolve(pathFromEnv);
    return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  }

  throw new Error('Set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_SERVICE_ACCOUNT_PATH in your .env file.');
}

initializeApp({
  credential: cert(getServiceAccount())
});

const db = getFirestore();
const auth = getAuth();

async function makeAdmin(email) {
  try {
    // Find user by email
    const user = await auth.getUserByEmail(email);
    console.log('Found user:', user.email, user.uid);
    
    // Update user in Firestore
    await db.collection('users').doc(user.uid).set({
      email: email,
      is_admin: true,
      display_name: user.displayName || 'Admin',
      created_at: new Date()
    }, { merge: true });
    
    console.log('✅ Made', email, 'an admin!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

const email = process.argv[2] || 'ahmedbadr004500@gmail.com';
makeAdmin(email);
