const express = require('express');
const router = express.Router();
const { createFood, getAllFood, updateFood,getFood,deleteFood } = require('../controllers/food.controller');


router.get("/",getAllFood);
router.get("/:id",getFood);
router.post("/",createFood);
router.put("/:id",updateFood);
router.delete("/:id",deleteFood);

module.exports = router;