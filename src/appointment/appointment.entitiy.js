import mongoose from "mongoose";

export const STATUS = {
    REQUESTED: 'REQUESTED',
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    IN_REVIEW: 'IN_REVIEW',
    COMPLETED: 'COMPLETED',
};

export const allTimeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

const AppointmentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    carModel: { type: mongoose.Schema.Types.ObjectId, ref: 'Model', required: true },
    licensePlate: { type: String, required: true },
    services: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }
    ],
    scheduleAt: { type: Date, required: true },
    estimateDuration: { type: Number, default: 0 },
    estimatedPrice: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(STATUS), default: STATUS.REQUESTED}
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);
export default Appointment;
