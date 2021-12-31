const admin = require("firebase-admin");

const serviceAccount =
  require("../credentials/karrot-hq-firebase-adminsdk-shct8-45d7754fc1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
