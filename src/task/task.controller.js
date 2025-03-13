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
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la création ou mise à jour des tâches",
                error: error.message,
            });
        }
    }

    async findTasksByAppointmentId(req, res){
        try{
            const tasks = await taskService.findTasksByAppointmentId(req.params.id);
            console.log(tasks)
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
}

export default new TaskController();
