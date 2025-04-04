import Transaction from "./transaction.entity.js";

class TransactionService {
    async getAll() {
        return await Transaction
            .find()
            .populate("part_id");
    }

    async getById(id) {
        return await Transaction.findById(id).populate("part_id").populate("related_order_id");
    }

    async create(data) {
        return await Transaction.create(data);
    }

    async update(id, data) {
        return await Transaction.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await Transaction.findByIdAndDelete(id);
    }


    async search(criteria) {
        // Initialiser le pipeline d'agrégation
        const pipeline = [];

        // --- Étape 1: $lookup pour joindre les informations de la pièce ---
        pipeline.push({
            $lookup: {
                from: "pieces", // Assurez-vous que c'est le nom correct de la collection MongoDB
                localField: "part_id",
                foreignField: "_id",
                as: "piece" // Alias pour les données jointes
            }
        });

        // --- Étape 2: $unwind pour déconstruire le tableau piece ---
        // preserveNullAndEmptyArrays: true garde les transactions même si la pièce associée n'existe pas/plus.
        pipeline.push({
            $unwind: {
                path: "$piece",
                preserveNullAndEmptyArrays: true // Important si une transaction peut ne pas avoir de pièce valide
            }
        });

        // --- Étape 3: $match pour appliquer tous les filtres ---
        const matchFilter = {};

        // 3.a: Filtrage par date
        if (criteria.start_date || criteria.end_date) {
            matchFilter.transaction_date = {};
            if (criteria.start_date) {
                try {
                    matchFilter.transaction_date.$gte = new Date(criteria.start_date);
                } catch (e) { console.warn("Format de start_date invalide"); }
            }
            if (criteria.end_date) {
                try {
                    let endDate = new Date(criteria.end_date);
                    endDate.setHours(23, 59, 59, 999); // Inclure toute la journée de fin
                    matchFilter.transaction_date.$lte = endDate;
                } catch (e) { console.warn("Format de end_date invalide"); }
            }
            // Nettoyer si invalide ou non fourni
            if (Object.keys(matchFilter.transaction_date).length === 0) {
                delete matchFilter.transaction_date;
            }
        }

        // 3.b: Filtrage par terme de recherche (searchTerm) sur plusieurs champs
        if (criteria.searchTerm) {
            const regex = new RegExp(criteria.searchTerm, "i"); // Regex insensible à la casse

            // Créer une condition $or pour chercher dans les champs Transaction et Piece (piece)
            matchFilter.$or = [
                // Champs de Transaction pertinents pour une recherche textuelle
                { type: regex },
                // Il n'est généralement pas utile de faire un $regex sur un ObjectId comme part_id ou related_order_id
                // Si vous voulez rechercher par ID exact, un filtre différent serait nécessaire.

                // Champs de Piece (via piece)
                { "piece.name": regex },
                { "piece.reference": regex },
                { "piece.description": regex }
                // Ajoutez d'autres champs textuels de piece si nécessaire
            ];
        }

        // Ajouter d'autres filtres exacts si nécessaire (en dehors du $or pour le searchTerm)
        // Exemple:
        // if (criteria.specificType) {
        //     matchFilter.type = criteria.specificType; // Ceci sera combiné avec AND aux autres conditions
        // }
        // if (criteria.exactQuantity) {
        //     matchFilter.quantity = criteria.exactQuantity;
        // }

        // Ajouter l'étape $match au pipeline seulement si des filtres sont définis
        if (Object.keys(matchFilter).length > 0) {
            pipeline.push({ $match: matchFilter });
        }

        // --- Étape 4: $project pour formater le résultat final ---
        pipeline.push({
            $project: {
                _id: 1,
                part_id: 1,
                type: 1,
                quantity: 1,
                transaction_date: 1,
                related_order_id: 1,
                prix_unitaire: 1,
                // Inclure les détails pertinents de la pièce jointe
                piece: { // Renvoyer un objet ou null/absent si la pièce n'a pas été trouvée
                    $cond: { // Utiliser $cond pour gérer le cas où piece pourrait être null/absent (à cause de preserveNullAndEmptyArrays)
                        if: { $ifNull: ["$piece", false] }, // Vérifie si piece existe
                        then: {
                            // _id: "$piece._id", // Optionnel
                            name: "$piece.name",
                            reference: "$piece.reference",
                            description: "$piece.description"
                            // unit_price: "$piece.unit_price" // Optionnel
                        },
                        else: null // Ou {} ou $$REMOVE selon le comportement souhaité
                    }
                }
                // Exclure le champ piece original si $unwind a été utilisé sans preserve...
                // et si vous ne voulez pas le tableau vide ou null
            }
        });

        // --- Étape 5: $sort pour ordonner les résultats ---
        // Trier par date décroissante par défaut. Pas de score de pertinence ici.
        pipeline.push({ $sort: { transaction_date: -1 } });

        // --- Étape 6: $limit et $skip pour la pagination (Optionnel) ---
        // if (criteria.limit) {
        //     pipeline.push({ $limit: parseInt(criteria.limit, 10) });
        // }
        // if (criteria.skip) {
        //     pipeline.push({ $skip: parseInt(criteria.skip, 10) });
        // }

        // --- Exécution de la pipeline d'agrégation ---
        try {
            // console.log("Pipeline d'agrégation (sans $search):", JSON.stringify(pipeline, null, 2));
            const results = await Transaction.aggregate(pipeline).exec(); // .exec() est bon pour la clarté avec Mongoose
            return results;
        } catch (error) {
            console.error("Erreur lors de l'agrégation (sans $search) de recherche de transactions:", error);
            // Gérer l'erreur de manière appropriée
            throw error; // Ou retourner un tableau vide: return [];
        }
    }
}

export default new TransactionService();
