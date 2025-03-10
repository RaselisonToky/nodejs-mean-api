import Appointment from "./appointment.entitiy.js";

class AppointmentService{
    async getAll(){
        return Appointment.find()
            .populate({
                path: 'services',
                populate: {
                    path: 'category'
                }
            })
            .populate({
                path: 'carModel',
                populate: {
                    path: 'brand',
                }
            });
    }

    async getById(id){
        const appointment = Appointment.findById(id);
        if (!appointment){
            throw new Error("Marque non trouvée");
        }
        return appointment;
    }

    async create(data){
        const newAppointment = new Appointment(data);
        return await newAppointment.save();
    }

    async update(id, data){
        return Appointment.findByIdAndUpdate(id, data);
    }

    async deleteById(id){
        return Appointment.findByIdAndDelete(id);
    }
}
export default new AppointmentService();
