import Service from "./service.entity.js";

class ServiceService{
    async getAll(){
        return Service.find();
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
}

export default new ServiceService();
