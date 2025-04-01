import Service from "./service.entity.js";
import serviceRepository from "./repository/service.repository.js";

class ServiceService{
    async getAll(){
        return Service.find().populate('category');
    }

    async getById(id){
        const service = Service.findById(id);
        if (!service){
            throw new Error("Categorie non trouvée");
        }
        return service;
    }

    async create(data){
        const newService = new Service(data);
        return await newService.save();
    }

    async update(id, data){
        return Service.findByIdAndUpdate(id, data);
    }

    async deleteById(id){
        return Service.findByIdAndDelete(id);
    }

    async groupedByCategory(startDate, endDate) {
        return serviceRepository.groupedByCategoryMongoDB(startDate,endDate);
    }

}

export default new ServiceService();
