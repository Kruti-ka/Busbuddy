// src/index.ts
import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { logger } from "firebase-functions";

// Initialize Firebase admin
admin.initializeApp();

/**
 * Interface for system log entry
 */
interface SystemLog {
  operation: string;
  timestamp: admin.firestore.FieldValue;
  documentsProcessed: number;
  batchesUsed: number;
  status: 'success' | 'error';
  errorMessage?: string;
  errorStack?: string;
}

/**
 * Cloud Function that resets the daily_trip_count to 0 for all documents
 * in the scanned_qrs collection at midnight every day.
 */
export const resetDailyTripCount = functions.pubsub
  .schedule("0 0 * * *") // Runs at midnight (00:00) every day
  .timeZone("UTC") // You can change this to your preferred timezone
  .onRun(async (context) => {
    const db = admin.firestore();
    const scannedQrsRef = db.collection("scanned_qrs");
    
    // Configuration
    const BATCH_SIZE = 500; // Firestore has a limit of 500 operations per batch
    let totalDocumentsProcessed = 0;
    let totalBatches = 0;
    
    try {
      // Log function start time
      logger.info(`Starting daily_trip_count reset at ${new Date().toISOString()}`);
      
      // Get all documents in the scanned_qrs collection
      const snapshot = await scannedQrsRef.get();
      
      // If there are no documents, log and exit early
      if (snapshot.empty) {
        logger.info("No documents found in scanned_qrs collection");
        return null;
      }
      
      // Calculate number of batches needed
      const totalDocuments = snapshot.size;
      const numberOfBatches = Math.ceil(totalDocuments / BATCH_SIZE);
      
      // Process in batches
      let currentBatch = db.batch();
      let operationsInCurrentBatch = 0;
      
      for (const doc of snapshot.docs) {
        // Add document update to current batch
        currentBatch.update(doc.ref, { 
          daily_trip_count: 0,
          last_reset: admin.firestore.FieldValue.serverTimestamp()
        });
        
        operationsInCurrentBatch++;
        totalDocumentsProcessed++;
        
        // If batch is full or this is the last document, commit the batch
        if (operationsInCurrentBatch >= BATCH_SIZE || totalDocumentsProcessed >= totalDocuments) {
          await currentBatch.commit();
          totalBatches++;
          
          // Log progress for larger collections
          if (numberOfBatches > 1) {
            logger.info(`Completed batch ${totalBatches}/${numberOfBatches} (${totalDocumentsProcessed}/${totalDocuments} documents)`);
          }
          
          // Reset for next batch if there are more documents
          if (totalDocumentsProcessed < totalDocuments) {
            currentBatch = db.batch();
            operationsInCurrentBatch = 0;
          }
        }
      }
      
      // Log successful completion
      logger.info(`Successfully reset daily_trip_count for ${totalDocumentsProcessed} passes in ${totalBatches} batches at ${new Date().toISOString()}`);
      
      // Create a log entry in a separate collection for audit purposes
      const logEntry: SystemLog = {
        operation: "reset_daily_trip_count",
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        documentsProcessed: totalDocumentsProcessed,
        batchesUsed: totalBatches,
        status: "success"
      };
      
      await db.collection("system_logs").add(logEntry);
      
      return null;
    } catch (error) {
      // Handle error and create type-safe error object
      const err = error as Error;
      
      // Log error details
      logger.error("Error resetting daily trip counts:", err);
      
      // Create error log entry
      try {
        const errorLogEntry: SystemLog = {
          operation: "reset_daily_trip_count",
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          documentsProcessed: totalDocumentsProcessed,
          batchesUsed: totalBatches,
          status: "error",
          errorMessage: err.message,
          errorStack: err.stack
        };
        
        await db.collection("system_logs").add(errorLogEntry);
      } catch (logError) {
        const logErr = logError as Error;
        logger.error("Failed to write error log:", logErr);
      }
      
      return null;
    }
  });