import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();

// Optional secret key for access control
const AUTH_KEY = "my-secret-key"; // Change this to your own secret

/**
 * HTTP function that resets `daily_trip_count` to 0 for all documents
 * in the `scanned_qrs` collection. Can be triggered from a scheduler.
 */
export const resetDailyTripCount = functions.https.onRequest(async (req, res) => {
  // Optional: Require a secret key to access this endpoint
  const requestKey = req.query.key;
  if (requestKey !== AUTH_KEY) {
    return res.status(403).send("Unauthorized: Invalid or missing key.");
  }

  const db = admin.firestore();
  const scannedQrsRef = db.collection("scanned_qrs");

  try {
    const snapshot = await scannedQrsRef.get();
    const batch = db.batch();

    snapshot.forEach((doc) => {
      batch.update(doc.ref, {daily_trip_count: 0});
    });

    await batch.commit();
    const message = `Successfully reset daily_trip_count for ${snapshot.size} documents.`;
    console.log(message);
    return res.status(200).send(message);
  } catch (error) {
    console.error("Error resetting daily trip counts:", error);
    return res.status(500).send("Failed to reset daily trip counts.");
  }
});
