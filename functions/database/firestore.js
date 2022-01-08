const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config({path: path.join(__dirname, "../.env")});

// local: Add environment variable to .env file
const serviceAccount = JSON.parse(Buffer.from(
    process.env.FIREBASE_SERVICE_ACCOUNT_CONVERTED, "base64").toString("ascii"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
