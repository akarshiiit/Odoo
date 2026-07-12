const express = require("express");
const router = express.Router();

const {
    createVehicle,
    getVehicles,
    getVehicle,
    updateVehicle,
    deleteVehicle
} = require("../controllers/vehicleControllers");

router.post("/", createVehicle);
router.get("/", getVehicles);
router.get("/:id", getVehicle);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

module.exports = router;