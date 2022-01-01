const admin = require("firebase-admin");
// const path = require("path");
// require("dotenv").config({path: path.join(__dirname, "../.env")});

// Update the credentials path
// const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

admin.initializeApp({
  // credential: admin.credential.cert(serviceAccount),
});

// const serviceAccount =
// require("../credentials/karrot-hq-firebase-adminsdk-shct8-45d7754fc1.json");
// const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
// adminConfig.credential = admin.credential.cert(serviceAccount);
// admin.initializeApp(adminConfig);

const db = admin.firestore();

module.exports = db;
