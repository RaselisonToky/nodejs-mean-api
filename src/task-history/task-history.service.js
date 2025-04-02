import TaskHistory from "./task-history.entity.js";
import Appointment from "../appointment/appointment.entitiy.js";

class TaskHistoryService {
    async create(task) {
        const taskObj = task.toObject ? task.toObject() : { ...task };
        delete taskObj._id;
        const {estimatedPrice} = await Appointment.findById(taskObj.appointment);
        taskObj.price = estimatedPrice;
        const newTaskHistory = new TaskHistory(taskObj);
        return newTaskHistory.save();
    }

    async getAll(startDate, endDate){
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);
        startDateTime.setUTCHours(0,0,0,0);
        endDateTime.setUTCHours(23,59,59,999)
        return TaskHistory.find({
            createdAt: {
                $gte: startDateTime,
                $lte: endDateTime
            }
         })
        .populate('appointment', 'licensePlate')
        .populate('service', 'name')
        .populate('users', 'firstname')
        .exec()
    }
}
export default new TaskHistoryService();
