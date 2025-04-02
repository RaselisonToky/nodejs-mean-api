import Appointment, {STATUS} from "../appointment.entitiy.js";

class AppointmentRepository{

    async getDailyRevenueMongoDB(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        start.setUTCHours(0, 0, 0, 0);
        end.setUTCHours(23, 59, 59, 999);
        const pipeline = [
            {
                $match: {
                    scheduleAt: { $gte: start, $lte: end },
                    status: STATUS.COMPLETED
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$scheduleAt" } },
                    value: { $sum: "$estimatedPrice" }
                }
            },
            {
                $project: {
                    _id: 0,
                    key: "$_id",
                    value: 1
                }
            },
            {
                $sort: {
                    key: 1
                }
            }
        ];
        const aggregatedResults = await Appointment.aggregate(pipeline).exec();
        const revenueMap = new Map(aggregatedResults.map(item => [item.key, item.value]));
        const completeResults = [];
        let currentDate = new Date(start);
        while (currentDate <= end) {
            const dateStr = currentDate.toISOString().split('T')[0];
            completeResults.push({
                key: dateStr,
                value: revenueMap.get(dateStr) || 0
            });
            currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        }
        return completeResults;
    }
}

export default new AppointmentRepository();
