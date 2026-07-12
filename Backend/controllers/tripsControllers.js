const prisma = require('../config/prisma');

const restore = (vehicleId, driverId) => [
  prisma.vehicle.update({ where: { id: vehicleId }, data: { status: 'Available' } }),
  prisma.driver.update({ where: { id: driverId }, data: { status: 'Available' } }),
];

// GET /api/trips
exports.getTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: { vehicle: true, driver: true },
      orderBy: { created_at: 'desc' },
    });
    res.json({ success: true, trips });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/trips — create + dispatch in one step
exports.createTrip = async (req, res) => {
  const { source, destination, cargoWeight, plannedDistance, vehicleId, driverId } = req.body;

  try {
    const [vehicle, driver] = await Promise.all([
      prisma.vehicle.findUnique({ where: { id: parseInt(vehicleId) } }),
      prisma.driver.findUnique({ where: { id: parseInt(driverId) } }),
    ]);

    if (!vehicle) return res.status(404).json({ success: false, error: 'Vehicle not found' });
    if (!driver) return res.status(404).json({ success: false, error: 'Driver not found' });

    if (['Retired', 'In Shop', 'On Trip'].includes(vehicle.status)) {
      return res.status(400).json({ success: false, error: `Vehicle is ${vehicle.status}` });
    }
    if (['Suspended', 'On Trip'].includes(driver.status)) {
      return res.status(400).json({ success: false, error: `Driver is ${driver.status}` });
    }
    if (new Date(driver.license_expiry) < new Date()) {
      return res.status(400).json({ success: false, error: 'Driver license expired' });
    }
    if (parseFloat(cargoWeight) > parseFloat(vehicle.max_load_capacity)) {
      return res.status(400).json({
        success: false,
        error: `Cargo weight ${cargoWeight}kg exceeds capacity ${vehicle.max_load_capacity}kg`,
      });
    }

    const trip = await prisma.$transaction(async (tx) => {
      const newTrip = await tx.trip.create({
        data: { 
          source, 
          destination, 
          cargo_weight: parseFloat(cargoWeight), 
          planned_distance: parseFloat(plannedDistance), 
          vehicle: { connect: { id: parseInt(vehicleId) } }, 
          driver: { connect: { id: parseInt(driverId) } }, 
          status: 'Dispatched' 
        },
      });
      await tx.vehicle.update({ where: { id: parseInt(vehicleId) }, data: { status: 'On Trip' } });
      await tx.driver.update({ where: { id: parseInt(driverId) }, data: { status: 'On Trip' } });
      return newTrip;
    });

    res.status(201).json({ success: true, trip });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// PUT /api/trips/:id/complete
exports.completeTrip = async (req, res) => {
  const id = parseInt(req.params.id);
  const { actualDistance } = req.body;

  try {
    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip) return res.status(404).json({ success: false, error: 'Trip not found' });
    if (trip.status !== 'Dispatched') {
      return res.status(400).json({ success: false, error: 'Only dispatched trips can be completed' });
    }

    const [updated] = await prisma.$transaction([
      prisma.trip.update({
        where: { id },
        data: { status: 'Completed', completed_at: new Date(), actual_distance: actualDistance || trip.planned_distance },
      }),
      ...restore(trip.vehicle_id, trip.driver_id),
    ]);

    res.json({ success: true, trip: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// PUT /api/trips/:id/cancel
exports.cancelTrip = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip) return res.status(404).json({ success: false, error: 'Trip not found' });
    if (!['Draft', 'Dispatched'].includes(trip.status)) {
      return res.status(400).json({ success: false, error: 'Cannot cancel a completed trip' });
    }

    const [updated] = await prisma.$transaction([
      prisma.trip.update({ where: { id }, data: { status: 'Cancelled' } }),
      ...restore(trip.vehicle_id, trip.driver_id),
    ]);

    res.json({ success: true, trip: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};