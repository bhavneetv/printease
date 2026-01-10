import admin from "firebase-admin";
import { createRequire } from "module"; // 1. Import createRequire
import fs from 'fs';
console.log("Files in this folder:", fs.readdirSync("."));

const require = createRequire(import.meta.url); // 2. Create a require function
const serviceAccount = require("./firebase-service-account.json"); // 3. Load JSON normally

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;