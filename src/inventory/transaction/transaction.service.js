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
        // Préparation des critères de recherche
        const searchCriteria = {};

        // Recherche par pièce
        if (criteria.part_id) {
            searchCriteria.part_id = criteria.part_id;
        }

        // Recherche par type de transaction
        if (criteria.type) {
            searchCriteria.type = criteria.type;
        }

        // Recherche par commande associée
        if (criteria.related_order_id) {
            searchCriteria.related_order_id = criteria.related_order_id;
        }

        // Recherche par plage de dates
        if (criteria.start_date || criteria.end_date) {
            searchCriteria.transaction_date = {};

            if (criteria.start_date) {
                searchCriteria.transaction_date.$gte = new Date(criteria.start_date);
            }

            if (criteria.end_date) {
                searchCriteria.transaction_date.$lte = new Date(criteria.end_date);
            }
        }

        // Recherche par quantité
        if (criteria.min_quantity || criteria.max_quantity) {
            searchCriteria.quantity = {};

            if (criteria.min_quantity) {
                searchCriteria.quantity.$gte = criteria.min_quantity;
            }

            if (criteria.max_quantity) {
                searchCriteria.quantity.$lte = criteria.max_quantity;
            }
        }

        return await Transaction.find(searchCriteria)
            .populate("part_id")
            .populate("related_order_id");
    }
}

export default new TransactionService();
