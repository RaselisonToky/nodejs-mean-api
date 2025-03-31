import appointmentService from "./appointment.service.js";
import AppointmentService from "./appointment.service.js";
import {bindAll} from "express-validator/lib/utils.js";

class AppointmentController{
    async getAll(req, res){
        try{
            const startDate = req.body.startDate;
            const endDate = req.body.endDate;
            const appointments = await appointmentService.getAll(startDate, endDate);
            res.json({
                success: true,
                data: appointments,
                count: appointments.length
            })
        }catch (error){
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération des rendez-vous', error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const appointment = await appointmentService.getById(req.params.id);
            res.json({
                success: true,
                data: appointment
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération du rendez-vous', error: error.message });
        }
    }

    async create(req, res) {
        try {
            const newAppointment = await appointmentService.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Rendez-vous créée avec succès',
                data: newAppointment
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Erreur lors de la création du rendez-vous',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const updatedAppointment = await appointmentService.update(req.params.id, req.body);
            if (!updatedAppointment) {
                return res.status(404).json({
                    success: false,
                    message: 'Rendez-vous non trouvée'
                });
            }
            res.json({
                success: true,
                message: 'Rendez-vous mise à jour avec succès',
                data: updatedAppointment
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Erreur lors de la mise à jour du rendez-vous',
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const deletedAppointment = await appointmentService.deleteById(req.params.id);
            if (!deletedAppointment) {
                return res.status(404).json({
                    success: false,
                    message: 'Rendez-vous non trouvée'
                });
            }
            res.json({
                success: true,
                message: 'Rendez-vous supprimée avec succès'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la suppression du rendez-vous',
                error: error.message
            });
        }
    }

    async getAvailableTimeSlots(req, res){
        try {
            const date = req.params.filter_date;
            const selectedDate = new Date(date);
            const availableTimeSlots = await appointmentService.getAvailableTimeSlots(selectedDate);
            return res.status(200).json({
                success: true,
                data: availableTimeSlots
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Erreur serveur lors de la récupération des créneaux disponibles',
                error: error.message
            });
        }
    }

    async getAppointmentCountByStatus(req, res){
        try {
            const data = await AppointmentService.getAppointmentCountByStatus();
            res.json({
                success: true,
                data,
            })
        }catch (error){
            console.log(error)

            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récperation des nombre de rendez-vous par status',
                error: error.message
            })
        }
    }
}
export default new AppointmentController();
