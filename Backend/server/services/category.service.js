const categoryModel = require("../models/category.model");

const CategoryService = {
  async addCategory(categoryData, userId) {
    const { name, description } = categoryData;

    const findDuplicateName = await categoryModel.findOne({
      user_id: userId,
      name: name,
    });

    if (findDuplicateName) throw "Category already exists";

    return await categoryModel.create({
      user_id: userId,
      name,
      description,
    });
  },

  async getAllCategories() {
    return await categoryModel.find({});
  },

  async updateCategory(categoryId, categoryData, userId) {
    const { name, description } = categoryData;

    const updatedCategory = await categoryModel.findOneAndUpdate(
      { _id: categoryId, user_id: userId },
      { name, description },
      { new: true }
    );

    if (!updatedCategory) throw "Category not found";

    return updatedCategory;
  },

  async deleteCategory(categoryId, userId) {
    const deletedCategory = await categoryModel.findOneAndDelete({
      _id: categoryId,
      user_id: userId,
    });

    if (!deletedCategory) throw "Category not found";

    return deletedCategory;
  },

  async addManyCategories(categories, userId) {

    const categoryPromises = categories.map(category => {
      const { name, description } = category;

      return categoryModel.create({
        user_id: userId,
        name,
        description,
      });
    });

    return await Promise.all(categoryPromises);
  }
};

module.exports = CategoryService;