const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const fs = require('fs');
const path = require('path');

function getServiceAccount() {
  const accountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (accountKey) {
    try {
      return JSON.parse(accountKey);
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY from environment');
    }
  }

  const pathFromEnv = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!pathFromEnv) {
    throw new Error('Set FIREBASE_SERVICE_ACCOUNT_KEY (JSON string) or FIREBASE_SERVICE_ACCOUNT_PATH (JSON file path) in environment.');
  }
  const absolutePath = path.resolve(pathFromEnv);
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
}

initializeApp({
  credential: cert(getServiceAccount())
});

const db = getFirestore();
const auth = getAuth();

async function createAdmin() {
  const email = 'ahmedbadr004500@gmail.com';
  const password = '1882001';
  let userRecord;

  try {
    userRecord = await auth.getUserByEmail(email);
    console.log('User already exists. Updating password...', userRecord.uid);
    await auth.updateUser(userRecord.uid, { password });
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.log('User not found. Creating user...');
      userRecord = await auth.createUser({
        email,
        password,
        displayName: 'Admin'
      });
      console.log('Successfully created new user:', userRecord.uid);
    } else {
      throw error;
    }
  }

  // Set admin claim
  await auth.setCustomUserClaims(userRecord.uid, { admin: true });
  console.log('Set admin claim for user');

  // Update in Firestore
  await db.collection('users').doc(userRecord.uid).set({
    email,
    is_admin: true,
    display_name: 'Ahmed Badr (Admin)',
    created_at: new Date()
  }, { merge: true });
  console.log('✅ Updated Firestore users collection for Admin');
}

createAdmin().catch(console.error).finally(() => process.exit(0));
