const prisma = require("../config/prisma");
const { Prisma } = require("@prisma/client");

// Create Maintenance Record
const createMaintenance = async (req, res) => {
    try {
        const {
            vehicle_id,
            description,
            cost
        } = req.body;

        const vehicle = await prisma.vehicle.findUnique({
            where: {
                id: Number(vehicle_id)
            }
        });

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        if (vehicle.status === "In Shop") {
            return res.status(400).json({
                success: false,
                message: "Vehicle is already under maintenance"
            });
        }

        const maintenance = await prisma.$transaction(async (tx) => {

            const log = await tx.maintenanceLog.create({
                data: {
                    vehicle_id: Number(vehicle_id),
                    description,
                    cost: new Prisma.Decimal(cost),
                    status: "Active"
                },
                include:{
                    vehicle: true
                }
            });

            await tx.vehicle.update({
                where: {
                    id: Number(vehicle_id)
                },
                data: {
                    status: "In Shop"
                }
            });

            return log;
        });

        res.status(201).json({
            success: true,
            message: "Vehicle sent for maintenance",
            maintenance
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get all Maintenance Logs
const getMaintenanceLogs = async (req, res) => {
    try {
        const logs = await prisma.maintenanceLog.findMany({
            include: {
                vehicle: true
            },
            orderBy: {
                created_at: "desc"
            }
        });

        res.status(200).json({
            success: true,
            logs
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get Single Maintenance Log
const getMaintenanceLog = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const log = await prisma.maintenanceLog.findUnique({
            where: {
                id
            },
            include: {
                vehicle: true
            }
        });

        if (!log) {
            return res.status(404).json({
                success: false,
                message: "Maintenance record not found"
            });
        }

        res.status(200).json({
            success: true,
            log
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Complete Maintenance
const completeMaintenance = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const maintenance = await prisma.maintenanceLog.findUnique({
            where: {
                id
            },
            include: {
                vehicle: true
            }
        });

        if (!maintenance) {
            return res.status(404).json({
                success: false,
                message: "Maintenance record not found"
            });
        }

        const result = await prisma.$transaction(async (tx) => {

            const updatedLog = await tx.maintenanceLog.update({
                where: {
                    id
                },
                data: {
                    status: "Completed",
                    completed_at: new Date()
                }
            });

            await tx.vehicle.update({
                where: {
                    id: maintenance.vehicle_id
                },
                data: {
                    status: "Available"
                }
            });

            return updatedLog;
        });

        res.status(200).json({
            success: true,
            message: "Maintenance completed. Vehicle is available now",
            maintenance: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createMaintenance,
    getMaintenanceLogs,
    getMaintenanceLog,
    completeMaintenance
};