const express = require("express");

const router = express.Router();


const {
    createMaintenance,
    getMaintenanceLogs,
    getMaintenanceLog,
    completeMaintenance
} = require("../controllers/maintenanceControllers");



router.post("/", createMaintenance);

router.get("/", getMaintenanceLogs);

router.get("/:id", getMaintenanceLog);

router.patch("/:id/complete", completeMaintenance);



module.exports = router;