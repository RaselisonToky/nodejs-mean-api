import SupplierOrder from "./supplierOrder.entity.js";

class SupplierOrderService {
  async getAll() {
    return await SupplierOrder.find().populate("supplier_id").populate("items.part_id");
  }

  async getById(id) {
    return await SupplierOrder.findById(id).populate("supplier_id").populate("items.part_id");
  }

  async create(data) {
    return await SupplierOrder.create(data);
  }

  async update(id, data) {
    return await SupplierOrder.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await SupplierOrder.findByIdAndDelete(id);
  }

  async search(criteria) {
    // Préparation des critères de recherche
    const searchCriteria = {};
    
    // Recherche par fournisseur
    if (criteria.supplier_id) {
      searchCriteria.supplier_id = criteria.supplier_id;
    }
    
    // Recherche par statut
    if (criteria.status) {
      searchCriteria.status = criteria.status;
    }
    
    // Recherche par plage de dates
    if (criteria.start_date || criteria.end_date) {
      searchCriteria.order_date = {};
      
      if (criteria.start_date) {
        searchCriteria.order_date.$gte = new Date(criteria.start_date);
      }
      
      if (criteria.end_date) {
        searchCriteria.order_date.$lte = new Date(criteria.end_date);
      }
    }
    
    return await SupplierOrder.find(searchCriteria)
      .populate("supplier_id")
      .populate("items.part_id");
  }
}

export default new SupplierOrderService();
