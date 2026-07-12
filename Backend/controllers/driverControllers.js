const prisma = require("../config/prisma");
const { Prisma } = require("@prisma/client");

// Create Driver
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


        // Safety score validation
        if (
            safetyScore !== undefined &&
            (safetyScore < 0 || safetyScore > 100)
        ) {
            return res.status(400).json({
                message: "Safety score must be between 0 and 100"
            });
        }


        // License expiry validation
        const expiry = new Date(licenseExpiryDate);

        if (expiry < new Date()) {
            return res.status(400).json({
                message: "License already expired"
            });
        }


        // Check duplicate license
        const existing = await prisma.driver.findUnique({
            where: {
                license_number: licenseNumber
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
                license_number: licenseNumber,
                license_category: licenseCategory,
                license_expiry: expiry,
                contact_number: contactNumber,
                safety_score: new Prisma.Decimal(safetyScore ?? 100),
                status: status ?? "Available"
            }
        });


        res.status(201).json({
            message: "Driver created successfully",
            driver
        });


    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



// Get all drivers
const getDrivers = async (req, res) => {
    try {

        const drivers = await prisma.driver.findMany({
            orderBy: {
                id: "asc"
            }
        });


        res.status(200).json(drivers);


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};



// Get single driver
const getDriver = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const driver = await prisma.driver.findUnique({
            where: {
                id
            }
        });


        if (!driver) {
            return res.status(404).json({
                message: "Driver not found"
            });
        }


        res.status(200).json({
            success: true,
            driver
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};



// Update driver
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
            where: {
                id
            }
        });


        if (!driver) {
            return res.status(404).json({
                message: "Driver not found"
            });
        }


        // Check duplicate license
        if (licenseNumber) {

            const duplicate = await prisma.driver.findFirst({
                where: {
                    license_number: licenseNumber,
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
        }



        const updatedDriver = await prisma.driver.update({

            where: {
                id
            },


            data: {
                name,
                license_number: licenseNumber,
                license_category: licenseCategory,
                license_expiry: licenseExpiryDate
                    ? new Date(licenseExpiryDate)
                    : undefined,
                contact_number: contactNumber,
                safety_score: safetyScore !== undefined
                    ? new Prisma.Decimal(safetyScore)
                    : undefined,
                status
            }

        });


        res.status(200).json({
            message: "Driver updated successfully",
            driver: updatedDriver
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



// Delete driver
const deleteDriver = async (req, res) => {

    try {

        const id = Number(req.params.id);


        const driver = await prisma.driver.findUnique({
            where: {
                id
            }
        });


        if (!driver) {
            return res.status(404).json({
                message: "Driver not found"
            });
        }


        await prisma.driver.delete({
            where: {
                id
            }
        });


        res.status(200).json({
            message: "Driver deleted successfully"
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



module.exports = {
    createDriver,
    getDrivers,
    getDriver,
    updateDriver,
    deleteDriver
};