const express = require("express");
const router = express.Router();
const Info = require("../models/infos.collection")

const {
    getInfos,
    getInfo,
    postInfo,
    updateInfo,
    deleteInfo,
} =  require ("../controllers/info.controller")


router.get("/",getInfos);
router.post("/",postInfo);
router.put("/:id",updateInfo);
router.delete("/:id",deleteInfo);

module.exports = router;