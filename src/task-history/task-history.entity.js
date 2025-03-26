import mongoose from "mongoose";
import Task from "../task/task.entity.js";

const TaskHistorySchema  = new mongoose.Schema({
    ...Task.schema.obj,
    price: {
        type: Number
    },
})
const TaskHistory = mongoose.model('TaskHistory', TaskHistorySchema);
export default TaskHistory;
