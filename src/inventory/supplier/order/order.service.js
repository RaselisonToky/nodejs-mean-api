import SupplierOrder from "./order.entity.js";
import { getNextSequenceValue_TimestampRandom } from "../../../lib/util.js";
class SupplierOrderService {
  async getAll() {

    return await SupplierOrder
      .find()
      .populate({
        path: "supplier_id",
        select: "name",
        model: "Supplier",
        as: "supplier",
      })
  }

  async getById(id) {
    return await SupplierOrder.findById(id).populate("supplier_id").populate("items.part_id");
  }

  async create(data) {
    const ticketNumber = await this.generateSupplierOrderTicket();
    data.ticket_number = ticketNumber; // Ajout du numéro de ticket à la commande
    return await SupplierOrder.create(data);
  }

  async update(id, data) {
    return await SupplierOrder.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await SupplierOrder.findByIdAndDelete(id);
  }
  // Original find-based search (can be kept for internal use or removed)
  async _searchByExactCriteria(criteria) {
    const searchCriteria = {};
    if (criteria.supplier_id) searchCriteria.supplier_id = criteria.supplier_id;
    if (criteria.status) searchCriteria.status = criteria.status;
    if (criteria.start_date || criteria.end_date) {
      searchCriteria.order_date = {};
      if (criteria.start_date) searchCriteria.order_date.$gte = new Date(criteria.start_date);
      if (criteria.end_date) searchCriteria.order_date.$lte = new Date(criteria.end_date);
    }
    return await SupplierOrder.find(searchCriteria)
      .populate({ path: "supplier_id", model: "Supplier" })
      .populate({ path: "items.part_id", model: "Piece" });
  }


  /**
  * Searches supplier orders using aggregation based on query parameters,
  * includes text search, pagination, and formats the results.
  * @param {object} queryParams - Object containing query parameters (startDate, endDate, q, page, limit).
  * @returns {Promise<object>} - Promise resolving to { data: formattedResults, pagination: {...} }.
  */
  async search(queryParams = {}) {
    const { startDate, endDate, q, page = 1, limit = 10 } = queryParams;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const limitNum = parseInt(limit, 10);

    const pipeline = [];

    // --- Stage 1: Initial Match (Dates, exact fields if any) ---
    const initialMatch = {};
    if (startDate || endDate) {
      initialMatch.order_date = {};
      if (startDate) {
        try { initialMatch.order_date.$gte = new Date(startDate); }
        catch (e) { console.warn("Invalid start date format:", startDate); }
      }
      if (endDate) {
        try {
          let endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999); // Include full end day
          initialMatch.order_date.$lte = endOfDay;
        } catch (e) { console.warn("Invalid end date format:", endDate); }
      }
      // Clean up if dates were invalid
      if (Object.keys(initialMatch.order_date).length === 0) {
        delete initialMatch.order_date;
      }
    }
    // Add other exact match fields from queryParams if needed (e.g., status)
    // if (queryParams.status) { initialMatch.status = queryParams.status; }

    if (Object.keys(initialMatch).length > 0) {
      pipeline.push({ $match: initialMatch });
    }

    // --- Stage 2: Lookup Supplier ---
    pipeline.push({
      $lookup: {
        from: 'suppliers', // Collection name for Suppliers
        localField: 'supplier_id',
        foreignField: '_id',
        as: 'supplierDetails'
      }
    });
    pipeline.push({
      $unwind: { path: '$supplierDetails', preserveNullAndEmptyArrays: true }
    });

    // --- Stage 3: Text Search Match (if 'q' is provided) ---
    if (q && q.trim()) {
      const searchQuery = q.trim();
      // Escape special regex characters for safety
      const escapedSearchQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedSearchQuery, 'i'); // Case-insensitive search

      pipeline.push({
        $match: {
          $or: [
            { ticket_number: regex },
            { status: regex }, // Search status if relevant
            { 'supplierDetails.name': regex } // Search on joined supplier name
            // Add more fields if needed (e.g., item names/refs - requires another lookup+unwind or different strategy)
          ]
        }
      });
    }

    // --- Stage 4: Pagination and Data Shaping using $facet ---
    pipeline.push({
      $facet: {
        // Branch 1: Metadata (total count)
        metadata: [
          { $count: 'totalDocs' }
        ],
        // Branch 2: Data (paginated results)
        data: [
          { $sort: { order_date: -1 } }, // Sort before skip/limit
          { $skip: skip },
          { $limit: limitNum },
          // Project to reshape (rename supplier_id to supplier, etc.)
          {
            $project: {
              supplier_id: 0, // Exclude original ID field
              // supplierDetails: 0, // Exclude the temporary join field

              _id: 1,
              order_date: 1,
              ticket_number: 1,
              items: 1, // Keep items array for later population
              status: 1,
              total_amount: 1, // Keep if exists
              __v: 1,

              // Create the 'supplier' field
              supplier: {
                $ifNull: [
                  { _id: "$supplierDetails._id", name: "$supplierDetails.name" },
                  null // Or { _id: null, name: 'Inconnu' }
                ]
              }
            }
          }
        ]
      }
    });

    // --- Execute Aggregation ---
    const aggregationResult = await SupplierOrder.aggregate(pipeline);

    // --- Process Results ---
    const resultsData = aggregationResult[0]?.data || [];
    const totalDocs = aggregationResult[0]?.metadata[0]?.totalDocs || 0;
    const totalPages = Math.ceil(totalDocs / limitNum);

    // --- Populate items.part_id on the paginated data ---
    if (resultsData.length > 0) {
      await SupplierOrder.populate(resultsData, {
        path: 'items.part_id',
        model: 'Piece', // Ensure 'Piece' is the correct Mongoose model name
        select: 'name reference unit_price' // Select desired fields
      });
    }

    // --- Format the results ---
    const formattedData = formatSupplierOrdersWithLineTotals(resultsData);

    // --- Return structured response ---
    return {
      data: formattedData,
      pagination: {
        totalDocs: totalDocs,
        limit: limitNum,
        totalPages: totalPages,
        currentPage: parseInt(page, 10),
        hasNextPage: parseInt(page, 10) < totalPages,
        hasPrevPage: parseInt(page, 10) > 1,
      }
    };
  }



  async generateSupplierOrderTicket() {
    const sequenceName = 'supplierOrderTicket'; // Identifiant unique pour ce compteur
    const sequenceNumber = getNextSequenceValue_TimestampRandom(sequenceName);

    // 1. Partie Incrémentale (paddée avec des zéros)
    //    Ajustez le '3' si vous pensez avoir besoin de plus de 999 commandes (ex: '5' pour 99999)
    const paddedSequence = sequenceNumber.toString().padStart(3, '0');

    // 2. Partie Aléatoire (5 caractères alphanumériques en minuscule)
    //    Utilise Math.random et toString(36) pour obtenir des caractères [0-9a-z]
    const randomPart = Math.random().toString(36).substring(2, 7); // Prend 5 caractères après '0.'

    // 3. Assemblage final
    const ticketNumber = `TCK_SUP${paddedSequence}-${randomPart}`;

    return ticketNumber;
  }
}

export default new SupplierOrderService();
