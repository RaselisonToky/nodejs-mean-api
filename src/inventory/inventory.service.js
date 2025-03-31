import Inventory from "./inventory.entity.js";

class InventoryService {
  async getAll() {
    return await Inventory.find().populate("part_id");
  }

  async getById(id) {
    return await Inventory.findById(id).populate("part_id");
  }

  async create(data) {
    return await Inventory.create(data);
  }

  async update(id, data) {
    return await Inventory.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Inventory.findByIdAndDelete(id);
  }

  async search(criteria) {
    // Préparation des critères de recherche
    const searchCriteria = {};
    
    // Recherche par pièce
    if (criteria.part_id) {
      searchCriteria.part_id = criteria.part_id;
    }
    
    // Recherche par plage de dates d'audit
    if (criteria.start_date || criteria.end_date) {
      searchCriteria.audit_date = {};
      
      if (criteria.start_date) {
        searchCriteria.audit_date.$gte = new Date(criteria.start_date);
      }
      
      if (criteria.end_date) {
        searchCriteria.audit_date.$lte = new Date(criteria.end_date);
      }
    }
    
    // Recherche par différence (positive ou négative)
    if (criteria.has_difference === true) {
      searchCriteria.difference = { $ne: 0 };
    } else if (criteria.has_difference === false) {
      searchCriteria.difference = 0;
    }
    
    // Recherche par plage de différence
    if (criteria.min_difference !== undefined || criteria.max_difference !== undefined) {
      searchCriteria.difference = searchCriteria.difference || {};
      
      if (criteria.min_difference !== undefined) {
        searchCriteria.difference.$gte = criteria.min_difference;
      }
      
      if (criteria.max_difference !== undefined) {
        searchCriteria.difference.$lte = criteria.max_difference;
      }
    }
    
    return await Inventory.find(searchCriteria).populate("part_id");
  }
}

export default new InventoryService();
