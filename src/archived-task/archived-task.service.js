import ArchivedTask from "./archived-task.entity.js";

class ArchivedTaskService{
    async create(task){
        const archivedTask = new ArchivedTask(task);
        return archivedTask.save();
    }
}
export default new ArchivedTaskService();
