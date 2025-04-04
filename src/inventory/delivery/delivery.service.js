import mongoose from 'mongoose';
import SupplierOrder from '../supplier/order/order.entity.js';
import Delivery from './delivery.entity.js';
import Piece from '../piece/piece.entity.js';
class DeliveryService {

    /**
     * Populates the necessary fields for a delivery document or array of documents.
     * @param {object | object[]} deliveryData - The delivery document or array to populate.
     * @returns {Promise<object | object[]>} - The populated data.
     */
    async _populateDelivery(deliveryData) {
        if (!deliveryData) return deliveryData;
        // Ensure models are registered if not explicitly imported everywhere
        try {
            await Delivery.populate(deliveryData, [
                {
                    path: 'order_id',
                    model: 'SupplierOrder', // Ensure 'SupplierOrder' is correct model name
                    select: 'ticket_number supplier_id status', // Select useful fields from the order
                    populate: { // Nested populate for the supplier within the order
                        path: 'supplier_id',
                        model: 'Supplier', // Ensure 'Supplier' is correct model name
                        select: 'name' // Select only the supplier name
                    }
                },
                {
                    path: 'details.part_id',
                    model: 'Piece', // Ensure 'Piece' is correct model name
                    select: 'name reference' // Select useful fields from the piece
                }
            ]);
        } catch (error) {
            console.error("Error during delivery population:", error);
            // Decide if you want to throw or just return unpopulated data
            // throw error;
        }
        return deliveryData;
    }

    /**
     * Calculates the total amount based on delivery details.
     * @param {Array} details - The details array from the delivery data.
     * @returns {number} - The calculated total amount.
     */
    _calculateTotalAmount(details = []) {
        return details.reduce((sum, item) => {
            const quantity = (typeof item.quantity === 'number' && !isNaN(item.quantity)) ? item.quantity : 0;
            const unitPrice = (typeof item.unit_price === 'number' && !isNaN(item.unit_price)) ? item.unit_price : 0;
            return sum + (quantity * unitPrice);
        }, 0);
    }

    _formatDataDetails(dtoDetails) {
        const formattedDetails = dtoDetails.map((piece) => ({
            part_id: piece.pieceId,
            quantity: piece.quantite,
            unit_price: piece.prixUnitaire
        }));
        return formattedDetails;
    }
    async create(data) {
        console.log("Creating delivery with data:", data);
        try {

            const temDelivery = {
                order_id: data.order_id,
                total_amount: data.total_amount,
                details: this._formatDataDetails(data.details)
            };

            const newDelivery = await Delivery.create(temDelivery);
            // Populate the newly created delivery before returning
            return await this._populateDelivery(newDelivery);
        } catch (error) {
            console.error("Error creating delivery:", error);
            throw error; // Re-throw for controller to handle
        }
    }

    /**
     * Retrieves all deliveries with pagination.
     * @param {object} queryParams - Query parameters (page, limit).
     * @returns {Promise<object>} - Object containing paginated data and metadata.
     */
    async getAll(queryParams = {}) {
        const { page = 1, limit = 10 } = queryParams;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        try {
            const findQuery = Delivery.find()
                .sort({ delivery_date: -1 }) // Sort by most recent delivery
                .skip(skip)
                .limit(limitNum);

            const countQuery = Delivery.countDocuments(); // Count all documents matching the base query (none here)

            // Execute queries in parallel
            const [deliveries, totalDocs] = await Promise.all([
                findQuery.lean().exec(), // Use lean() for performance if only reading
                countQuery.exec()
            ]);

            // Populate the results after fetching
            const populatedDeliveries = await this._populateDelivery(deliveries);


            const totalPages = Math.ceil(totalDocs / limitNum);
            const pagination = {
                totalDocs: totalDocs,
                limit: limitNum,
                totalPages: totalPages,
                currentPage: pageNum,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1,
            };

            return { data: populatedDeliveries, pagination };
        } catch (error) {
            console.error("Error getting all deliveries:", error);
            throw error;
        }
    }

    /**
     * Retrieves a single delivery by its ID.
     * @param {string} id - The ID of the delivery.
     * @returns {Promise<object|null>} - The populated delivery document or null if not found.
     */
    async getById(id) {
        try {
            const delivery = await Delivery.findById(id).lean(); // Use lean() if only reading
            if (!delivery) {
                return null;
            }
            return await this._populateDelivery(delivery);
        } catch (error) {
            console.error(`Error getting delivery by ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Updates an existing delivery. Recalculates total_amount if details change.
     * @param {string} id - The ID of the delivery to update.
     * @param {object} data - The update data.
     * @returns {Promise<object|null>} - The updated and populated delivery document or null if not found.
     */
    async update(id, data) {
        try {
            let updateData = { ...data };

            // If details are being updated, recalculate total_amount
            if (data.details && Array.isArray(data.details)) {
                updateData.total_amount = this._calculateTotalAmount(data.details);
            } else if (data.details === undefined) {
                // If details are not in the update payload, we might need to fetch existing
                // details to ensure total_amount remains correct or decide not to update it.
                // For simplicity here, we only update total if details ARE provided.
                // Alternatively, fetch the doc first, merge changes, recalculate, then save.
                // delete updateData.total_amount; // Or prevent total_amount update if details aren't sent
            }


            const updatedDelivery = await Delivery.findByIdAndUpdate(id, updateData, {
                new: true, // Return the modified document
                runValidators: true // Run schema validators on update
            }).lean(); // Use lean()

            if (!updatedDelivery) {
                return null;
            }
            return await this._populateDelivery(updatedDelivery);
        } catch (error) {
            console.error(`Error updating delivery ${id}:`, error);
            throw error;
        }
    }

    /**
     * Deletes a delivery by its ID.
     * @param {string} id - The ID of the delivery to delete.
     * @returns {Promise<object|null>} - The deleted delivery document or null if not found.
     */
    async delete(id) {
        try {
            const deletedDelivery = await Delivery.findByIdAndDelete(id).lean(); // Use lean()
            // Optionally populate before returning if needed, though usually not for delete confirmation
            // return await this._populateDelivery(deletedDelivery);
            return deletedDelivery; // Return the raw deleted doc or null
        } catch (error) {
            console.error(`Error deleting delivery ${id}:`, error);
            throw error;
        }
    }
}

export default new DeliveryService();