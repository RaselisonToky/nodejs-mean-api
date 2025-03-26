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
}
export default new TaskHistoryService();
