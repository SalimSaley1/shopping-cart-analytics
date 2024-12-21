import { IProduct, Product } from "../models/product_model";
import {Sale} from "../models/sale_model";



/* optimisé  */
export async function getProductsSalesTable(startDate: Date, endDate: Date) {
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

    // Étape 1 : Construire une map avec les sommes par ProductID
    const salesMap: Record<string, number> = {};

    sales.forEach(item => {
      const productId = item.ProductID;
      const quantity = parseInt(item.Quantity);

      if (salesMap[productId]) {
        salesMap[productId] += quantity; // Ajouter à la somme existante
      } else {
        salesMap[productId] = quantity; // Initialiser avec la première valeur
      }
    });

// Étape 2 : Convertir salesMap en tableau (optionnel)
    const aggregatedSales = Object.entries(salesMap).map(([ProductID, totalQuantity]) => ({
      ProductID,
      totalQuantity,
    }));

    const products = await Product.aggregate([
      {
        $project: {
          _id: 0,
          ProductID: 1,
          ProductName: 1,
          Price: 1,
        },
      },
    ]);

    const productMap = Object.fromEntries(products.map(p => [p.ProductID, p]));

    const combinedData = aggregatedSales.map(sale => ({
      ProductID: sale.ProductID,
      ProductName: productMap[sale.ProductID]?.ProductName || 'Unknown',
      Price: productMap[sale.ProductID]?.Price || 0,
      TotalQuantity: sale.totalQuantity
    }));

    return combinedData;
  } catch (error) {
    throw new Error("Failed to fetch product sales data.");
    console.log(error)
  }
}

export const createProduct = async (productData: IProduct): Promise<IProduct> => {
  try {
    const product = new Product(productData);
    return await product.save();
  } catch (error) {
    throw new Error('Error creating product');
  }
};


export const getProductById = async (productId: number): Promise<IProduct | null> => {
  try {
    return await Product.findOne({ productId });
  } catch (error) {
    throw new Error('Error fetching product');
  }
};


export const getAllProducts = async (): Promise<IProduct[]> => {
  try {
    return await Product.find();
  } catch (error) {
    throw new Error('Error fetching products');
  }
};


export const updateProduct = async (productId: number, updatedData: IProduct): Promise<IProduct | null> => {
  try {
    return await Product.findOneAndUpdate({ productId }, updatedData, { new: true });
  } catch (error) {
    throw new Error('Error updating product');
  }
};


export const deleteProduct = async (productId: number): Promise<IProduct | null> => {
  try {
    return await Product.findOneAndDelete({ productId });
  } catch (error) {
    throw new Error('Error deleting product');
  }
};



