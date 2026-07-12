const express = require('express');
const { requireAuth } = require('../middleware/middleware');
const tripController = require('../controllers/tripsControllers');

const router = express.Router();

// router.use(requireAuth);

router.get('/', tripController.getTrips);
router.post('/', tripController.createTrip);
router.put('/:id/complete', tripController.completeTrip);
router.put('/:id/cancel', tripController.cancelTrip);

module.exports = router;