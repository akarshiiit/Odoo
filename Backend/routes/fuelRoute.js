const express = require('express');
const { requireAuth } = require('../middleware/middleware');
const fuelController = require('../controllers/fuelControllers');

const router = express.Router();
// router.use(requireAuth);

router.get('/', fuelController.getfuel);
router.get('/vehicle/:vehicleId', fuelController.getFuelByVehicle);
router.post('/', fuelController.createfuel);

module.exports = router;
