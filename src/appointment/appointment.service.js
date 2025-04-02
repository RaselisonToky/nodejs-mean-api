import Appointment, {allTimeSlots, STATUS} from "./appointment.entitiy.js";
import TaskService from "../task/task.service.js";
import taskService from "../task/task.service.js";
import appointmentRepository from "./repository/appointment.repository.js";

class AppointmentService{

    async getAll(startDate, endDate) {
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);
        startDateTime.setUTCHours(0, 0, 0, 0);
        endDateTime.setUTCHours(23, 59, 59, 999);
        return Appointment.find({
                scheduleAt: {
                    $gte: startDateTime,
                    $lte: endDateTime
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
            .sort({
                scheduleAt: 1
            })
            .exec();
    }

    async getById(id){
        return Appointment.findById(id)
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
            }).exec();
    }

    async getAvailableTimeSlots(date) {
        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        endOfDay.setUTCHours(23, 59, 59, 999);
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
    }

    async DETERMINES_APPOINTMENT_STATUS(tasks){
        const isCompleted = await TaskService.CHECK_IF_TASK_IS_COMPLETED(tasks);
        const isPending = await TaskService.CHECK_IF_ONE_OF_APPOINTMENT_TASKS_IS_PENDING(tasks);
        const isInProgress = await TaskService.CHECK_IF_ONE_OF_APPOINTMENT_TASKS_IS_IN_PROGRESS(tasks);
        const isInReview = await TaskService.CHECK_IF_ALL_TASK_IS_IN_REVIEW(tasks);
        if(isPending)
            return STATUS.PENDING;
        else if(isCompleted)
            return STATUS.COMPLETED;
        else if (isInReview)
            return STATUS.IN_REVIEW;
         else if(isInProgress)
            return STATUS.IN_PROGRESS;
        return STATUS.IN_PROGRESS;
    }

    async updateAppointmentStatus(appointmentId){
        const tasks = await taskService.findTasksByAppointmentId(appointmentId);
        const newStatus = await this.DETERMINES_APPOINTMENT_STATUS(tasks);
        if(newStatus === STATUS.COMPLETED){
            console.log("miditra ato ve")
            await taskService.deleteManyByAppointmentId(appointmentId);
        }
        return Appointment.findByIdAndUpdate(appointmentId, {status: newStatus})
    }

    async getAppointmentCountByStatus() {
        const counts = await Appointment.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
        const defaultCounts = Object.keys(STATUS).reduce((acc, key) => {
            acc[STATUS[key]] = 0;
            return acc;
        }, {});
        counts.forEach(item => {
            defaultCounts[item._id] = item.count;
        });
        return Object.entries(defaultCounts).map(([action, count]) => ({
            action,
            count
        }));
    }

    async getPendingAppointmentCountBetweenTwoDates(startDate, endDate) {
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);
        startDateTime.setUTCHours(0, 0, 0, 0);
        endDateTime.setUTCHours(23, 59, 59, 999);
        const appointments = await Appointment.find({
            scheduleAt: {
                $gte: startDateTime,
                $lte: endDateTime
            },
            status: STATUS.PENDING
        });
        const appointmentsByDay = {};
        const currentDate = new Date(startDateTime);
        while (currentDate <= endDateTime) {
            const dateString = currentDate.toISOString().split('T')[0];
            appointmentsByDay[dateString] = 0;
            currentDate.setDate(currentDate.getDate() + 1);
        }
        appointments.forEach(appointment => {
            const appointmentDate = new Date(appointment.scheduleAt);
            const dateString = appointmentDate.toISOString().split('T')[0];
            appointmentsByDay[dateString]++;
        });
        return Object.entries(appointmentsByDay).map(([date, count]) => ({
            date,
            appointmentCount: count
        }));
    }

    async getDailyRevenue(startDate, endDate){
        return await appointmentRepository.getDailyRevenueMongoDB(startDate, endDate);
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
