import Category from "../category.entity.js";

class CategoryRepository {

    /**
     * Regroupe les services par catégorie en fonction de l'intervalle de dates.
     *
     * Cette fonction agrège les données à partir de la collection Category et:
     * 1. Pour chaque catégorie, récupère les services associés créés dans l'intervalle de dates spécifié
     * 2. Calcule le nombre de services trouvés pour chaque catégorie
     * 3. Retourne une liste de toutes les catégories avec leur ID, nom et compteur de services
     *
     * @param {Date} startDate - Date de début de l'intervalle pour filtrer les services.
     * @param {Date} endDate - Date de fin de l'intervalle pour filtrer les services.
     * @returns {Promise<Array>} - Liste de toutes les catégories contenant:
     *   - _id: Identifiant MongoDB de la catégorie
     *   - name: Nom de la catégorie
     *   - count: Nombre de services associés créés dans l'intervalle de dates
     */
    async countServiceByCategoriesInTaskCollectionMongoDB(startDate, endDate) {
        return Category.aggregate([
            {
                $lookup: {
                    from: "services",
                    let: { categoryId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$category", "$$categoryId"] },
                                        { $gte: ["$createdAt", new Date(startDate)] },
                                        { $lte: ["$createdAt", new Date(endDate)] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "services"
                }
            },
            {
                $addFields: {
                    count: { $size: "$services" }
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
