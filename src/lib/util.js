export function getNextSequenceValue_TimestampRandom(sequenceName) {
    // 1. Obtenir le timestamp actuel en millisecondes
    const timestampMs = Date.now();

    // 2. Générer une petite chaîne aléatoire (5 caractères [0-9a-z])
    const randomPart = Math.random().toString(36).substring(2, 7);

    // 3. Combiner
    const generatedValue = `${timestampMs}-${randomPart}`;

    console.log(`Generated Timestamp-Based Value for ${sequenceName || 'sequence'}: ${generatedValue}`);
    return generatedValue;
}