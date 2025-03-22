import mongoose from "mongoose";
import Task from "../task/task.entity.js";

const ArchivedTaskSchema  = new mongoose.Schema({
    ... Task.schema.obj,
})
const ArchivedTask = mongoose.model('ArchivedTask', ArchivedTaskSchema);
export default ArchivedTask;
