import TaskHistoryService from "./task-history.service.js";

class TaskHistoryController{
    async getAll(req, res){
        try{
            const tasks = await TaskHistoryService.getAll(req.body.startDate, req.body.endDate)
            res.json({
                success: true,
                data: tasks,
                count: tasks.length
            })
        }catch (error){
            console.log(error)
            res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération des tâches"
            })
        }
    }
}

export default new TaskHistoryController();
