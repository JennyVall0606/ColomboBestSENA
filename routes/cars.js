const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

async function searchCars(pickUpEntityId, pickUpDate, pickUpTime, dropOffDate, dropOffTime, driverAge, currency) {
    try {
        const response = await axios.get('https://sky-scanner3.p.rapidapi.com/cars/search', {
            params: { pickUpEntityId, pickUpDate, pickUpTime, dropOffDate, dropOffTime, driverAge, currency },
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': 'sky-scanner3.p.rapidapi.com'
            }
        });

        console.log('API Response:', response.data); // Ver la respuesta de la API

        if (!response.data || !response.data.data || !response.data.data.cars) {
            return [];
        }

        return response.data.data.cars.map(car => ({
            name: car.name,
            price: car.price?.formatted || 'No disponible',
            supplier: car.supplier?.name || 'No disponible',
            image: car.image?.url || '',
            url: car.url || ''
        }));

    } catch (error) {
        console.error('Error en searchCars:', error.response?.data || error.message);
        return [];
    }
}

router.get('/', async (req, res) => {
    try {
        const { pickUpEntityId, pickUpDate, pickUpTime, dropOffDate, dropOffTime, driverAge, currency } = req.query;

        if (!pickUpEntityId || !pickUpDate || !pickUpTime || !dropOffDate || !dropOffTime || !driverAge || !currency) {
            return res.status(400).json({ error: 'Faltan parámetros en la solicitud' });
        }

        const cars = await searchCars(pickUpEntityId, pickUpDate, pickUpTime, dropOffDate, dropOffTime, driverAge, currency);

        if (cars.length === 0) {
            return res.status(404).json({ error: 'No se encontraron autos' });
        }

        res.json({ cars });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta de prueba
router.get('/test', (req, res) => {
    res.json({ message: 'Ruta de autos funcionando' });
});

module.exports = router;
