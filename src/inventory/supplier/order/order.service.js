import SupplierOrder,{SUPPLIER_ORDER_STATUS} from "./order.entity.js";
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

  async getAllTicketAvailable() {
    return await SupplierOrder
      .find({
        status: { $nin: [SUPPLIER_ORDER_STATUS.CANCELLED, SUPPLIER_ORDER_STATUS.DELIVERED] }
      })
      .select('ticket_number _id');
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



  async search(queryParams = {}) {

    const { startDate, endDate, page = 1, limit = 10 } = queryParams;
    console.log(page, limit);
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const pipeline = [];
    const matchFilter = {}; // Filter object for the $match stage

    if (startDate || endDate) {
      matchFilter.order_date = {};
      if (startDate) {
        try {
          matchFilter.order_date.$gte = new Date(startDate);
        } catch (e) { console.warn("Invalid start date format:", startDate); }
      }
      if (endDate) {
        try {
          let endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999);
          matchFilter.order_date.$lte = endOfDay;
        } catch (e) { console.warn("Invalid end date format:", endDate); }
      }
      // Clean up if dates were invalid or object is empty
      if (!matchFilter.order_date || Object.keys(matchFilter.order_date).length === 0) {
        delete matchFilter.order_date;
      }
    }

    if (Object.keys(matchFilter).length > 0) {
      pipeline.push({ $match: matchFilter });
    }

    const countPipeline = [];
    if (Object.keys(matchFilter).length > 0) {
      countPipeline.push({ $match: matchFilter });
    }
    countPipeline.push({ $count: 'totalDocs' });

    let totalDocs = 0;
    try {
      if (countPipeline.length === 1) { // Only $count stage
        totalDocs = await SupplierOrder.estimatedDocumentCount(); // Faster for no filters
      } else {
        const countResult = await SupplierOrder.aggregate(countPipeline);
        totalDocs = countResult.length > 0 ? countResult[0].totalDocs : 0;
      }
    } catch (error) {
      console.error("Error calculating total count:", error);
      throw new Error("Failed to calculate total document count.");
    }

    pipeline.push({
      $lookup: {
        from: 'suppliers', // Use correct collection name
        localField: 'supplier_id',
        foreignField: '_id',
        as: 'supplier_id'
      }
    });

    pipeline.push({
      $unwind: {
        path: '$supplier_id',
        preserveNullAndEmptyArrays: true
      }
    });



    let resultsData = [];
    try {
      resultsData = await SupplierOrder.aggregate(pipeline);
    } catch (error) {
      console.error("Error executing main search aggregation:", error);
      // console.error("Pipeline:", JSON.stringify(pipeline, null, 2)); // Uncomment for debugging
      throw new Error("Failed to retrieve supplier orders.");
    }

    // --- Populate items.part_id on the paginated results ---
    if (resultsData.length > 0) {
      try {
        await SupplierOrder.populate(resultsData, {
          path: 'items.part_id',
          model: 'Piece',
          select: 'name reference unit_price'
        });
      } catch (error) {
        console.error("Error populating items.part_id:", error);
      }
    }


    // --- Construct Pagination Info ---
    const totalPages = Math.ceil(totalDocs / limitNum);
    const pagination = {
      totalDocs: totalDocs,
      limit: limitNum,
      totalPages: totalPages,
      currentPage: pageNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    };

    // --- Return structured response ---
    return {
      data: resultsData,
      pagination: pagination
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
