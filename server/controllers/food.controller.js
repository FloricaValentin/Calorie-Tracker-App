const Food = require("../models/foods.collection.js");

// Add Food
const createFood = async (req, res) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        food,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

//Get All Food
const getAllFood = async (req, res) => {
  try {
    let foods;
    const searchTerm = req.query.search;

    if (searchTerm) {
      foods = await Food.find({
        name: { $regex: `^${searchTerm}`, $options: "i" },
      });
    } else {
      foods = await Food.find();
    }

    res.status(200).json({
      status: "success",
      results: foods.length,
      data: {
        foods,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// Get Single Food
const getFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({
        status: "fail",
        message: "Food not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        food,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// Update Food
const updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!food) {
      return res.status(404).json({
        status: "fail",
        message: "Food not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        food,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

//Delete Food
const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({
        status: "fail",
        message: "Food not found",
      });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = {
  createFood,
  getAllFood,
  getFood,
  updateFood,
  deleteFood,
};
