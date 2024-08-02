const admin = require("firebase-admin");
const serviceAccount = require("../secure/modern-farm-b5254-firebase-adminsdk-7lbjz-a12574732d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
