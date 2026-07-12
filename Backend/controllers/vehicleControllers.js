const prisma = require("../config/prisma");
const { Prisma } = require("@prisma/client");


// Create Vehicle
const createVehicle = async(req,res)=>{
    try{
        const {
            registration_no,
            name,
            type,
            max_load_capacity,
            odometer,
            acquisition_cost,
            status
        } = req.body;

        const existing = await prisma.vehicle.findUnique({

            where:{
                registration_no
            }

        });

        if(existing){

            return res.status(400).json({
                message:"Registration number already exists"
            });

        }

        const vehicle = await prisma.vehicle.create({

            data:{
                registration_no,
                name,
                type,
                max_load_capacity:
                    new Prisma.Decimal(max_load_capacity),
                odometer:
                    odometer 
                    ? new Prisma.Decimal(odometer)
                    : 0,
                acquisition_cost:
                    new Prisma.Decimal(acquisition_cost),
                status: status || "Available"

            }

        });
        
        res.status(201).json({

            success:true,

            vehicle

        });


    }
    catch(error){

        console.log(error);

        res.status(500).json({

            message:error.message

        });

    }

};

// Get all Vehicles
const getVehicles = async (req, res) => {

    try {

        const vehicles = await prisma.vehicle.findMany({

            orderBy: {
                id: "asc"
            }

        });


        res.status(200).json({

            success: true,

            vehicles

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// Get Single Vehicle
const getVehicle = async (req, res) => {

    try {

        const id = Number(req.params.id);


        const vehicle = await prisma.vehicle.findUnique({

            where: {
                id
            }

        });


        if (!vehicle) {

            return res.status(404).json({

                success: false,

                message: "Vehicle not found"

            });

        }


        res.status(200).json({

            success: true,

            vehicle

        });



    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// Update Vehicle
const updateVehicle = async (req, res) => {

    try {

        const id = Number(req.params.id);


        const {
            registration_number,
            vehicle_name,
            vehicle_type,
            max_load_capacity,
            odometer,
            acquisition_cost,
            status
        } = req.body;



        // Check vehicle exists

        const vehicle = await prisma.vehicle.findUnique({

            where: {
                id
            }

        });



        if (!vehicle) {

            return res.status(404).json({

                message: "Vehicle not found"

            });

        }



        // Check duplicate registration number

        if (registration_number) {

            const duplicate = await prisma.vehicle.findFirst({

                where: {

                    registration_no: registration_number,

                    NOT: {
                        id
                    }

                }

            });



            if (duplicate) {

                return res.status(400).json({

                    message: "Registration number already exists"

                });

            }

        }




        const updatedVehicle = await prisma.vehicle.update({

            where: {
                id
            },


            data: {

                registration_no: registration_number,

                name: vehicle_name,

                type: vehicle_type,


                max_load_capacity: max_load_capacity
                    ? new Prisma.Decimal(max_load_capacity)
                    : undefined,


                odometer: odometer
                    ? new Prisma.Decimal(odometer)
                    : undefined,


                acquisition_cost: acquisition_cost
                    ? new Prisma.Decimal(acquisition_cost)
                    : undefined,


                status

            }

        });



        res.status(200).json({

            success: true,

            message: "Vehicle updated successfully",

            vehicle: updatedVehicle

        });



    } catch (error) {


        res.status(500).json({

            success: false,

            message: error.message

        });


    }

};

// Delete Vehicle
const deleteVehicle = async (req, res) => {

    try {

        const id = Number(req.params.id);



        const vehicle = await prisma.vehicle.findUnique({

            where: {
                id
            }

        });



        if (!vehicle) {

            return res.status(404).json({

                message: "Vehicle not found"

            });

        }




        await prisma.vehicle.delete({

            where: {
                id
            }

        });



        res.status(200).json({

            success: true,

            message: "Vehicle deleted successfully"

        });



    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    createVehicle,

    getVehicles,

    getVehicle,

    updateVehicle,

    deleteVehicle

};