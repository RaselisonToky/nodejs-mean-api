import Appointment from "./appointment.entitiy.js";

class AppointmentService{
    async getAll(startDate, endDate) {
        return Appointment.find({
            scheduleAt: {
                $gte: startDate,
                $lte: endDate
            }
        }).populate({
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
        })
        .exec();
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

    async getAvailableTimeSlots(date) {
        try {
            const allTimeSlots = [
                '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
                '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
            ];
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            const appointments = await Appointment.find({
                scheduleAt: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            });
            const bookedTimeSlots = appointments.map(appointment => {
                const appointmentDate = new Date(appointment.scheduleAt);
                return `${appointmentDate.getHours().toString().padStart(2, '0')}:00`;
            });
            return allTimeSlots.filter(
                timeSlot => !bookedTimeSlots.includes(timeSlot)
            );
        } catch (error) {
            console.error('Erreur lors de la récupération des créneaux disponibles:', error);
            throw error;
        }
    }
}
export default new AppointmentService();
