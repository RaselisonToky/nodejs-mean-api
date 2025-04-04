import Task from "./task.entity.js";
import {STATUS} from "../appointment/appointment.entitiy.js";
import AppointmentService from "../appointment/appointment.service.js";
import TaskHistoryService from "../task-history/task-history.service.js";

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
                await TaskHistoryService.create(existingTask);
            } else {
                const newTask = new Task(taskData);
                result = await newTask.save();
                await TaskHistoryService.create(newTask);
            }

            results.push(result);
        }
        return results;
    }

    async findTasksByUserId(userId) {
        return Task.find({ users: userId })
            .populate({
                path: 'appointment',
                select: 'scheduleAt carModel licensePlate',
                populate: {
                    path: 'carModel',
                    select: 'name brand',
                    populate: {
                        path: 'brand',
                        select: 'name'
                    }
                }
            })
            .populate({ path: 'service', select: 'name' })
            .populate({ path: 'users', select: 'firstname' })
            .lean();
    }

    async findTasksByAppointmentId(appointmentId){
        return Task.find({ appointment: appointmentId })
    }

    async findTaskByAppointmentIdAndServiceId(appointmentId, serviceId){
        return Task.findOne({
            appointment: appointmentId,
            service: serviceId
        });

    }

    async updateTaskStatus(taskId, data){
        const taskWithNewStatus = await Task.findByIdAndUpdate(taskId, data, { new: true });
        await AppointmentService.updateAppointmentStatus(taskWithNewStatus['appointment'].toString());
        await TaskHistoryService.create(taskWithNewStatus)
        return taskWithNewStatus;
    }

    async CHECK_IF_ONE_OF_APPOINTMENT_TASKS_IS_PENDING(tasks){
        return tasks.every(task => task.status === STATUS.PENDING);
    }

    async CHECK_IF_ONE_OF_APPOINTMENT_TASKS_IS_IN_PROGRESS(tasks){
        return tasks.some(task => task.status === STATUS.IN_PROGRESS);
    }

    async CHECK_IF_ALL_TASK_IS_IN_REVIEW(tasks){
        return  tasks.every(task => task.status === STATUS.IN_REVIEW);
    }

    async CHECK_IF_TASK_IS_COMPLETED(tasks){
        return  tasks.every(task => task.status === STATUS.COMPLETED);
    }

    async deleteManyByAppointmentId(appointmentId){
        return Task.deleteMany({ appointment: appointmentId });
    }

}

export default new TaskService();
