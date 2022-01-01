const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config({path: path.join(__dirname, "../.env")});

// Update the credentials path
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
