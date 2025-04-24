const categoryModel = require("../../models/category.model");

const CategoryController = {
  AddCategory: async (req, res) => {
    const { name, description } = req.body;

    const newCategory = await categoryModel.create({
      user_id: req.user._id,
      name,
      description,
    });

    res.status(201).json({
      status: "success",
      message: "Category added successfully",
      data: newCategory,
    });
  },

  GetAllCategory: async (req, res) => {
    const getCategory = await categoryModel.find({
      user_id: req.user._id,
    });

    res.status(200).json({
      status: "success",
      message: "Category count per product retrieved successfully",
      getCategory,
    });
  },

  UpdateCategory: async (req, res) => {
    const { name, description } = req.body;

    const updatedCategory = await categoryModel.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      { name, description },
      { new: true }
    );

    if (!updatedCategory) throw "Category not found";

    res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      category: updatedCategory,
    });
  },

  DeleteOneCategory: async (req, res) => {
    const deletedCategory = await categoryModel.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!deletedCategory) throw "Category not found";

    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  },
};

module.exports = CategoryController;
