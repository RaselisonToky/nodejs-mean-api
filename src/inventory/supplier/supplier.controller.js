import supplierService from "./supplier.service.js";

class SupplierController {
  async getAll(req, res) {
    try {
      const suppliers = await supplierService.getAll();
      res.status(200).json({
        success: true,
        data: suppliers,
        rowCounts: suppliers.length,
      });
    } catch (e) {
      res.status(400).json({
        message: "Erreur lors de la récupération des fournisseurs",
        origin: e.message,
        timestamp: Date.now(),
      });
    }
  }

  async getById(req, res) {
    try {
      const supplier = await supplierService.getById(req.params.id);
      if (!supplier) return res.status(404).json({ message: "Fournisseur non trouvé" });
      res.status(200).json(supplier);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async create(req, res) {
    try {
      const newSupplier = await supplierService.create(req.body);
      res.status(201).json(newSupplier);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async update(req, res) {
    try {
      const updatedSupplier = await supplierService.update(req.params.id, req.body);
      if (!updatedSupplier) return res.status(404).json({ message: "Fournisseur non trouvé" });
      res.status(200).json(updatedSupplier);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async delete(req, res) {
    try {
      const deletedSupplier = await supplierService.delete(req.params.id);
      if (!deletedSupplier) return res.status(404).json({ message: "Fournisseur non trouvé" });
      res.status(200).json({ message: "Fournisseur supprimé avec succès" });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async search(req, res) {
    try {
      const results = await supplierService.search(req.body);
      res.status(200).json({
        success: true,
        data: results,
        rowCounts: results.length,
      });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}

export default new SupplierController();