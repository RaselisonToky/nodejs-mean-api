import mongoose from "mongoose";

export const STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    IN_MAINTENANCE: 'IN_MAINTENANCE',
    SUSPENDED: 'SUSPENDED',
    FINISHED: 'FINISHED'
};

const AppointmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    carModel: { type: mongoose.Schema.Types.ObjectId, ref: 'Model', required: true },
    licensePlate: { type: String, required: true },
    services: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }
    ],
    scheduleAt: { type: Date, required: true },
    estimateDuration: { type: Number, default: 0 },
    estimatedPrice: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(STATUS), default: STATUS.PENDING }
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);
export default Appointment;
