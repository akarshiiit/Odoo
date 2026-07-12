const prisma = require("../config/prisma");

const createDriver = async (req, res) => {
    try {

        const {
            name,
            licenseNumber,
            licenseCategory,
            licenseExpiryDate,
            contactNumber,
            safetyScore,
            status
        } = req.body;

        if (safetyScore !== undefined && safetyScore < 0 && safetyScore > 100) {
            return res.status(400).json({
                message: "Safety score must be between 0 and 100"
            });
        }

        //Expiry license
        const expiry = new Date(licenseExpiryDate);
        if (expiry < new Date()) {
            return res.status(400).json({
                message: "License already expired"
            });
        }

        //Checking existing License
        const existing = await prisma.driver.findUnique({
            where: {
                licenseNumber
            }
        });

        if (existing) {
            return res.status(400).json({
                message: "License number already exists"
            });
        }

        const driver = await prisma.driver.create({
            data: {
                name,
                licenseNumber,
                licenseCategory,
                licenseExpiryDate: expiry,
                contactNumber,
                safetyScore: safetyScore ?? 100,
                status: status ?? "Available"
            }
        });

        res.status(201).json({
            message: "Driver created successfully",
            driver
        });

    } catch (error) {
        res.status(500).json({
            message: err.message
        });
    }
}

const getDrivers = async (req, res) => {
    try {

        const drivers = await prisma.driver.findMany({
            orderBy: {
                id: "asc"
            }
        });

        res.json(drivers);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};

const getDriver = async (req, res) => {
    try {
        const driver = await prisma.driver.findUnique({
            id: Number(req.params.id)
        })

        if (!driver) {
            return res.status(404).json({
                message: "Driver not found"
            });
        }

        res.status(200).json({
            success: true,
            driver
        })
    } catch (error) {

        res.status(500).json({
            message: err.message
        });

    }
}

const updateDriver = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const {
            name,
            licenseNumber,
            licenseCategory,
            licenseExpiryDate,
            contactNumber,
            safetyScore,
            status
        } = req.body;

        const driver = await prisma.driver.findUnique({
            where: { id }
        });

        if (!driver) {
            return res.status(404).json({
                message: "Driver not found"
            });
        }

        const duplicate = await prisma.driver.findFirst({
            where: {
                licenseNumber,
                NOT: {
                    id
                }
            }
        });

        if (duplicate) {
            return res.status(400).json({
                message: "License number already exists"
            });
        }

        const updated = await prisma.driver.update({

            where: { id },

            data: {
                name,
                licenseNumber,
                licenseCategory,
                licenseExpiryDate: new Date(licenseExpiryDate),
                contactNumber,
                safetyScore,
                status
            }

        });

        res.json({
            message: "Driver updated successfully",
            driver: updated
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

const deleteDriver = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const driver = await prisma.driver.findUnique({
            where: { id }
        });

        if (!driver) {
            return res.status(404).json({
                message: "Driver not found"
            });
        }

        await prisma.driver.delete({
            where: { id }
        });

        res.json({
            message: "Driver deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

module.exports = {
    createDriver,
    getDrivers,
    getDriver,
    updateDriver,
    deleteDriver
}