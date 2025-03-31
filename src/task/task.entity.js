import mongoose from "mongoose";
import {STATUS} from "../appointment/appointment.entitiy.js";

const TaskSchema = new mongoose.Schema({
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    maintenance_start_time: {
        type: Date,
        default: null
    },
    review_start_time: {
        type: Date,
        default: null
    },
    finish_time: {
        type:Date,
        default: null
    },
    status: {
        type: String,
        enum: Object.values(STATUS),
        default: STATUS.PENDING
    }
})
const Task = mongoose.model('Task', TaskSchema);
export default Task;
