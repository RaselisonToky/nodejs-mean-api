// reset-db-updated.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline/promises'; // For confirmation prompt

dotenv.config(); // Load .env file if you use one

// --- Configuration ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yourDatabaseName'; // Replace DB name
// Optional: Specify collections explicitly via env var (comma-separated), otherwise clear all user collections
const COLLECTIONS_TO_RESET = process.env.RESET_COLLECTIONS ? process.env.RESET_COLLECTIONS.split(',') : null;
// Optional: Exclude specific collections from full reset (even if not system collections)
const COLLECTIONS_TO_EXCLUDE = ['counters', 'changelog']; // Add others if needed (e.g., migration history)
// --- End Configuration ---

// --- Database Helper Functions (from your input) ---
async function connectDB() {
    // Check if already connected or connecting
    if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) { // 0 = disconnected, 3 = disconnecting
        console.log("Connecting to MongoDB...");
        try {
            await mongoose.connect(MONGO_URI);
            console.log(`MongoDB connecté à: ${mongoose.connection.db.databaseName}`);
        } catch (error) {
            console.error("Erreur de connexion MongoDB:", error);
            throw error; // Re-throw error to stop the script
        }
    } else if (mongoose.connection.readyState === 1) { // 1 = connected
        console.log(`Déjà connecté à MongoDB: ${mongoose.connection.db.databaseName}`);
    } else { // 2 = connecting
        console.log("Connexion MongoDB en cours...");
        // Optionally wait for connection if needed, though connectDB call below should handle it.
    }
}

async function closeDB() {
    if (mongoose.connection.readyState !== 0 && mongoose.connection.readyState !== 3) { // If connected or connecting
        console.log("Fermeture de la connexion MongoDB...");
        await mongoose.connection.close();
        console.log("Connexion MongoDB fermée.");
    } else {
        console.log("Connexion MongoDB déjà fermée ou en cours de fermeture.");
    }
}
// --- End Helper Functions ---


// --- Core Reset Logic ---
async function resetDatabase() {
    let dbName = 'Unknown'; // Placeholder
    try {
        await connectDB(); // Use the helper to connect
        const db = mongoose.connection.db; // Get the native DB driver object
        dbName = db.databaseName; // Get actual DB name for logging

        console.warn(`\n🚨 WARNING: This script will DELETE data from database: ${dbName} 🚨`);

        let collectionsToProcess;

        // Determine which collections to target
        if (COLLECTIONS_TO_RESET && COLLECTIONS_TO_RESET.length > 0 && COLLECTIONS_TO_RESET[0] !== '') {
            console.log('Targeting specific collections for reset:', COLLECTIONS_TO_RESET.join(', '));
            collectionsToProcess = COLLECTIONS_TO_RESET;
        } else {
            console.log(`Targeting ALL user collections in '${dbName}' for reset (excluding: ${COLLECTIONS_TO_EXCLUDE.join(', ') || 'none'}).`);
            const allCollections = await db.listCollections().toArray();
            collectionsToProcess = allCollections
                .map(c => c.name)
                .filter(name => !name.startsWith('system.') && !COLLECTIONS_TO_EXCLUDE.includes(name));
        }

        if (collectionsToProcess.length === 0) {
            console.log("No collections found to reset based on criteria.");
            return; // Exit early if nothing to do
        }

        console.log("\nCollections to be cleared:");
        collectionsToProcess.forEach(name => console.log(` - ${name}`));
        console.log("\nStarting deletion process...");

        let successCount = 0;
        let errorCount = 0;

        // Iterate and delete documents using the native driver's collection object
        for (const collName of collectionsToProcess) {
            try {
                const collection = db.collection(collName); // Get native collection object
                const result = await collection.deleteMany({}); // Clear the collection
                console.log(`  ✅ Cleared '${collName}': ${result.deletedCount} documents deleted.`);
                successCount++;
            } catch (error) {
                console.error(`  ❌ Error clearing collection '${collName}':`, error.message);
                errorCount++;
            }
        }

        console.log("\n------------------------------------");
        console.log("Reset script finished.");
        console.log(`Collections successfully cleared: ${successCount}`);
        console.log(`Collections with errors: ${errorCount}`);
        console.log("------------------------------------");

    } catch (error) {
        // Error during connection or listing collections
        console.error("\n❌ An critical error occurred during the reset process:", error);
        process.exitCode = 1; // Indicate failure
    } finally {
        // Ensure disconnection happens even if errors occurred
        await closeDB(); // Use the helper to disconnect
    }
}

// --- Confirmation and Execution ---
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function runWithConfirmation() {
    // Try a preliminary connect just to get the DB name for the prompt
    let preliminaryDbName = 'database specified in MONGO_URI';
    try {
        await connectDB();
        preliminaryDbName = mongoose.connection.db.databaseName;
        await closeDB(); // Close immediately after getting name
    } catch (e) {
        console.warn("Could not pre-connect to determine database name for prompt.");
    }


    const answer = await rl.question(`\nType 'RESET' to confirm deletion in database '${preliminaryDbName}': `);
    rl.close(); // Close readline interface

    if (answer === 'RESET') {
        console.log("Confirmation received. Proceeding with database reset...");
        await resetDatabase(); // Execute the main reset logic
    } else {
        console.log("Reset aborted by user.");
    }
}

// Start the process
runWithConfirmation();