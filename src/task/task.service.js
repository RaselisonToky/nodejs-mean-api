import Task from "./task.entity.js";

class TaskService {
    async upsertMany(tasksData) {
        const results = [];
        for (const taskData of tasksData) {
            const existingTask = await Task.findOne({
                appointment: taskData.appointment,
                service: taskData.service
            });
            let result;
            if (existingTask) {
                existingTask.users = taskData.users;
                existingTask.status = taskData.status || existingTask.status;
                result = await existingTask.save();
            } else {
                const newTask = new Task(taskData);
                result = await newTask.save();
            }

            results.push(result);
        }
        return results;
    }

    async findTasksByAppointmentId(appointmentId){
        return Task.find({ appointment: appointmentId })
    }
}

export default new TaskService();
