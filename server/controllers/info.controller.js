const Info = require("../models/infos.collection.js");
const bcrypt = require("bcrypt");

// Get All Infos
const getInfos = async (req, res) => {
  try {
    const infos = await Info.find({ userId: req.user.id });
    res.status(200).json(infos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Add Info
const postInfo = async (req, res) => {
  try {
    const {
      height,
      weight,
      age,
      gender,
      activityType,
      goal,
      dailyCalorieGoal,
    } = req.body;
    const info = await Info.create({
      userId: req.user.id, // Include user's ID
      height,
      weight,
      age,
      gender,
      activityType,
      goal,
      dailyCalorieGoal,
    });
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update Info
const updateInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInfo = await Info.findByIdAndUpdate(id, req.body, {
      new: true,
      upsert: true,
    });
    res.status(200).json(updatedInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Delete Info
const deleteInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const info = await Info.findByIdAndDelete(id);
    if (!info) {
      return res.status(404).json({ message: "Info not found" });
    }
    res.status(200).json({ message: "Info was deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getInfos, postInfo, updateInfo, deleteInfo };
