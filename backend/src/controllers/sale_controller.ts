import {
    createSale,
    getSaleById,
    getAllSales,
    updateSale,
    deleteSale,
    getSalesPercentageByCategory,
    getTotalSales,
    getTotalSalesQuantity,
    getTopProducts,
} from '../services/sale_service';

export const createSaleController = async (req: any, res: any) => {
    try {
        const saleData = req.body;
        const newSale = await createSale(saleData);
        return res.status(201).json(newSale);
    } catch (error) {
        if (error instanceof Error)
            return res.status(500).json({ message: 'Failed to create sale', error: error.message });
    }
};


export const getSaleByIdController = async (req: any, res:any) => {
    try {
        const { saleId } = req.params;
        const sale = await getSaleById(Number(saleId));
        if (sale) {
            return res.status(200).json(sale);
        } else {
            return res.status(404).json({ message: 'Sale not found' });
        }
    } catch (error) {
        if (error instanceof Error)
            return res.status(500).json({ message: 'Failed to fetch sale', error: error.message });
    }
};

export const getAllSalesController = async (req: any, res:any) => {
    try {
        const sales = await getAllSales();
        return res.status(200).json(sales);
    } catch (error) {
        if (error instanceof Error)
            return res.status(500).json({ message: 'Failed to fetch sales', error: error.message });
    }
};

export const updateSaleController = async (req: any, res:any) => {
    try {
        const { saleId } = req.params;
        const updatedData = req.body;
        const updatedSale = await updateSale(Number(saleId), updatedData);
        if (updatedSale) {
            return res.status(200).json(updatedSale);
        } else {
            return res.status(404).json({ message: 'Sale not found' });
        }
    } catch (error) {
        if (error instanceof Error)
            return res.status(500).json({ message: 'Failed to update sale', error: error.message });

    }
};

export const deleteSaleController = async (req: any, res:any) => {
    try {
        const { saleId } = req.params;
        const deletedSale = await deleteSale(Number(saleId));
        if (deletedSale) {
            return res.status(200).json({ message: 'Sale deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Sale not found' });
        }
    } catch (error) {
        if (error instanceof Error) {

            return res.status(500).json({ message: 'Failed to delete sale', error: error.message });
        }

    }
};

export const getTotalSalesController = async (req: any, res:any) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            res.status(400).json({ message: "Both startDate and endDate are required." });
            return;
        }

        const totalSales = await getTotalSales(startDate, endDate);

        return res.status(200).json({totalSales});
    } catch (error) {
        if (error instanceof Error)
            return res.status(500).json({ message: 'Failed to calculate total sales', error: error.message });
    }
}

export const getTrendingProductsController = async (req: any, res:any) => {
    try {
        const top = 5;
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            res.status(400).json({ message: "Both startDate and endDate are required." });
            return;
        }
        const topProducts = await getTopProducts(startDate, endDate, top);

        return res.status(200).json( topProducts );
    } catch (error: any) {
        res.status(500).json({message: "Failed to fetch top products.", error: error.message,});
    }

}

export const getTotalSalesQuantityController = async (req: any, res:any) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            res.status(400).json({ message: "Both startDate and endDate are required." });
            return;
        }

        const totalSalesQuantity = await getTotalSalesQuantity(startDate, endDate);

        return res.status(200).json({totalSalesQuantity});
    } catch (error) {
        if (error instanceof Error)
            return res.status(500).json({ message: 'Failed to calculate total sales quantity.', error: error.message });
    }
}


export const getCategorySalesController = async (req: any, res: any) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            res.status(400).json({ message: "Both startDate and endDate are required." });
            return;
        }

        const percentages = await getSalesPercentageByCategory(startDate, endDate);

        return res.status(200).json( percentages );
    } catch (error) {
    if (error instanceof Error)
        return res.status(500).json({ message: 'Failed to calculate sales percentage by category.', error: error.message });
    }
};



