import Supplier from "./supplier.entity.js";

class SupplierService {
  async getAll() {
    return await Supplier.find();
  }

  async getById(id) {
    return await Supplier.findById(id);
  }

  async create(data) {
    return await Supplier.create(data);
  }

  async update(id, data) {
    return await Supplier.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Supplier.findByIdAndDelete(id);
  }

  async search(criteria) {
    // Exécute une recherche multi-critère en filtrant sur les propriétés présentes dans "criteria"
    return await Supplier.find(criteria);
  }
}

export default new SupplierService();