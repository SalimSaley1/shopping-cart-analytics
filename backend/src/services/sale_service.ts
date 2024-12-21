import { ISale, Sale } from "../models/sale_model";
import {Product} from "../models/product_model";



// optimisé
export async function getTotalSales(startDate: Date, endDate: Date): Promise<number> {
    try {
        const sales = await Sale.aggregate([
            {
                $addFields: {
                    parsedDate: {
                        $dateFromString: {
                            dateString: "$Date", // Conversion des chaînes en date
                            format: "%Y-%m-%d",
                        },
                    },
                },
            },
            {
                $match: {
                    parsedDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
                },
            },
            {
                $project: {
                    _id: 0,
                    ProductID: 1,
                    Quantity: 1,
                },
            },
        ]);

        const products = await Product.aggregate([
            {
                $project: {
                    _id: 0,
                    ProductID: 1,
                    Price: 1,
                },
            },
        ]);
        // convertir le tableau products en Map de prix par id, fromEntries = fromTab
        const productMap = Object.fromEntries(products.map(p => [p.ProductID, p]));

        // fusion de products et sales puis calcul du cout elementaire de vente
        const saleCosts = sales.map(sale =>
            (parseFloat( productMap[sale.ProductID]?.Price ) || 0) * parseFloat(sale.Quantity)
        );


        // Extraire les valeurs et les réduire pour calculer le total
        const totalSaleCosts = saleCosts.reduce((acc, saleCost) => acc + saleCost, 0);


        return totalSaleCosts;
    } catch (error) {
        throw new Error("Failed to calculate total sales.");
    }
}


// ancien optimisé
export const getTopProducts = async (startDate: Date, endDate: Date, top: number): Promise<any[]> => {
    try {
        const result = await Sale.aggregate([
            {
                $addFields: {
                    // Convertir la chaîne "Date" en objet Date
                    parsedDate: {
                        $dateFromString: {
                            dateString: "$Date",
                            format: "%Y-%m-%d",
                        },
                    },
                },
            },
            {
                $match: {
                    parsedDate: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                },
            },
            {
                $group: {
                    _id: "$ProductID",
                    totalQuantity: { $sum: { $toInt: "$Quantity" } },
                },
            },
            {
                $sort: { totalQuantity: -1 },
            },
            {
                $limit: top,
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "ProductID",
                    as: "productDetails", // Résultat fusionné
                },
            },
            {
                $unwind: "$productDetails", // Décompresser les résultats du lookup
            },
            {
                $project: {
                    name: "$productDetails.ProductName",
                    category: "$productDetails.Category",
                    totalQuantity: 1,
                },
            },
        ]);

        return result;
    } catch (error : any) {
        throw new Error(`Failed to calculate top products: ${error.message}`);
    }
};


export const getTotalSalesQuantity = async (startDate: Date, endDate: Date): Promise<number> => {
    try {
        const result = await Sale
            .aggregate([
                {
                    $addFields: {
                        // Convertir la chaîne "Date" en objet Date
                        parsedDate: {
                            $dateFromString: {
                                dateString: "$Date",
                                format: "%Y-%m-%d",
                            },
                        },
                    },
                },
                {
                    $match: {
                        parsedDate: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate),
                        },
                    },
                },
                {
                    $group: {
                        _id: null, // Pas de regroupement par champ
                        totalSalesQuantity: { $sum: { $toDouble: "$Quantity" } },
                    },
                },
            ]);

        return result.length > 0 ? result[0].totalSalesQuantity : 0;
    } catch (error) {
        throw new Error("Failed to calculate total sales quantity.");
    }
}

// Optimisé
export const getSalesPercentageByCategory = async (startDate: Date, endDate: Date): Promise<{ category: string; percentage: number }[]> => {
    try {

        const sales = await Sale.aggregate([
            {
                $addFields: {
                    parsedDate: {
                        $dateFromString: {
                            dateString: "$Date", // Conversion des chaînes en date
                            format: "%Y-%m-%d",
                        },
                    },
                },
            },
            {
                $match: {
                    parsedDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
                },
            },
            {
                $project: {
                    _id: 0,
                    ProductID: 1,
                    Quantity: 1,
                },
            },
        ]);

        const products = await Product.aggregate([
            {
                $project: {
                    _id: 0,
                    ProductID: 1,
                    Category: 1,
                    Price: 1,
                },
            },
        ]);
        // convertir le tableau products en Map, fromEntries = from paire clé valeur [.., ..]
        const productMap = Object.fromEntries(products.map(p => [p.ProductID, p]));

        // fusion de products et sales puis calcul du cout elementaire de vente
        const combinedSales = sales.map(sale => ({
            Category: productMap[sale.ProductID]?.Category || 'Unknown',
            SaleCost: (parseFloat( productMap[sale.ProductID]?.Price ) || 0) * parseFloat(sale.Quantity)
        }));

        const combinedSalesMap: Record<string, number> = {}

        // regroupement par categorie et calcul de la somme totale
        combinedSales.forEach(sale => {
            const category = sale.Category;
            const saleCost  = sale.SaleCost

            if (combinedSalesMap[category]) {
                combinedSalesMap[category] += saleCost; // Ajouter à la somme existante
            } else {
                combinedSalesMap[category] = saleCost; // Initialiser avec la première valeur
            }
        });


        // Extraire les valeurs et les réduire pour calculer le total
        const totalSaleCost = Object.values(combinedSalesMap)
            .reduce((acc, saleCost) => acc + saleCost, 0);

        // Convertir la Map en tableau d'ojets et calcul de pourcentage
        const result = Object.entries(combinedSalesMap).map(([Category, saleCost]) => ({
            category: Category,
            percentage: (saleCost / totalSaleCost) * 100,
        }));

        return result;
    } catch (error) {
        throw new Error('Failed to calculate sales percentage by category.');
    }
}


export const createSale = async (saleData: ISale): Promise<ISale> => {
    try {
        const sale = new Sale(saleData);
        return await sale.save();
    } catch (error) {
        throw new Error('Error creating sale');
    }
};


export const getSaleById = async (saleId: number): Promise<ISale | null> => {
    try {
        return await Sale.findOne({ saleId });
    } catch (error) {
        throw new Error('Error fetching sale');
    }
};


export const getAllSales = async (): Promise<ISale[]> => {
    try {
        return await Sale.find();
    } catch (error) {
        throw new Error('Error fetching sales');
    }
};


export const updateSale = async (saleId: number, updatedData: ISale): Promise<ISale | null> => {
    try {
        return await Sale.findOneAndUpdate({ saleId }, updatedData, { new: true });
    } catch (error) {
        throw new Error('Error updating sale');
    }
};


export const deleteSale = async (saleId: number): Promise<ISale | null> => {
    try {
        return await Sale.findOneAndDelete({ saleId });
    } catch (error) {
        throw new Error('Error deleting sale');
    }
};






