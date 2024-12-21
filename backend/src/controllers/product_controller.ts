import {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductsSalesTable
} from '../services/product_service';

export const createProductController = async (req: any, res: any) => {
  try {
    const productData = req.body;
    const newProduct = await createProduct(productData);
    return res.status(201).json(newProduct);
  } catch (error) {
    if (error instanceof Error) 
    return res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};


export const getProductByIdController = async (req: any, res:any) => {
  try {
    const { productId } = req.params;
    const product = await getProductById(Number(productId));
    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    if (error instanceof Error) 
    return res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

export const getAllProductsController = async (req: any, res:any) => {
  try {
    const products = await getAllProducts();
    return res.status(200).json(products);
  } catch (error) {
    if (error instanceof Error) 
    return res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

export const updateProductController = async (req: any, res:any) => {
  try {
    const { productId } = req.params;
    const updatedData = req.body;
    const updatedProduct = await updateProduct(Number(productId), updatedData);
    if (updatedProduct) {
      return res.status(200).json(updatedProduct);
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    if (error instanceof Error) 
    return res.status(500).json({ message: 'Failed to update product', error: error.message });
    
  }
};

export const deleteProductController = async (req: any, res:any) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await deleteProduct(Number(productId));
    if (deletedProduct) {
      return res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    if (error instanceof Error) {

        console.error(error.message);
        return res.status(500).json({ message: 'Failed to delete product', error: error.message });
      }
    
  }
};


export const getProductsTableController = async (req: any, res:any) => {
  try {
    const {startDate, endDate} = req.query

    if (!startDate || !endDate) {
      res.status(400).json({ message: "Both startDate and endDate are required." });
      return;
    }

    const productsSalesTable = await getProductsSalesTable(startDate, endDate);
    return res.status(200).json( productsSalesTable );

  } catch (error: any) {
    res.status(500).json({message: "Failed to fetch products sales table.", error: error.message,});
  }

}

