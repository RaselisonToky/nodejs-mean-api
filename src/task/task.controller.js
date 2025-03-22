import taskService from "./task.service.js";

class TaskController {
    async upsertMany(req, res) {
        try {
            const tasks = await taskService.upsertMany(req.body);
            res.status(200).json({
                success: true,
                data: tasks,
                message: "Tâches créées ou mises à jour avec succès"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Erreur lors de la création ou mise à jour des tâches",
                error: error.message,
            });
        }
    }

    async findTaskByUserId(req, res){
        try {
            const tasks = await  taskService.findTasksByUserId(req.params.id);
            res.json({
                success: true,
                data: tasks,
                count: tasks.length
            })
        }catch (error){
            res.status(500).json({
                success: false,
                message: "Erreur lors de la récuperation des tâches",
                error: error.message,
            })
        }
    }

    async findTaskByAppointmentIdAndServiceId(req, res){
        try {
            const {appointmentId, serviceId} = req.body;
            const task = await taskService.findTaskByAppointmentIdAndServiceId(appointmentId, serviceId);
            res.json({
                success: true,
                data: task
            })
        }catch (error){
            res.status(500).json({
                success: false,
                message: 'Error lors de la récuperation du tâche',
                error: error.message
            })
        }
    }

    async findTasksByAppointmentId(req, res){
        try{
            const tasks = await taskService.findTasksByAppointmentId(req.params.id);
            res.json({
                success: true,
                data: tasks,
                count: tasks.length
            })
        }catch (error){
            res.status(500).json({
                success: false,
                message: "Erreur lors de la récuperation des tâches",
                error: error.message,
            })
        }
    }

    async updateTaskStatus(req, res) {
        try{
            const task = await taskService.updateTaskStatus(req.params.id, req.body);
            res.json({
                success: true,
                data: task
            })
        }catch (error){
            res.status(500).json({
                success: false,
                message: "Erreur lors de la mise à jour du tâche",
                error: error.message,
            })
        }
    }
}

export default new TaskController();
