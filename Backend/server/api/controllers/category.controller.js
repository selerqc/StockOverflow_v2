const CategoryService = require("../../services/category.service");

const CategoryController = {
  AddCategory: async (req, res) => {
    const newCategory = await CategoryService.addCategory(req.body, req.user._id);

    res.status(201).json({
      status: "success",
      message: "Category added successfully",
      data: newCategory,
    });
  },

  GetAllCategory: async (req, res) => {
    const getCategory = await CategoryService.getAllCategories();

    res.status(200).json({
      status: "success",
      message: "Category count per product retrieved successfully",
      getCategory,
    });
  },

  UpdateCategory: async (req, res) => {
    const updatedCategory = await CategoryService.updateCategory(
      req.params.id,
      req.body,
      req.user._id
    );

    res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      category: updatedCategory,
    });
  },

  DeleteOneCategory: async (req, res) => {
    const deletedCategory = await CategoryService.deleteCategory(
      req.params.id,
      req.user._id
    );

    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  },
  
  AddManyCategory: async (req, res) => {
    const categories = Array.isArray(req.body) ? req.body : [];
    console.log(categories);
    
    const newCategories = await CategoryService.addManyCategories(categories, req.user._id);

    res.status(201).json({
      status: "success",
      message: "Categories added successfully",
      data: newCategories,
    });
  },
};

module.exports = CategoryController;
