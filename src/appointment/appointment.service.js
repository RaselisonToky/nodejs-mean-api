import Appointment, {allTimeSlots, STATUS} from "./appointment.entitiy.js";
import TaskService from "../task/task.service.js";
import taskService from "../task/task.service.js";

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
                const hours = appointmentDate.getHours().toString().padStart(2, '0');
                const minutes = appointmentDate.getMinutes().toString().padStart(2, '0');
                return `${hours}:${minutes}`;
            });
            return allTimeSlots.filter(
                timeSlot => !bookedTimeSlots.includes(timeSlot)
            );
        } catch (error) {
            console.error('Erreur lors de la récupération des créneaux disponibles:', error);
            throw error;
        }
    }

    async updateAppointmentStatus(appointmentId){
        const tasks = await taskService.findTasksByAppointmentId(appointmentId);
        const newStatus = await this.DETERMINES_APPOINTMENT_STATUS(tasks);
        return Appointment.findByIdAndUpdate(appointmentId, {status: newStatus})
    }

    async DETERMINES_APPOINTMENT_STATUS(tasks, appointmentId){
        const isPending = await TaskService.CHECK_IF_ONE_OF_APPOINTMENT_TASKS_IS_PEDNING(tasks);
        const isInProgress = await TaskService.CHECK_IF_ONE_OF_APPOINTMENT_TASKS_IS_IN_PROGRESS(tasks);
        const isInReview = await TaskService.CHECK_IF_ALL_TASK_IS_IN_REVIEW(tasks);
        if(isPending)
            return STATUS.PENDING;
        else if (isInReview)
            return STATUS.IN_REVIEW;
         else if(isInProgress)
            return STATUS.IN_PROGRESS;

        return STATUS.IN_PROGRESS;
    }



}
export default new AppointmentService();
