const ProductService = require("../../services/product.service");

const ProductsController = {
  GetProductStatus: async (req, res) => {
    const productStatus = await ProductService.getProductStatus(req.user._id);

    res.status(200).json({
      message: "Product status retrieved successfully",
      productCount: productStatus.productCount,
      lowStockCount: productStatus.lowStockCount,
      getProductsThatHaveLowStock: productStatus.getProductsThatHaveLowStock,
    });
  },

  GetAllProducts:  async (req, res) => {
  

    const products = await ProductService.getAllProducts();
    res.status(200).json({
      message: "Products retrieved successfully",
      product: products,
    });
  },

  AddProduct: async (req, res) => {
    const addProduct = await ProductService.addProduct(req.body, req.user._id);

    res.status(201).json({
      status: "success",
      message: "Product added successfully",
      product: addProduct.createdAt,
    });
  },
  
  AddManyProducts: async (req, res) => {
    const products = Array.isArray(req.body) ? req.body : [];
    console.log(products);
    
    const createdProducts = await ProductService.addManyProducts(products, req.user._id);
    
    res.status(201).json({
      status: "success",
      message: "Products added successfully",
      products: products,
    });
  },

  UpdateProduct: async (req, res) => {
    try {
      const updatedProduct = await ProductService.updateProduct(
        req.params.id,
        req.body,
        req.user._id
      );

      res.status(200).json({
        status: "success",
        message: "Product updated successfully",
        product: updatedProduct.updatedAt,
      });
    } catch (error) {
      throw error;
    }
  },

  DeleteProduct: async (req, res) => {
    const { id } = req.params;
    
    const product = await ProductService.deleteProduct(id, req.user._id);

    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
      product,
    });
  },
};

module.exports = ProductsController;
