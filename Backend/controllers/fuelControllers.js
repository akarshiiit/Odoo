const prisma = require('../config/prisma');

// GET /api/fuel
exports.getfuel = async (req, res) => {
  try {
    const logs = await prisma.fuelLog.findMany({ include: { vehicle: true }, orderBy: { date: 'desc' } });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/fuel/vehicle/:vehicleId
exports.getFuelByVehicle = async (req, res) => {
  try {
    const logs = await prisma.fuelLog.findMany({
      where: { vehicleId: parseInt(req.params.vehicleId) },
      orderBy: { date: 'desc' },
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/fuel
exports.createfuel = async (req, res) => {
  try {
    const { vehicleId, liters, cost, tolls } = req.body;
    const log = await prisma.fuelLog.create({
      data: { 
        vehicle: { connect: { id: parseInt(vehicleId) } }, 
        liters: parseFloat(liters), 
        cost: parseFloat(cost), 
        tolls: tolls ? parseFloat(tolls) : 0,
        date: new Date() 
      },
      include: { vehicle: true },
    });
    res.status(201).json(log);
  } catch (error) {
    console.error("PRISMA ERROR:", error);
    res.status(400).json({ error: error.message, stack: error.stack });
  }
};