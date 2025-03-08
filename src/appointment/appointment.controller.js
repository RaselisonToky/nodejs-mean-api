import appointmentService from "./appointment.service.js";

class AppointmentController{
    async getAll(req, res){
        try{
            const appointments = await appointmentService.getAll();
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
}
export default new AppointmentController();
