const express = require('express');
const cors = require('cors');
require('dotenv').config();

const vehicleRouter = require('./routes/vehicleRoutes')
const driverRoutes = require('./routes/driverRoutes')
const tripRoutes = require('./routes/tripsRoute');
const fuelRoutes = require('./routes/fuelRoute');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/vehicles', vehicleRouter);
app.use('/driver', driverRoutes);

app.use('/trips', tripRoutes);
app.use('/fuel', fuelRoutes);

app.get('/api/check', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
server.on('error', (e) => {
  console.error("SERVER ERROR:", e);
});
