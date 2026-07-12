const db = require("../config/db");

const createVehicle = async (req, res) => {

    const {
        registration_number,
        vehicle_name,
        vehicle_type,
        max_load_capacity,
        odometer,
        acquisition_cost,
        status
    } = req.body;

    try {

        // Checking if the Registration number exists or not
        const existing = await db.query(
            "SELECT * FROM vehicles WHERE registration_number=$1",
            [registration_number]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({
                message: "Registration number already exists"
            })
        }

        // Allowed Status
        const allowedStatus = [
            "Available",
            "On Trip",
            "In Shop",
            "Retired"
        ];

        if (status && !allowedStatus.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Status must be one of: ${allowedStatus.join(", ")}`
            });
        }


        const result = await db.query(
            `INSERT INTO vehicles
            (registration_number,
            vehicle_name,
            vehicle_type,
            max_load_capacity,
            odometer,
            acquisition_cost,
            status)

            VALUES($1,$2,$3,$4,$5,$6,$7)

            RETURNING *`,
            [
                registration_number,
                vehicle_name,
                vehicle_type,
                max_load_capacity,
                odometer,
                acquisition_cost,
                status || "Available"
            ]
        );

        return res.status(201).json({
            status: true,
            message: result.rows[0]

        })


    } catch (error) {
        res.status(500).json({
            message: err.message
        });
    }
}

const getVehicles = async (req, res) => {
    const result = await db.query(
        "SELECT * FROM vehicles ORDER BY id"
    );

    res.status(201).json({
        success: true,
        message: result.rows
    })
}

const getVehicle = async (req, res) => {

    const result = await db.query(
        "SELECT * FROM vehicles WHERE id=$1",
        [req.params.id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            success: true,
            message: "Vehicle not found"
        })
    }

    res.status(200).json({
        success: true,
        message: result.rows[0]
    })
}

const updateVehicle = async (req, res) => {
    const {
        registration_number,
        vehicle_name,
        vehicle_type,
        max_load_capacity,
        odometer,
        acquisition_cost,
        status
    } = req.body;

    try {
        // Check if vehicle exists
        const vehicle = await db.query(
            "SELECT * FROM vehicles WHERE id = $1",
            [req.params.id]
        );

        if (vehicle.rows.length === 0) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        // Check if registration number already exists for another vehicle
        const existingReg = await db.query(
            `SELECT * FROM vehicles
             WHERE registration_number = $1
             AND id != $2`,
            [registration_number, req.params.id]
        );

        if (existingReg.rows.length > 0) {
            return res.status(400).json({
                message: "Registration number already exists"
            });
        }

        const result = await db.query(
            `UPDATE vehicles
             SET
                registration_number = $1,
                vehicle_name = $2,
                vehicle_type = $3,
                max_load_capacity = $4,
                odometer = $5,
                acquisition_cost = $6,
                status = $7
             WHERE id = $8
             RETURNING *`,
            [
                registration_number,
                vehicle_name,
                vehicle_type,
                max_load_capacity,
                odometer,
                acquisition_cost,
                status,
                req.params.id
            ]
        );

        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            vehicle: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const deleteVehicle = async (req, res) => {
    try {
        // Check if vehicle exists
        const vehicle = await db.query(
            "SELECT * FROM vehicles WHERE id = $1",
            [req.params.id]
        );

        if (vehicle.rows.length === 0) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        await db.query(
            "DELETE FROM vehicles WHERE id = $1",
            [req.params.id]
        );

        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


module.exports = {
    createVehicle,
    getVehicles,
    getVehicle,
    updateVehicle,
    deleteVehicle
}