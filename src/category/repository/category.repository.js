import Category from "../category.entity.js";

class CategoryRepository {

    async countServiceByCategoriesInTaskCollectionMongoDB(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return Category.aggregate([
            {
                $lookup: {
                    from: "services",
                    localField: "_id",
                    foreignField: "category",
                    as: "services"
                }
            },
            {
                $unwind: {
                    path: "$services",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "tasks",
                    let: { serviceId: "$services._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$service", "$$serviceId"] },
                                        { $eq: ["$status", "COMPLETED"] },
                                        { $gte: ["$finish_time", start] },
                                        { $lte: ["$finish_time", end] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "filteredTasks"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    backgroundColor: { $first: "$backgroundColor" },
                    borderColor: { $first: "$borderColor" },
                    color: { $first: "$color" },
                    count: { $sum: { $size: "$filteredTasks" } }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    count: 1
                }
            }
        ]);
    }

}

export default new CategoryRepository();
